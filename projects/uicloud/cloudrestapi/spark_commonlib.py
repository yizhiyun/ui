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
        logfile = logging.FileHandler(logpath)
        logfile.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(module)s %(message)s'))
        logger.addHandler(logfile)
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

    return '''
    def getDataFrameFromSource(jsonData, userTableUrl):
        """
        get spark DataFrame once the input data source is valid.
        """

        columnList = "*"
        if "columns" in jsonData.keys():
            columnList = list(jsonData['columns'].keys())

        if ("sourceType" in jsonData.keys()) and (jsonData["sourceType"] == "hdfs"):
            if ("hdfsUrl" in jsonData.keys()) and jsonData["hdfsUrl"].startswith("hdfs:"):
                url = jsonData["hdfsUrl"]
            else:
                url = userTableUrl
            try:
                df1 = spark.read.parquet(url).select(columnList)
            except Exception:
                logger.debug("url:{{}}".format(url))
                traceback.print_exc()
                return False

        else:
            dbSourceDict = jsonData["dbsources"][jsonData["source"]]
            dbType = dbSourceDict["dbtype"]
            dbServer = dbSourceDict["dbserver"]
            dbPort = dbSourceDict["dbport"]
            user = dbSourceDict["user"]
            password = dbSourceDict["password"]

            dbName = jsonData["database"]
            tableName = jsonData["tableName"]

            connUrl = "jdbc:{{0}}://{{1}}:{{2}}".format(dbType, dbServer, dbPort)
            dbTable = "{{0}}.{{1}}".format(dbName, tableName)

            connDbTable = dbTable
            if dbType == "oracle":
                sid = dbSourceDict["sid"]
                connUrl = "jdbc:{{0}}:thin:@{{1}}:{{2}}:{{3}}".format(dbType, dbServer, dbPort, sid)
            elif dbType == "postgresql":
                connUrl = "jdbc:{{0}}://{{1}}".format(dbType, dbServer)
            elif dbType == "sqlserver":
                connUrl = "jdbc:{{0}}://{{1}}:{{2}};databaseName={{3}}".format(dbType, dbServer, dbPort, dbName)
                connDbTable = tableName

            try:
                df1 = spark.read \
                    .format("jdbc") \
                    .option("url", connUrl) \
                    .option("dbtable", connDbTable) \
                    .option("user", user) \
                    .option("password", password) \
                    .load().select(columnList)
            except Exception:
                traceback.print_exc()
                print(sys.exc_info())
                return False
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
        from pyspark.sql.functions import udf
        from pyspark.sql.types import BooleanType

        logger.debug("tableDict:{0}".format(tableDict))
        if 'columns' in tableDict.keys():
            columnList = list(tableDict['columns'].keys())
            logger.debug("condIt:{0}".format(columnList))
            inDataFrame=inDataFrame.select(columnList)

        if "conditions" in tableDict.keys():
            # add the specified conditions in the DataFrame
            for condIt in tableDict["conditions"]:
                condType = condIt["type"]
                colName = condIt["columnName"] if "columnName" in condIt.keys() else ""
                logger.debug("condIt:{0}".format(condIt))
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
                    inDataFrame = inDataFrame.filter(
                        udf(lambda column: not column.startswith(condIt["value"]), BooleanType())(inDataFrame[colName]))
                elif condType == "endswith":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].endswith(condIt["value"]))
                elif condType == "notendswith":
                    inDataFrame = inDataFrame.filter(
                        udf(lambda column: not column.endswith(condIt["value"]), BooleanType())(inDataFrame[colName]))
                elif condType == "contains":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].contains(condIt["value"]))
                elif condType == "notcontains":
                    inDataFrame = inDataFrame.filter(
                        udf(lambda column: not column.contains(condIt["value"]), BooleanType())(inDataFrame[colName]))
                elif condType == "isin":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isin(condIt["value"]))
                elif condType == "isnotin":
                    inDataFrame = inDataFrame.filter(
                        udf(lambda column: not column.isin(condIt["value"]), BooleanType())(inDataFrame[colName]))
                elif condType == "isnull":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isNull())
                elif condType == "isnotnull":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isNotNull())
                else:
                    pass
        return inDataFrame
    '''
