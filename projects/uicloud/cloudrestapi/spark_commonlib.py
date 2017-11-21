import logging

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.spark_commonlib")


def setupLoggingSparkCode():
    """
    return the spark code which provide the logger to be used.
    """

    return '''
    # set up logging to spark-excutedby-livy.log
    def setupLogging():
        import logging

        logpath = '/opt/spark/logs/spark-excutedby-livy.log'
        logger = logging.getLogger("sparkExecutedBylivy")

        # Set level of logger source.  Use debug for development time options, then bump it up
        # to logging.INFO after your script is working well to avoid excessive logging.

        logger.setLevel(logging.INFO)
        if not logger.handlers:
            loghandler = logging.FileHandler(logpath)
            loghandler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(funcName)s %(message)s'))
            logger.addHandler(loghandler)
        return logger

    logger = setupLogging()
    '''


def specialDataTypesEncoderSparkCode():
    """
    return the spark code which provide the specialDataTypesEncoder class to be used.
    """

    return '''
    import json
    import decimal
    import datetime

    class SpecialDataTypesEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, decimal.Decimal):
                return float(obj)
            elif isinstance(obj, (datetime.datetime, datetime.date)):
                return obj.isoformat()
            elif isinstance(obj, datetime.timedelta):
                return (datetime.datetime.min + obj).time().isoformat()
            else:
                return super(SpecialDataTypesEncoder, self).default(obj)
    '''


def getDataFrameFromSourceSparkCode():
    """
    return the spark code which provide the specialDataTypesEncoder class to be used.
    """

    return filterDataFrameSparkCode() + aggDataFrameSparkCode() + splitColumnSparkCode() + '''
    def getDataFrameFromSource(jsonData, hdfsHost="spark-master0", hdfsPort="9000",
                               rootFolder="/users", removedColsDict={}, maxRowCount=10000):
        """
        get spark DataFrame once the input data source is valid.
        userTableUrl, it's just used for hdfs customized url.
        removedColsDict, it's just used for the generateNewDataFrame function.
        """
        from pyspark.sql.utils import AnalysisException

        if ("sourcetype" in jsonData.keys()) and (jsonData["sourcetype"] in ["hdfs", "tmptables"]):
            if ("hdfsurl" in jsonData.keys()) and jsonData["hdfsurl"].startswith("hdfs://"):
                url = jsonData["hdfsurl"]
            elif ("hdfsUrl" not in jsonData.keys() or not jsonData["hdfsUrl"].startswith("hdfs://")):
                hHost = jsonData["hhost"] if "hhost" in jsonData.keys() else hdfsHost
                hPort = jsonData["hport"] if "hport" in jsonData.keys() else hdfsPort
                rFolder = jsonData["rfolder"] if "rfolder" in jsonData.keys() else rootFolder
                userName = jsonData["database"]
                tableName = jsonData["tableName"]
                url = "hdfs://{0}:{1}{2}/{3}/{4}".format(hHost, hPort, rFolder, userName, tableName)
            logger.debug(u"url:{0}".format(url))
            if url is None:
                errmsg = "The url hasn't been given. Please provide it."
                logger.error(errmsg)
                return False
            try:
                df1 = spark.read.parquet(url)
            except AnalysisException as e:
                print("AnalysisException: {0}".format(e.desc))
                logger.error("Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
                return False
            except Exception:
                traceback.print_exc()
                logger.error(u"There is an error while reading {0}. Exception:{1}, Traceback: {2}"
                             .format(url, sys.exc_info(), traceback.format_exc()))
                return False

        else:
            dbSourceDict = jsonData["dbsource"]
            keySet = set(["dbtype", "dbserver", "dbport", "user", "password"])
            if not keySet.issubset(dbSourceDict.keys()):
                logger.error("Please make sure that the dbsource keys include all keys {0}".format(keySet))
                return False
            dbType = dbSourceDict["dbtype"]
            dbServer = dbSourceDict["dbserver"]
            dbPort = dbSourceDict["dbport"]
            user = dbSourceDict["user"]
            password = dbSourceDict["password"]

            dbName = jsonData["database"]
            tableName = jsonData["tableName"]

            connUrl = "jdbc:{0}://{1}:{2}".format(dbType, dbServer, dbPort)
            dbTable = "{0}.{1}".format(dbName, tableName)

            # check the "removedColumns" item, remove them from table columns
            if dbTable in removedColsDict.keys():
                for colItem in removedColsDict:
                    if colItem in jsonData['columns'].keys():
                        jsonData['columns'].pop(colItem)

            connDbTable = dbTable
            if dbType == "oracle":
                if "sid" not in dbSourceDict:
                    logger.error("The 'sid' must in the dbsource keys when connect to oracle.")
                    return False
                sid = dbSourceDict["sid"]
                connUrl = "jdbc:{0}:thin:@{1}:{2}:{3}".format(dbType, dbServer, dbPort, sid)
            elif dbType == "postgresql":
                connUrl = "jdbc:{0}://{1}".format(dbType, dbServer)
            elif dbType == "sqlserver":
                connUrl = "jdbc:{0}://{1}:{2};databaseName={3}".format(dbType, dbServer, dbPort, dbName)
                connDbTable = tableName
            logger.debug(u"connUrl:{0},connDbTable:{1}".format(connUrl, connDbTable))

            try:
                df1 = spark.read \
                    .format("jdbc") \
                    .option("url", connUrl) \
                    .option("dbtable", connDbTable) \
                    .option("user", user) \
                    .option("password", password) \
                    .option("useUnicode", True) \
                    .option("characterEncoding","utf8") \
                    .load()

            except Exception:
                traceback.print_exc()
                logger.error("Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
                return False

        # set the maxRow if it exists.
        maxRow = maxRowCount
        if "conditions" in jsonData.keys():
            for condIt in jsonData["conditions"]:
                if condIt["type"] == "limit" and type(condIt["value"]) == int:
                    maxRows = condIt["value"]

        if maxRow is False or maxRow == -1:
            df1 = filterDF(df1, jsonData)
            df1 = aggDF(df1, jsonData)
        else:
            df1 = filterDF(df1.limit(maxRow), jsonData)
            df1 = aggDF(df1.limit(maxRow), jsonData)
        df1 = splitColumn(df1, jsonData)
        return df1
    '''


def filterDataFrameSparkCode():
    """
    return the spark code which filter the DataFrame according the specified format.
    """

    return '''
    def filterDF(inDataFrame, tableDict):
        """
        """
        columnList = "*"
        logger.debug(u"tableDict:{0}".format(tableDict))
        if 'columns' in tableDict.keys():
            columnList = list(tableDict['columns'].keys())
            logger.debug(u"columnList:{0}".format(columnList))
            inDataFrame=inDataFrame.select(columnList)

        if "conditions" in tableDict.keys():
            # add the specified conditions in the DataFrame
            for condIt in tableDict["conditions"]:
                condType = condIt["type"]
                colExpr = F.expr(condIt["columnName"]) if "columnName" in condIt.keys() else ""
                logger.debug(u"condIt:{0}".format(condIt))
                if condType == "limit" and type(condIt["value"]) == int:
                    inDataFrame = inDataFrame.limit(condIt["value"])
                elif condType in [">",">=","=","==","<","<=","!="]:
                    condStr = u"{0} {1} '{2}'".format(condIt["columnName"], condType, condIt["value"])
                    inDataFrame = inDataFrame.filter(condStr)
                elif condType == "like":
                    inDataFrame = inDataFrame.filter(colExpr.like(condIt["value"]))
                elif condType == "startswith":
                    inDataFrame = inDataFrame.filter(colExpr.startswith(condIt["value"]))
                elif condType == "notstartswith":
                    inDataFrame = inDataFrame.filter(~colExpr.startswith(condIt["value"]))
                elif condType == "endswith":
                    inDataFrame = inDataFrame.filter(colExpr.endswith(condIt["value"]))
                elif condType == "notendswith":
                    inDataFrame = inDataFrame.filter(~colExpr.endswith(condIt["value"]))
                elif condType == "contains":
                    inDataFrame = inDataFrame.filter(colExpr.contains(condIt["value"]))
                elif condType == "notcontains":
                    inDataFrame = inDataFrame.filter(~colExpr.contains(condIt["value"]))
                elif condType == "isin":
                    inDataFrame = inDataFrame.filter(colExpr.isin(condIt["value"]))
                elif condType == "isnotin":
                    inDataFrame = inDataFrame.filter(~colExpr.isin(condIt["value"]))
                elif condType == "isnull":
                    inDataFrame = inDataFrame.filter(colExpr.isNull())
                elif condType == "isnotnull":
                    inDataFrame = inDataFrame.filter(colExpr.isNotNull())
                else:
                    pass
        return inDataFrame
    '''


def aggDataFrameSparkCode():
    """
    return the spark code which aggregate the DataFrame according the specified format.
    """

    return '''
    from pyspark.sql import functions as F


    def aggDF(inDF, tableDict):
        """
        """

        logger.debug(u"tableDict:{0}".format(tableDict))
        if "expressions" in tableDict.keys():
            expresDict = tableDict["expressions"]
            exprlist = [F.expr(exprItem["exprstr"]).alias(exprItem["alias"]) for exprItem in expresDict["exprlist"]]
            logger.debug("exprlist: {0}".format(exprlist))
            if "groupby" in expresDict.keys() and expresDict["groupby"]:
                grpCols = []
                for grpitem in expresDict["groupby"]:
                    if isinstance(grpitem, str) or isinstance(grpitem, unicode):
                        grpCols.append(grpitem)
                    elif isinstance(grpitem, dict):
                        grpCols.append(F.expr(grpitem["exprstr"]).alias(grpitem["alias"]))
                    else:
                        logger.warn("The groupby item of {0} is invalid. Type: {1}".format(grpitem, type(grpitem)))
                logger.debug("grpCols: {0}".format(grpCols))
                grpData = inDF.groupBy(grpCols)
                if "pivot" in expresDict.keys() and expresDict["pivot"].strip():
                    ptdict = expresDict["pivot"].strip()
                    if "values" in ptdict.keys():
                        grpData = grpData.pivot(ptdict["col"], ptdict["value"])
                    else:
                        grpData = grpData.pivot(ptdict["col"])
                inDF = grpData.agg(*exprlist)
            else:
                inDF = inDF.select(exprlist)
            if "orderby" in expresDict.keys():
                inDF = inDF.orderBy(expresDict["orderby"])
            if "postaggs" in expresDict.keys():
                colList = getCols(expresDict["postaggs"])
                inDF = inDF.select(*colList)
                pdStats = False
                postAggLt = ["median", "mode"]
                for postAggIt in expresDict["postaggs"]:
                    aggType = postAggIt["type"]
                    logger.debug(u"postAggIt: {0}".format(postAggIt))
                    if aggType in postAggLt:
                        if "alias" in postAggIt.keys():
                            as1 = postAggIt["alias"]
                        else:
                            as1 = "{0}_{1}".format(postAggIt["alias"], postAggIt["col"])
                        pdf1 = inDF.select(F.col(postAggIt["col"]).alias(as1)).toPandas()
                        if pdStats:
                            pdStats.append(pdf1.agg(aggType))
                        else:
                            pdStats = pdf1.agg(aggType)
                    else:
                        pass
                if not pdStats:
                    inDF = spark.createDataFrame(pdStats.to_frame().T)

        if "trans" in tableDict.keys():
            # add the specified aggregations in the DataFrame
            transDict = tableDict["trans"]
            logger.debug("transDict:{0}".format(transDict))
            transmode = "drop" if "transmode" in transDict.keys else transDict["transmode"]
            if "pretrans" in transDict.keys():
                colList = inDF.columns if transmode == "append" else []
                colList.extends(getCols(transDict["pretrans"]))

                inDF = inDF.select(*colList)
            if "groupby" in transDict.keys():
                grpData = inDF.groupby(transDict["groupby"])
            else:
                grpData = inDF.groupby()

            if "pivot" in transDict.keys():
                ptdict = transDict["pivot"]
                if "values" in ptdict.keys():
                    grpData = grpData.pivot(ptdict["col"], ptdict["value"])
                else:
                    grpData = grpData.pivot(ptdict["col"])

            if "aggdict" in transDict.keys():
                inDF = grpData.agg(transDict["aggdict"])
            elif "aggregations" in transDict.keys():
                cols = []
                aggLt = ["approx_count_distinct", "avg", "collect_list", "collect_set", "count", "max",
                         "min", "first", "last", "sum", "sumDistinct"]
                for aggIt in transDict["aggregations"]:
                    aggType = aggIt["type"]
                    logger.debug(u"aggIt: {0}".format(aggIt))
                    if aggType in aggLt:
                        if "alias" in aggIt.keys():
                            cols.append(F.__getattribute__(aggType)(aggIt["col"]).alias(aggIt["alias"]))
                        else:
                            cols.append(F.__getattribute__(aggType)(aggIt["col"]))
                    else:
                        pass
                if len(cols) > 0:
                    inDF = grpData.agg(*cols)

            if "posttrans" in transDict.keys():
                colList = inDF.columns if transmode == "append" else []
                colList.extends(getCols(transDict["posttrans"]))
                inDF = inDF.select(*colList)
            if "orderby" in transDict.keys():
                inDF = inDF.orderBy(transDict["orderby"])
        return inDF


    def getCols(operList):
        """
        get the columns operations' results.
        """
        selectCols = []
        logger.debug("operList: {0}".format(operList))
        for itemdt in operList:
            col = getOperCol(itemdt)
            if isinstance(col, list):
                selectCols.extends(col)
            else:
                selectCols.append(col)
        return selectCols


    def getOperCol(operDict):
        """
        """
        logger.debug("operDict: {0}".format(operDict))
        colVal = operDict["col"]
        if isinstance(colVal, int) or isinstance(colVal, float):
            col = colVal
        elif isinstance(colVal, str) or isinstance(colVal, unicode):
            col = F.col(colVal)
        elif isinstance(colVal, dict):
            col = getOperCol(colVal)
        else:
            logger.error("The col's value doesn't meet the requirement.value: {0}, \
                type: {1}".format(colVal, type(colVal)))
            return False

        if "unarytype" in operDict.keys():
            col = F.__getattribute__(operDict["unarytype"])(col)

        if "operations" in operDict.keys():
            for opIt in operDict["operations"]:
                opColVal = opIt["col"]
                if "+" == opIt["type"]:
                    if isinstance(opColVal, int) or isinstance(opColVal, float):
                        col = col + opColVal
                    elif isinstance(opColVal, str) or isinstance(opColVal, unicode):
                        col = col + F.col(opIt["col"])
                    elif isinstance(opColVal, dict):
                        resCol = getOperCol(opColVal, inDF)
                        if resCol:
                            col = col + resCol
                        else:
                            logger.error("The col's value doesn't meet the \
                                requirement. column value: {0}".format(opColVal))
                            return False
                elif "-" == opIt["type"]:
                    if isinstance(opColVal, int) or isinstance(opColVal, float):
                        col = col - opColVal
                    elif isinstance(opColVal, str) or isinstance(opColVal, unicode):
                        col = col - F.col(opIt["col"])
                    elif isinstance(opColVal, dict):
                        resCol = getOperCol(opColVal, inDF)
                        if resCol:
                            col = col - resCol
                        else:
                            logger.error("The col's value doesn't meet the \
                                requirement. column value: {0}".format(opColVal))
                            return False
                elif "*" == opIt["type"]:
                    if isinstance(opColVal, int) or isinstance(opColVal, float):
                        col = col * opColVal
                    elif isinstance(opColVal, str) or isinstance(opColVal, unicode):
                        col = col * F.col(opIt["col"])
                    elif isinstance(opColVal, dict):
                        resCol = getOperCol(opColVal, inDF)
                        if resCol:
                            col = col * resCol
                        else:
                            logger.error("The col's value doesn't meet the \
                                requirement. column value: {0}".format(opColVal))
                            return False
                elif "/" == opIt["type"]:
                    if isinstance(opColVal, int) or isinstance(opColVal, float):
                        col = col / opColVal
                    elif isinstance(opColVal, str) or isinstance(opColVal, unicode):
                        col = col / F.col(opIt["col"])
                    elif isinstance(opColVal, dict):
                        resCol = getOperCol(opColVal, inDF)
                        if resCol:
                            col = col / resCol
                        else:
                            logger.error("The col's value doesn't meet the \
                                requirement. column value: {0}".format(opColVal))
                            return False
        if "alias" in operDict.keys():
            col = col.alias(operDict["alias"])
        return col
    '''


def splitColumnSparkCode():
    '''
    '''
    return '''
    def splitColumn(inDF, jsonData):
        logger.debug(u"jsonData:{0}".format(jsonData))
        if "customized" in jsonData.keys():
            import pyspark.sql.types as T
            arrlenFunc = F.udf(lambda arr: len(arr), T.IntegerType())

            customizedList = jsonData["customized"]
            for customized in customizedList:
                selectCols = inDF.columns
                splitCol = customized['col']
                newColPart = '{0}{1}'.format(splitCol, '_PART')
                custfuncs = customized['customizedfuncs']

                count = 0
                for column in selectCols:
                    if column.startswith(newColPart):
                        try:
                            int(column.replace(newColPart, ''))
                            count += 1
                        except Exception:
                            pass
                if custfuncs['type'] == 'splitbydelim' and len(custfuncs["parameters"]) == 1:
                    delimiter = custfuncs["parameters"][0]
                    maxLen = inDF.select(F.max(arrlenFunc(F.split(splitCol, delimiter))).alias('maxLen')).first().maxLen
                    for i in range(maxLen):
                        selectCols.append(F.split(splitCol, delimiter)[i].alias(
                                                "{0}{1}".format(newColPart, i + 1 + count)))
                elif custfuncs['type'] == 'splitbyposition' and len(custfuncs["parameters"]) > 0:
                    parasLt = [0]
                    for index in custfuncs["parameters"]:
                        parasLt.append(index)
                    lenLt2 = [parasLt[i + 1] - parasLt[i] for i in range(len(parasLt) - 1)]
                    # specified an enough length to make sure all strings from the last position to end included.
                    lenLt2.append(10**9)
                    for i in range(len(lenLt2)):
                        selectCols.append(F.substring(splitCol, parasLt[i] + 1, lenLt2[i]).alias(
                            "{0}{1}".format(newColPart, i + 1 + count)))
                inDF = inDF.select(*selectCols)
        return inDF
    '''
