import logging
from .spark_commonlib import *
# from .data_handler import executeSpark, getReqFromDesiredReqState, getDbSource

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.mllib_handler")


def getBasicStatsSparkCode(jsonData, hdfsHost="spark-master0", hdfsPort="9000", rootFolder="users"):
    '''
    return the running spark code which will get the basic statistics information,
    Notes:
    hdfsHost, hdfsPort, rootFolder are available if jsonData["sourceType"] is hdfs and
    the hdfsUrl key isn't provided
    '''
    userTableUrl = ""
    if ("sourceType" in jsonData.keys()) and (jsonData["sourceType"] == "hdfs"):
        if ("hdfsUrl" not in jsonData.keys() or not jsonData["hdfsUrl"].startswith("hdfs:")):
            userName = jsonData["database"]
            tableName = jsonData["tableName"]
            userTableUrl = "hdfs://{0}:{1}/{2}/{3}/{4}".format(
                hdfsHost, hdfsPort, rootFolder, userName, tableName)

    sparkCode = '''
    import sys
    import traceback
    ''' + specialDataTypesEncoderSparkCode() + getDataFrameFromSourceSparkCode() + setupLoggingSparkCode() + '''
    def getBasicStats(opTypeList, dataFrame):
        """
        opTypeList might include the following value
        "count","sum","mean","median", "min","max","std","var",
        "skew","kurt","quarter1","quarter3","sem", "range", "mode"
        pandasDF1 is a pandas data frame
        it will output json data.
        """
        from pyspark.sql.types import DecimalType, FloatType, NumericType, DoubleType
        from pyspark.sql.functions import udf

        availTypeList = [
            "count", "sum", "mean", "median",
            "min", "max", "std", "var",
            "skew", "kurt", "quarter1", "quarter3",
            "sem", "cv", "range", "mode",
            "freq", "freqpercent"
        ]

        outputDict = {}
        freqDict = {}
        logger.debug("opTypeList: {0}, dataFrame.count:{1}".format(opTypeList, dataFrame.count()))
        if "freq" in opTypeList or "freqPercent" in opTypeList:
            rowCount = dataFrame.count()
            logger.debug("rowCount: {0}".format(rowCount))
            percentage = udf(lambda s: round(s/float(rowCount),4), FloatType())

            for col in dataFrame.columns:
                # skip the numeric columns
                if isinstance(dataFrame.schema[col].dataType, NumericType):
                    continue

                countDf = dataFrame.groupBy(col).count()
                freqDf =countDf.select(col, countDf["count"].alias("freq"), percentage("count").alias("freqpercent"))

                dictList1 = []
                for freqit in freqDf.collect():
                    dictList1.append(freqit.asDict())
                freqDict[col] = dictList1
        logger.debug("freqDict: {0}".format(freqDict))
        outputDict["freqs"] = freqDict

        # filter out the columns whose type isn't NumericType.
        columnList = []
        for sItem in dataFrame.schema:
            if isinstance(sItem.dataType, DecimalType):
                columnList.append(dataFrame[sItem.name].cast(FloatType()))
            elif isinstance(sItem.dataType, NumericType):
                columnList.append(dataFrame[sItem.name])
        logger.debug("columnList: {0}".format(columnList))

        statsDict = {}

        if len(columnList) == 0:
            outputDict["stats"] = statsDict
            return outputDict

        pandasDF1 = dataFrame.select(columnList).toPandas()

        for typeItem in opTypeList:
            typeItem = typeItem.strip()
            if typeItem not in availTypeList:
                continue

            if "count" == typeItem:
                statsDict["count"] = json.loads(pandasDF1.count().to_json())
            elif "sum" == typeItem:
                statsDict["sum"] = json.loads(pandasDF1.sum().to_json())
            elif "mean" == typeItem:
                statsDict["mean"] = json.loads(pandasDF1.mean().to_json())
            elif "median" == typeItem:
                statsDict["median"] = json.loads(pandasDF1.median().to_json())
            elif "min" == typeItem:
                statsDict["min"] = json.loads(pandasDF1.min().to_json())
            elif "max" == typeItem:
                statsDict["max"] = json.loads(pandasDF1.max().to_json())
            elif "std" == typeItem:
                statsDict["std"] = json.loads(pandasDF1.std().to_json())
            elif "var" == typeItem:
                statsDict["var"] = json.loads(pandasDF1.var().to_json())
            elif "skew" == typeItem:
                statsDict["skew"] = json.loads(pandasDF1.skew().to_json())
            elif "kurt" == typeItem:
                statsDict["kurt"] = json.loads(pandasDF1.kurt().to_json())
            elif "quarter1" == typeItem:
                statsDict["quarter1"] = json.loads(pandasDF1.quantile(0.25, interpolation='midpoint').to_json())
            elif "quarter3" == typeItem:
                statsDict["quarter3"] = json.loads(pandasDF1.quantile(0.75, interpolation='midpoint').to_json())
            elif "sem" == typeItem:
                statsDict["sem"] = json.loads(pandasDF1.sem().to_json())
            elif "cv" == typeItem:
                statsDict["cv"] = json.loads((pandasDF1.std()/pandasDF1.mean()).to_json())
            elif "range" == typeItem:
                statsDict["range"] = json.loads(pandasDF1.apply(lambda x: x.max() - x.min()).to_json())
            elif "mode" == typeItem:
                # statsDict["mode"] = json.loads(pandasDF1.mode().to_json())
                modeDict = {}
                rowNum = len(pandasDF1)
                for col in pandasDF1:
                    if rowNum == len(pandasDF1[col].mode()):
                        # set null if all values is distinct
                        modeDict[col]={}
                    else:
                        modeDict[col]=pandasDF1[col].mode().to_json()
                logger.debug("modeDict: {0}".format(modeDict))
                statsDict["mode"] = modeDict
            else:
                pass

        logger.debug("statsDict: {0}".format(statsDict))
        outputDict["stats"] = statsDict

        return outputDict
    ''' + '''
    df3 = getDataFrameFromSource({0}, '{1}')
    if df3:
        print(json.dumps(getBasicStats({0}["opTypes"], df3), cls = SpecialDataTypesEncoder))
    else:
        logger.error("Cannot get data from the given source!")
        print(False)
    '''.format(jsonData, userTableUrl)

    return sparkCode
