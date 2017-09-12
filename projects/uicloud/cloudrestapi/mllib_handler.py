import logging
from .spark_commonlib import *
# from .data_handler import executeSpark, getReqFromDesiredReqState, getDbSource

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.mllib_handler")


def getUserTableUrl(jsonData, hdfsHost="spark-master0", hdfsPort="9000", rootFolder="users"):
    """
    return hdfs Url if sourcetype is hdfs.
    """
    userTableUrl = ""
    if ("sourcetype" in jsonData.keys()) and (jsonData["sourcetype"] == "hdfs"):
        if ("hdfsUrl" not in jsonData.keys() or not jsonData["hdfsUrl"].startswith("hdfs:")):
            userName = jsonData["database"]
            tableName = jsonData["tableName"]
            userTableUrl = "hdfs://{0}:{1}/{2}/{3}/{4}".format(
                hdfsHost, hdfsPort, rootFolder, userName, tableName)
    return userTableUrl


def getBasicStatsSparkCode(jsonData, hdfsHost="spark-master0", hdfsPort="9000", rootFolder="users"):
    '''
    return the running spark code which will get the basic statistics information,
    Notes:
    hdfsHost, hdfsPort, rootFolder are available if jsonData["sourceType"] is hdfs and
    the hdfsUrl key isn't provided
    '''
    userTableUrl = getUserTableUrl(jsonData, hdfsHost, hdfsPort, rootFolder)

    sparkCode = '''
    import sys
    import traceback
    from pyspark.sql.types import DecimalType, FloatType, NumericType, DoubleType
    from pyspark.sql.functions import udf
    ''' + specialDataTypesEncoderSparkCode() + getDataFrameFromSourceSparkCode() + setupLoggingSparkCode() + '''
    def getBasicStats(opTypeList, dataFrame):
        """
        opTypeList might include the following value
        "count","sum","mean","median", "min","max","std","var",
        "skew","kurt","quarterdev","sem", "range", "mode"
        pandasDF1 is a pandas data frame
        it will output json data.
        """

        availTypeList = [
            "count", "sum", "mean", "median",
            "min", "max", "std", "var",
            "skew", "kurt", "quarterdev",
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
                statsDict["quarterdev"] = json.loads((pandasDF1.quantile(0.75, interpolation='midpoint') -
                    pandasDF1.quantile(0.25, interpolation='midpoint')).to_json())
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
    df3 = getDataFrameFromSource({0}, '{1}', maxRowCount=False)
    if df3:
        print(json.dumps(getBasicStats({0}["optypes"], df3), cls = SpecialDataTypesEncoder))
    else:
        logger.error("Cannot get data from the given source!")
        print(False)
    '''.format(jsonData, userTableUrl)

    return sparkCode


def getHypothesisTestSparkCode(jsonData, hdfsHost="spark-master0", hdfsPort="9000", rootFolder="users"):
    '''
    return the running spark code which will get the basic statistics information,
    Notes:
    hdfsHost, hdfsPort, rootFolder are available if jsonData["sourceType"] is hdfs and
    the hdfsUrl key isn't provided
    '''
    userTableUrl = getUserTableUrl(jsonData, hdfsHost, hdfsPort, rootFolder)

    sparkCode = '''
    import sys
    import traceback
    from scipy import stats
    from pyspark.ml.feature import VectorAssembler
    from pyspark.mllib.linalg import Matrices
    from pyspark.mllib.stat import Statistics
    import numpy as np
    from statsmodels.stats.diagnostic import lilliefors
    ''' + specialDataTypesEncoderSparkCode() + getDataFrameFromSourceSparkCode() + setupLoggingSparkCode() + '''
    def getNormalTest(colStr, dataFrame):
        """
        """
        # normal test
        if dataFrame.count() < 5000:
            normres = stats.shapiro(dataFrame.select(colStr).toPandas()[colStr])
            return {"W": normres[0], "pvalue": normres[1]}
        else:
            # normres = stats.kstest(dataFrame.select(colStr).toPandas()[colStr], "norm")
            # return {"statistic": normres.statistic, "pvalue": normres.pvalue}
            normres = lilliefors(dataFrame.select(colStr).toPandas()[colStr])
            logger.debug("normres: {0}, count: {1}".format(normres, dataFrame.count()))
            return {"statistic": normres[0], "pvalue": normres[1]}


    def getHypothesisTest(inParams, dataFrame):
        """
        it will output json data.
        """
        from scipy import stats


        outputDict = {}
        if "ttype" not in inParams.keys():
            logger.warn("Cannot get the 'ttype' key from {0}".format(inParams))
            return outputDict
        levres = False
        if "ttest_1samp" == inParams["ttype"]:
            outputDict["normaltest"] = getNormalTest(inParams["col_a"], dataFrame)
            res = stats.ttest_1samp(dataFrame.select(inParams["col_a"]).toPandas(), inParams["popmean"])

        elif "ttest_ind" == inParams["ttype"]:
            # res = stats.ttest_ind(
            #     dataFrame.select(inParams["col_a"]).toPandas(),
            #     dataFrame.select(inParams["col_b"]).toPandas(),
            #     inParams["popmean"]
            # )

            disdf = dataFrame.select(inParams["col_a"]).distinct()
            if disdf.count() != 2:
                logger.warn("The {0} column must be 2 categories while doing the ttest_ind test."
                            .format(inParams["col_a"]))
                return outputDict

            outputDict["normaltest"] = getNormalTest(inParams["col_b"], dataFrame)

            pdf1 = dataFrame \
                .filter(dataFrame[inParams["col_a"]] == disdf.collect()[0][inParams["col_a"]]) \
                .select(inParams["col_b"]) \
                .toPandas()
            pdf2 = dataFrame \
                .filter(dataFrame[inParams["col_a"]] == disdf.collect()[1][inParams["col_a"]]) \
                .select(inParams["col_b"]) \
                .toPandas()
            levres = stats.levene(pdf1, pdf2)
            # decide which independent method should be used. As for equal_var parameter, if True (default),
            # perform a standard independent 2 sample test that assumes equal population variances [R643].
            # If False, perform Welch’s t-test, which does not assume equal population variance [R644].
            if levres.pvalue > inParams["significance"]:
                res = stats.ttest_ind(pdf1, pdf2, equal_var=True)
            else:
                res = stats.ttest_ind(pdf1, pdf2, equal_var=False)

        elif "ttest_rel" == inParams["ttype"]:
            # res = stats.ttest_rel(
            #     dataFrame.select(inParams["col_a"]).toPandas(),
            #     dataFrame.select(inParams["col_b"]).toPandas(),
            #     inParams["popmean"]
            # )
            disdf = dataFrame.select(inParams["col_a"]).distinct()
            if disdf.count() != 2:
                logger.warn("The {0} column must be 2 categories while doing the ttest_rel test."
                            .format(inParams["col_a"]))
                return outputDict

            outputDict["normaltest"] = getNormalTest(inParams["col_b"], dataFrame)

            pdf1 = dataFrame \
                .filter(dataFrame[inParams["col_a"]] == disdf.collect()[0][inParams["col_a"]]) \
                .select(inParams["col_b"]) \
                .toPandas()
            pdf2 = dataFrame \
                .filter(dataFrame[inParams["col_a"]] == disdf.collect()[1][inParams["col_a"]]) \
                .select(inParams["col_b"]) \
                .toPandas()
            if pdf1.count()[inParams["col_b"]] != pdf2.count()[inParams["col_b"]]:
                logger.warn("The 2 categories must include the same rows' length while doing the ttest_rel test."
                            .format(inParams["col_a"]))
                return outputDict
            levres = stats.levene(pdf1, pdf2)
            res = stats.ttest_rel(pdf1, pdf2)

        elif "chiSqtest" == inParams["ttype"]:

            colaNum = dataFrame.select(inParams["col_a"]).distinct().count()
            bdf = dataFrame.select(inParams["col_b"]).distinct()
            colbNum = bdf.distinct().count()

            # get the feature list to be used.
            featlist = bdf.rdd.flatMap(lambda x: x).collect()

            # group by col_a and pivot col_b
            grpdf1 = dataFrame.groupBy(inParams["col_a"]).pivot(inParams["col_b"]).count()

            # transform columns to vector feature column
            vecAssembler = VectorAssembler(inputCols=featlist, outputCol="features")
            vecdf1 = vecAssembler.transform(grpdf1)
            arr1 = vecdf1.select("features").rdd.reduce(
                lambda x, y: np.concatenate((x.features.toArray(), y.features.toArray())))
            mat = Matrices.dense(colbNum, colaNum, arr1)
            res = Statistics.chiSqTest(mat)
            # pdf1 = dataFrame \
            #     .groupBy(inParams["col_a"], inParams["col_b"]) \
            #     .count() \
            #     .toPandas() \
            #     .pivot_table(values="count", index=[inParams["col_a"]], columns=[inParams["col_b"]]) \
            #     .fillna(0)
            # res = Statistics.chiSqTest(pdf1.as_matrix())
            logger.debug("statistic: {0}, pValue: {1}, degreesOfFreedom:{2}, method:{3}, nullHypothesis: {4}"
                         .format(res.statistic, res.pValue, res.degreesOfFreedom, res.method, res.nullHypothesis))
        else:
            logger.warn("Don't support other types.")

        if levres:
            outputDict["levenetest"] = {"statistic": levres.statistic.tolist(), "pvalue": levres.pvalue.tolist()}
        if inParams["ttype"] == "chiSqtest":
            outputDict["chiSqtest"] = {"statistic": res.statistic,
                                       "pvalue": res.pValue,
                                       "degreesOffreedom": res.degreesOfFreedom,
                                       "method": res.method,
                                       "nullhypothesis": res.nullHypothesis}
        else:
            outputDict[inParams["ttype"]] = {"statistic": res.statistic.tolist(), "pvalue": res.pvalue.tolist()}
        logger.debug("outputDict: {0}".format(outputDict))
        return outputDict
    ''' + '''
    df3 = getDataFrameFromSource({0}, '{1}', maxRowCount=False)
    if df3:
        print(json.dumps(getHypothesisTest({0}["inputparams"], df3), cls = SpecialDataTypesEncoder))
    else:
        logger.error("Cannot get data from the given source!")
        print(False)
    '''.format(jsonData, userTableUrl)

    return sparkCode
