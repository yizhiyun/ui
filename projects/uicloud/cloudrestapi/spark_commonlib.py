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

        logger.setLevel(logging.DEBUG)
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

    return filterDataFrameSparkCode() + '''
    def getDataFrameFromSource(jsonData, userTableUrl=None, removedColsDict={}, maxRowCount=10000):
        """
        get spark DataFrame once the input data source is valid.
        userTableUrl, it's just used for hdfs customized url.
        removedColsDict, it's just used for the generateNewDataFrame function.
        """

        if ("sourcetype" in jsonData.keys()) and (jsonData["sourcetype"] in ["hdfs", "tmptables"]):
            if ("hdfsurl" in jsonData.keys()) and jsonData["hdfsurl"].startswith("hdfs:"):
                url = jsonData["hdfsurl"]
            else:
                url = userTableUrl
            logger.debug(u"url:{0}".format(url))
            if url is None:
                errmsg = "The url hasn't been given. Please provide it."
                logger.error(errmsg)
                return False
            try:
                df1 = spark.read.parquet(url)
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
        else:
            df1 = filterDF(df1.limit(maxRow), jsonData)
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
                colName = condIt["columnName"] if "columnName" in condIt.keys() else ""
                logger.debug(u"condIt:{0}".format(condIt))
                if condType == "limit" and type(condIt["value"]) == int:
                    inDataFrame = inDataFrame.limit(condIt["value"])
                elif condType in [">",">=","=","==","<","<=","!="]:
                    condStr = "{0} {1} {2}".format(colName, condType, condIt["value"])
                    inDataFrame = inDataFrame.filter(condStr)
                elif condType == "like":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].like(condIt["value"]))
                elif condType == "startswith":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].startswith(condIt["value"]))
                elif condType == "notstartswith":
                    inDataFrame = inDataFrame.filter(~inDataFrame[colName].startswith(condIt["value"]))
                elif condType == "endswith":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].endswith(condIt["value"]))
                elif condType == "notendswith":
                    inDataFrame = inDataFrame.filter(~inDataFrame[colName].endswith(condIt["value"]))
                elif condType == "contains":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].contains(condIt["value"]))
                elif condType == "notcontains":
                    inDataFrame = inDataFrame.filter(~inDataFrame[colName].contains(condIt["value"]))
                elif condType == "isin":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isin(condIt["value"]))
                elif condType == "isnotin":
                    inDataFrame = inDataFrame.filter(~inDataFrame[colName].isin(condIt["value"]))
                elif condType == "isnull":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isNull())
                elif condType == "isnotnull":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isNotNull())
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
        if "trans" in tableDict.keys():
            # add the specified aggregations in the DataFrame
            transDict = tableDict["trans"]
            if "pretrans" in transDict.keys():
                colList = getCols(transDict["pretrans"])
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

            if "aggdict" in transDict:
                inDF = grpData.agg(transDict["aggdict"])
            elif "aggregations" in transDict:
                cols = []
                for aggIt in transDict["aggregations"]:
                    aggType = aggIt["type"]
                    logger.debug(u"aggIt: {0}".format(aggIt))
                    if aggType in ["avg", "count", "max", "min", "sum", "approx_count_distinct"]:
                        if "alias" in aggIt.keys():
                            cols.append(F.__getattribute__(aggType)(aggIt["col"]).alias(aggIt["alias"]))
                        else:
                            cols.append(F.__getattribute__(aggType)(aggIt["col"]))
                    else:
                        pass
                inDF = grpData.agg(*cols)
            elif "posttrans" in transDict.keys():
                colList = getCols(transDict["posttrans"])
                inDF = inDF.select(*colList)
            if "orderby" in transDict.keys():
                outDF = inDF.orderBy(transDict["orderby"])
        return outDF


    def getCols(operList):
        """
        get the columns operations' results.
        """
        selectCols = []
        for itemdt in operList:
            selectCols.append(getOperCol(itemdt))
        return selectCols


    def getOperCol(operDict):
        """
        """
        colVal = operDict["col"]
        if isinstance(colVal, int) or isinstance(colVal, float):
            col = colVal
        elif isinstance(colVal, str) or isinstance(colVal, unicode):
            col = F.col(colVal)
        elif isinstance(colVal, dict):
            col = getOperCol(colVal)
        else:
            logger.error("The col's value doesn't meet the requirement. \
                value: {0}, type: {1}".format(colVal, type(colVal)))
            return False

        if "operations" in operDict.keys():
            for opIt in operDict["operations"]:
                opColVal = opIt["col"]
                if "+" == opIt["type"]:
                    if isinstance(opColVal, int) or isinstance(opColVal, float):
                        col = col + opColVal
                    elif isinstance(opColVal, str) or isinstance(opColVal, unicode):
                        col = col + F.col(opIt["col"])
                    elif isinstance(opColVal, dict):
                        resCol = getOperCol(opColVal)
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
                        resCol = getOperCol(opColVal)
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
                        resCol = getOperCol(opColVal)
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
                        resCol = getOperCol(opColVal)
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
