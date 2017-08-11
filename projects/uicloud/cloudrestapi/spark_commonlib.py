import logging

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.spark_commonlib")

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
                print("url:{{}}".format(url))
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
