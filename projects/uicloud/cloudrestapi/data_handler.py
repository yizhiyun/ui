import json
import logging
import requests
import textwrap
import time
import os


from .spark_commonlib import *
from .upload import *
from dataCollection.gxmHandleClass.Singleton import Singleton

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.data_handler")


def executeSpark(sparkCode,
                 pyFiles=[],
                 sparkHost='http://spark-master0:8998',
                 checkDesiredState='available',
                 maxCheckCount=300,
                 reqCheckDuration=1):
    '''
    '''
    host = sparkHost
    sessionData = {
        'kind': 'pyspark',
        'pyFiles': pyFiles
    }
    headers = {'Content-Type': 'application/json'}

    # check if there is a session to be used, if not or the last session kind
    # is not pyspark, create one.
    rootSessionsUrl = host + '/sessions'
    curSessionsReqJson = requests.get(rootSessionsUrl, headers=headers).json()
    noValidSession = True
    if (curSessionsReqJson['total'] > 0):
        for sItem in curSessionsReqJson['sessions']:
            if (sItem['kind'] == 'pyspark') and (sItem['state'] == 'idle'):
                sessionUrl = "{0}/{1}".format(rootSessionsUrl, sItem['id'])
                noValidSession = False
                break
    if noValidSession:
        newSessionReqJson = requests.post(
            rootSessionsUrl, data=json.dumps(sessionData), headers=headers).json()
        # pprint.pprint(newSessionReqJson)
        logger.debug("Start a new Session. newSessionReqJson:{0}".format(newSessionReqJson))
        sessionUrl = "{0}/{1}".format(rootSessionsUrl, newSessionReqJson['id'])

        reqJsonTmp = getReqFromDesiredReqState(sessionUrl)
        if reqJsonTmp["state"] in ["error", "cancel", "waitting"]:
            # requests.delete(sessionUrl, headers=headers)
            return False

    # execute spark codes
    runData = {
        'code': textwrap.dedent(sparkCode)
    }
    statementsUrl = sessionUrl + '/statements'
    sparkCodesReq = requests.post(
        statementsUrl, data=json.dumps(runData), headers=headers)
    logger.debug("Request a livy job. sparkCodesReq:{0}, headers:{1}".format(
        sparkCodesReq.json(), sparkCodesReq.headers))

    resultReqJson = getReqFromDesiredReqState(host + sparkCodesReq.headers['location'],
                                              desiredState=checkDesiredState,
                                              maxReqCount=maxCheckCount,
                                              eachSleepDuration=reqCheckDuration)

    if resultReqJson["state"] in ["error", "cancel"]:
        # requests.delete(sessionUrl, headers=headers)
        return False
    elif resultReqJson["state"] == "waitting":
        return {"status": "waitting", "msg": "The job hasn't been finished. You can check it later."}

    # logger.debug("resultReqJson:{0}".format(resultReqJson))

    results = resultReqJson['result']['output']

    return results


def getReqFromDesiredReqState(reqUrl, headers={'Content-Type': 'application/json'},
                              desiredState='idle', maxReqCount=120, eachSleepDuration=1):
    '''
    '''
    reqCount = 0
    reqJson = requests.get(reqUrl, headers=headers).json()
    logger.debug("Step:{0}, state:{1}".format(reqCount, reqJson['state']))
    while reqCount < maxReqCount and reqJson['state'] != desiredState:
        if reqJson['state'] == 'error':
            logger.error(
                "There is an error in Step-{0}, see the details for the response:{1}".format(reqCount, reqJson))
            return {"state": "error"}
        if reqJson['state'] in ['cancelled', 'cancelling']:
            logger.error(
                "The job has been cancelled in Step-{0}, see the details for the response:{1}"
                .format(reqCount, reqJson))
            return {"state": "cancel"}
        # sleep half a second
        time.sleep(eachSleepDuration)
        reqCount = reqCount + 1
        reqJson = requests.get(reqUrl, headers=headers).json()

        logger.debug("Step:{0}, state:{1}".format(reqCount, reqJson['state']))

    if reqCount >= maxReqCount:
        logger.warn("Request count has exceeded the maxReqCount({0})".format(maxReqCount))
        return {"state": "waitting"}

    return {"state": "ok", "result": reqJson}


def getOutputColumns(jsonData):
    '''
    check the valid columns
    '''

    # check the json format
    if ("tables" not in jsonData.keys()) or ("relationships" not in jsonData.keys()):
        errMsg = "ERROR, The jsonData don't include 'tables' or 'relationships'."
        logger.error(errMsg)
        return False

    tables = jsonData["tables"]
    tableNum = len(tables)

    # save all the output column names.
    outputColumnsList = []
    # save it using the format of <fullColName>:<renamedColName>
    # <fullColName> has the format of <dbName>.<tableName>.<colName>
    outputColumnsDict = {}

    # This variable is for checking if there is a repeated database.tableName
    dbTableList = []
    for seq in range(0, tableNum):
        if ("database" not in tables[seq].keys()) or ("tableName" not in tables[seq].keys()):
            errMsg = "All table should include both database and tableName. Please check table: {0}".format(tables[seq])
            logger.error(errMsg)
            return False
        dbName = tables[seq]["database"]
        tableName = tables[seq]["tableName"]
        dbTable = "{0}.{1}".format(dbName, tableName)
        if dbTable in dbTableList:
            errMsg = "At present, the case that two tables are the same as both database name and table name \
                       hasn't been supported. Please check dbTable: {0}".format(dbTable)
            logger.error(errMsg)
            return False
        else:
            dbTableList.append(dbTable)
        columnList = list(tables[seq]['columns'].keys())

        curTableColumnList = []

        # check if the generated new table exists the same column name.
        for colName in columnList:
            fullColName = "{0}.{1}.{2}".format(dbName, tableName, colName)
            if colName in outputColumnsList:
                # if fullColName in outputColumnsList:
                #     logger.error("There are two columns with the same database, table and columns. \
                #         fullColName: {0}".format(fullColName))
                #     return False
                curTableColumnList.append(fullColName)
                outputColumnsDict[fullColName] = fullColName
            else:
                curTableColumnList.append(colName)
                outputColumnsDict[fullColName] = colName

        outputColumnsList.extend(curTableColumnList)

    # check if all columns is available. BTW, it maybe is unnecessary.
    #
    logger.debug("outputColumnsDict: {0}".format(outputColumnsDict))
    results = {'outputColumnsDict': outputColumnsDict}

    if 'outputs' in jsonData.keys() and 'outputTableName' in jsonData['outputs'].keys():
        checkName = jsonData['outputs']['outputTableName']
        rootFolder = '/users'
        tableAvailable = handleFileFromHdfs(checkName, rootFolder)
        if tableAvailable:
            results['tableAvailable'] = 'true'
        else:
            results['tableAvailable'] = 'false'
    return results


def getDbSource(sourcesMappingFile=os.path.dirname(os.path.realpath(__file__)) + "/tmp/sources.json"):
    '''
    return a dict which include the db source mapping information like below
    {
        <sourceName>:
        {
            "dbtype": <dbTypeName>,
            "dbserver": <dbServerName>,
            "dbport": <dbPort>,
            "user": <userName>,
            "password": <password>
        },
        ...
    }
    '''
    username = "yzy"
    dbSourceDict = {}
    curDbDict = Singleton().dataPaltForm

    if username in curDbDict.keys():
        palts = curDbDict[username]
        logger.debug("palts: {}".format(palts))
        if palts:
            for key, value in palts.items():
                dbSourceDict[key] = {
                    "dbtype": value.dbPaltName,
                    "dbserver": value.dbLocation,
                    "dbport": value.dbPort,
                    "user": value.dbUserName,
                    "password": value.dbUserPwd,
                    'sid': value.dbSid
                }

    return dbSourceDict


def getGenNewTableSparkCode(jsonData, hdfsHost="spark-master0", port="9000", folder="myfolder",
                            mode='overwrite', partitionBy=None, maxRowCount=10000):
    '''
    return the running spark code which write the New table into hdfs by default
    '''

    userUrl = "hdfs://{0}:{1}/users".format(hdfsHost, port)
    savedPathUrl = "{0}/{1}/{2}".format(userUrl,
                                        folder, jsonData["outputs"]["outputTableName"])

    # add dbsources information into jsonData whose format like below.
    # "dbsources":
    # {
    #     <sourceName>:
    #     {
    #         "dbtype": <dbTypeName>,
    #         "dbserver": <dbServerName>,
    #         "dbport": <dbPort>,
    #         "user": <userName>,
    #         "password": <password>,
    #         "sid": <sid>
    #     },
    #     ...
    # }
    dbSourceDict = getDbSource()
    jsonData["dbsources"] = dbSourceDict
    jsonStr = json.dumps(jsonData, ensure_ascii=True)
    logger.debug("jsonStr:{0}".format(jsonStr))

    return '''
    import sys
    import traceback
    import json
    ''' + setupLoggingSparkCode() + getDataFrameFromSourceSparkCode() + '''
    def writeDataFrame(jsonStr, savedPathUrl, mode='overwrite', partitionBy=None, maxRowCount=False):
        """
        notes: maxRowCount is used for refine the max rows from every data sources.
        If the limit parameter is given, use that value.
        """
        jsonData = json.loads(jsonStr, encoding='utf-8')
        logger.debug("jsonData: {0}".format(jsonData))
        newDF = generateNewDataFrame(jsonData, maxRowCount)
        if not newDF:
            return False

        # get user information, especially username.

        # shorten the partition num.
        # refer to the spark.sql.shuffle.partitions parameter, the default is 200.
        if partitionBy is not None:
            newDF.write.parquet(savedPathUrl, mode=mode, partitionBy=partitionBy)
        elif newDF.count() == 0:
            return False
        elif newDF.count() < 10000:
            newDF.coalesce(1).write.parquet(savedPathUrl, mode=mode)
        else:
            newDF.write.parquet(savedPathUrl, mode=mode)
        return True

    def generateNewDataFrame(jsonData, maxRowCount=10000, userName="myfolder", rootFolder="/users"):

        # check the json format
        if (("tables" not in jsonData.keys()) or ("outputs" not in jsonData.keys())):
            errMsg = "ERROR, The jsonData don't include 'tables' or 'outputs'."
            logger.error(errMsg)
            print(errMsg)
            return False
        elif (len(jsonData["tables"]) > 1) and ("relationships" not in jsonData.keys()):
            errMsg = "ERROR, The jsonData don't include 'relationships' to join more tables."
            logger.error(errMsg)
            print(errMsg)
            return False

        dfDict = {}

        try:
            tables = jsonData["tables"]
            tableNum = len(tables)
            if tableNum == 1:
                # get the table connection information
                dbName = tables[0]["database"]
                tableName = tables[0]["tableName"]
                rFolder = rootFolder
                if "sourcetype" not in tables[0].keys() or tables[0]["sourcetype"] == "db":
                    tables[0]["dbsource"] = jsonData["dbsources"][tables[0]["source"]]
                elif tables[0]["sourcetype"] == "tmptables":
                    rFolder = u"/tmp{0}/{1}/parquet".format(rootFolder, userName)

                df0 = getDataFrameFromSource(tables[0], rootFolder=rFolder, maxRowCount=maxRowCount)
                if not df0:
                    logger.error(u"The data cannot be gotten from source. dbName: {0}, tableName: {1}"
                                 .format(dbName, tableName))
                    return False
                return df0

            # change the removedColumn list to dict for comparing by table.
            removedColsDict = {}
            if "removedColumns" in jsonData["outputs"].keys():
                for item in jsonData["outputs"]["removedColumns"]:
                    (db, table, col) = item.split(".")
                    dbTable = "{0}.{1}".format(db, table)
                    if dbTable in removedColsDict.keys():
                        removedColsDict[dbTable].append(col)
                    else:
                        removedColsDict[dbTable] = [col]

            # get data from those db sources
            for seq in range(0, tableNum):
                # get the table connection information
                dbName = tables[seq]["database"]
                tableName = tables[seq]["tableName"]
                dbTable = u"{0}.{1}".format(dbName, tableName)
                rFolder = u"/{0}/{1}".format(rootFolder, userName)
                if "sourcetype" not in tables[seq].keys() or tables[seq]["sourcetype"] == "db":
                    tables[seq]["dbsource"] = jsonData["dbsources"][tables[seq]["source"]]
                elif tables[seq]["sourcetype"] == "tmptables":
                    rFolder = u"/tmp{0}/{1}/parquet".format(rootFolder, userName)

                dfDict[dbTable] = getDataFrameFromSource(
                    tables[seq], rootFolder=rFolder, removedColsDict=removedColsDict, maxRowCount=maxRowCount)
                if not dfDict[dbTable]:
                    logger.error(u"The data cannot be gotten from source. dbTable: {0}".format(dbTable))
                    return False

            # check if all columns is available. BTW, it maybe is unnecessary.
            #
            sortedRelList = sortTableRelationship(jsonData)
            if not sortedRelList:
                return False

            outputDf = joinDF(sortedRelList, dfDict)
            if outputDf is None:
                return False

            # rename the new dataframe.
            for key, newCol in jsonData["outputs"]['columnRenameMapping'].items():
                oldCol = key.replace('.', '_')
                outputDf = outputDf.withColumnRenamed(oldCol, newCol)
        except KeyError as e:
            print("Mapping key {0} not found.".format(e.message))
            logger.error("KeyError Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
            return False
        except Exception:
            traceback.print_exc()
            logger.error("Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
            return False
        return outputDf

    def sortTableRelationship(jsonData):
        """
        # sort the jsonData["relationships"] list to follow the below rule
        # 1. saved both tables from the first relationship into joinedTableSet.
        # 2. At least one table from the later relationship exist in the joinedTableSet.
        """

        joinedTableSet = set()
        sortedRelList = []
        traverseList = [i for i in range(len(jsonData["relationships"]))]

        loopNum = 0
        maxLoopNum = 100
        while len(traverseList) > 0 and loopNum < maxLoopNum:
            seq = traverseList.pop(0)
            # check if two column types is different
            fromDbTable = jsonData["relationships"][seq]['fromTable']
            toDbTable = jsonData["relationships"][seq]['toTable']

            if len(joinedTableSet) == 0:
                sortedRelList.append(jsonData["relationships"][seq])

                joinedTableSet.add(fromDbTable)
                joinedTableSet.add(toDbTable)

            elif fromDbTable in joinedTableSet:
                sortedRelList.append(jsonData["relationships"][seq])

                if toDbTable in joinedTableSet:
                    joinedTableSet.add(toDbTable)

            elif toDbTable in joinedTableSet:
                sortedRelList.append(jsonData["relationships"][seq])

                joinedTableSet.add(fromDbTable)

            else:
                # Both fromDbTable and toDbTable don't exist in the joined table set
                # append this seq back.
                traverseList.append(seq)

            loopNum = loopNum + 1

        if loopNum >= maxLoopNum:
            errMsg = "ERROR. There might be some tables which don't connect with others. "
            logger.error(errMsg)
            print(errMsg)
            return False

        return sortedRelList

    def joinDF(sortedRelList, dfDict):
        """
        The sortedRelList sort the table relationship list using the function of sortTableRelationship.
        The dfDict parameter store content like {"<dbName>.<tableName>":tableDataFrame, ...}
        This function will handle all the relationships to return the output dataFrame.
        """

        # For safety and unification, update all old DataFrame's Columns
        # with the format of "<dbName>.<tableName>.<columnName>"
        for dbTable in dfDict.keys():
            for colItem in dfDict[dbTable].columns:
                dfDict[dbTable] = dfDict[dbTable].withColumnRenamed(
                    colItem,
                    u"{0}_{1}".format(dbTable.replace('.', '_'), colItem))

        # TBD, this mapping need to be researched again for the details.
        # joinType must be one of below
        # inner, cross, outer, full, full_outer, left, left_outer, right, right_outer, left_semi, and left_anti.
        joinTypeMapping = {
            "inner join": "inner",
            "join": "inner",
            "full join": "full",
            "full outer join": "full_outer",
            "left join": "left",
            "left outer join": "left_outer",
            "right join": "right",
            "right outer join": "right_outer",
            "left semi join": "left_semi",
            "left anti join": "left_anti"
        }

        outputDf = None
        joinCols = []
        repeatedJoinCols = []
        joinedTableSet = set()
        for relItem in sortedRelList:
            # check if two column types is different
            fromDbTable = relItem['fromTable']
            toDbTable = relItem['toTable']
            columnMapList = relItem['columnMap']

            cond = []
            # print(dfDict[fromDbTable].printSchema())
            # print(dfDict[toDbTable].printSchema())
            for mapit in columnMapList:
                fromCol = u"{0}_{1}".format(fromDbTable.replace('.', '_'), mapit["fromCol"])
                toCol = u"{0}_{1}".format(toDbTable.replace('.', '_'), mapit["toCol"])
                logger.debug(u"fromCol: {0}, toCol: {1}".format(fromCol, toCol))
                cond.append(dfDict[fromDbTable][fromCol] == dfDict[toDbTable][toCol])

                # just want to get all repeated joined columns.
                if fromCol not in joinCols:
                    if toCol not in joinCols:
                        joinCols.append(fromCol)
                        repeatedJoinCols.append(toCol)
                    elif fromCol not in repeatedJoinCols:
                        repeatedJoinCols.append(fromCol)
                else:
                    # fromCol in joinCols
                    if toCol in joinCols:
                        joinCols.remove(toCol)
                    else:
                        pass
                    if toCol not in removeCols:
                        repeatedJoinCols.append(toCol)

            joinType = joinTypeMapping[relItem['joinType']]

            if outputDf is None:
                # The first join connection
                outputDf = dfDict[fromDbTable].join(dfDict[toDbTable], cond, joinType)
                joinedTableSet.add(fromDbTable)
                joinedTableSet.add(toDbTable)
            elif fromDbTable in joinedTableSet:
                outputDf = outputDf.join(dfDict[toDbTable], cond, joinType)
                joinedTableSet.add(toDbTable)
            else:
                outputDf = outputDf.join(dfDict[fromDbTable], cond, joinType)
                joinedTableSet.add(fromDbTable)
        logger.debug(u"joinedTableSet: {0}".format(joinedTableSet))
        logger.debug(u"repeatedJoinCols: {0}, outputDf columns:{1}".format(repeatedJoinCols, outputDf.columns))
        for colIt in repeatedJoinCols:
            outputDf = outputDf.drop(colIt)

        return outputDf
    ''' + '''
    print(writeDataFrame('{0}', '{1}', mode='{2}', partitionBy={3}))
    '''.format(jsonStr, savedPathUrl, mode, partitionBy)


def getTableInfoSparkCode(userName, tableName, mode="all", hdfsHost="spark-master0",
                          port="9000", rootFolder="users", filterJson={}, maxRowCount=1000):
    """
    return the running spark code which will get a specified table schema from hdfs,
    mode can be 'schema', 'data' and 'both'
    """
    userUrl = "hdfs://{0}:{1}/{2}/{3}/{4}".format(
        hdfsHost, port, rootFolder, userName, tableName)
    filterJson = json.dumps(filterJson, ensure_ascii=True)
    logger.debug("filterJson:{0}, type:{1}".format(filterJson, type(filterJson)))

    sparkCode = specialDataTypesEncoderSparkCode() + setupLoggingSparkCode() + filterDataFrameSparkCode() + \
        aggDataFrameSparkCode() + splitColumnSparkCode() + '''
    def getTableInfo( url, mode, filterJson='{}', maxRowCount=1000):
        """
        get the specified table schema,
        note, the table format is parquet.
        """
        dframe1 = spark.read.parquet(url)

        outputDict = {}
        logger.debug("filterJson:{0}, type:{1}".format(filterJson, type(filterJson)))
        filterJson = json.loads(filterJson, encoding='utf-8')
        if len(filterJson) > 0:
            dframe1 = filterDF(dframe1, filterJson)
            dframe1 = aggDF(dframe1, filterJson)
            dframe1 = splitColumn(dframe1, filterJson)
        dframe1 = dframe1.limit(maxRowCount)

        if mode == 'all' or mode == 'schema':
            outputDict['schema'] = []
            for colItem in dframe1.schema.fields:
                logger.debug("field: {0}, type: {1}".format( colItem.name, colItem.dataType))
                outputDict['schema'].append({"field": colItem.name, "type": str(colItem.dataType)})
        if mode == 'all' or mode == 'data':
            outputDict['data'] = []
            for rowItem in dframe1.collect():
                # logger.debug("rowItem.asDict(): {0}".format(rowItem.asDict()))
                outputDict['data'].append(rowItem.asDict())
        logger.debug("outputDict length: {0}".format(len(outputDict)))
        return json.dumps(outputDict, cls = SpecialDataTypesEncoder)
    ''' + '''
    print(getTableInfo('{0}', '{1}', """{2}""", {3}))
    '''.format(userUrl, mode, filterJson, maxRowCount)

    return sparkCode


def listDirectoryFromHdfs(path="/", hdfsHost="spark-master0", port="50070", fileTypeList=["DIRECTORY"]):
    """
    list a specified directory from HDFS using webHDFS.
    fileType include "DIRECTORY", "FILE".
    """

    rootUrl = "http://{0}:{1}/webhdfs/v1".format(hdfsHost, port)
    # headers = {'Content-Type': 'application/json'}
    listUrl = rootUrl + path + "?op=LISTSTATUS"
    logger.debug("listUrl: {0}".format(listUrl))
    resp1 = requests.get(listUrl)

    outputList = []
    if resp1.status_code < 300:
        for item in resp1.json()['FileStatuses']['FileStatus']:
            if item['type'] in fileTypeList:
                outputList.append(item['pathSuffix'])
    else:
        logger.error("response Code:{0}, response Content:{1}".format(
            resp1.status_code, resp1.json()))
        return {"status": False, "results": resp1.json()}

    return {"status": True, "results": outputList}


def convertCsvToParquetSparkCode(uploadedCsvList, csvOpts={}, hdfsHost="spark-master0", port="9000"):
    """
    uploadedCsvList's item must have the format of <rootFolder>/csv/<parentFolder>/<fileName>.
    For example, "/users/myfolder/csv/test/test"
    """

    logger.debug("uploadedCsvList: {0}, hdfsHost: {1}, port:{2}".format(uploadedCsvList, hdfsHost, port))
    uploadedCsvs = str(uploadedCsvList).encode(encoding="utf-8", errors='strict')
    logger.debug("csvOpts:{0}, uploadedCsvs:{1}".format(csvOpts, uploadedCsvs))

    sparkCode = setupLoggingSparkCode() + '''
    import traceback
    import json
    import sys
    import re
    import pyspark.sql.utils as utils

    def convertCsvToParquet(csvUrl, parquetUrl, csvOpts={}):
        """
        """
        try:
            logger.debug(u"csvUrl: {0}, parquetUrl: {1}".format(csvUrl, parquetUrl))
            # Given all csv has been converted into the standard format.
            dateFormat = csvOpts["dateformat"] if "dateformat" in csvOpts else "yyyy-MM-dd"
            timeFormat = csvOpts["timestampformat"] if "timestampformat" in csvOpts else "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
            csvDf = spark.read.csv(csvUrl, header=True, inferSchema=True,
                                   dateFormat=dateFormat, timestampFormat=timeFormat)

            for i in range(len(csvDf.columns)):
                if re.match("[a-zA-Z0-9_-]+", csvDf.columns[i]) is None:
                    csvDf = csvDf.withColumnRenamed(csvDf.columns[i], "re_col_{0}".format(i))
            csvDf.write.parquet(parquetUrl, "overwrite")

            return csvUrl.split("/csv/")[-1]
        except utils.AnalysisException as e:
            print("AnalysisException: {0}".format(e.desc))
            logger.error("Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
            return False
        except Exception:
            traceback.print_exc()
            logger.error("Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
            return False


    def batchConvertCsvList(uploadedCsvList, csvOpts={}, hdfsHost="spark-master0", port="9000"):
        """
        """
        logger.debug("csvOpts:{0}, uploadedCsvList:{1}".format(csvOpts, uploadedCsvList))
        csvUrlList = []
        for uploadedCsvUri in uploadedCsvList:
            decodeUri = uploadedCsvUri.decode(encoding="utf-8", errors="strict")
            csvUrl = u"hdfs://{0}:{1}{2}".format(hdfsHost, port, decodeUri)
            rootFolder, filePath = decodeUri.split("/csv/")
            logger.debug(u"csvUrl: {0}, filePath: {1}".format(csvUrl, filePath))
            parquetUrl = u"hdfs://{0}:{1}{2}/parquet/{3}".format(hdfsHost, port, rootFolder, filePath)
            logger.debug(u"csvUrl: {0}, parquetUrl: {1}".format(csvUrl, parquetUrl))
            res = convertCsvToParquet(csvUrl, parquetUrl, csvOpts)
            if res:
                csvUrlList.append(res)
            else:
                logger.error("There is an error while converting {0} csv".format(csvUrl))
                return False
        return csvUrlList
    ''' + '''
    print(batchConvertCsvList({0}, {1}, '{2}', '{3}'))
    '''.format(uploadedCsvList, csvOpts, hdfsHost, port)
    return sparkCode


def getSpecUploadedTableSparkCode(fileTable, userName="myfolder", mode="all",
                                  hdfsHost="spark-master0", port="9000",
                                  rootFolder="/tmp/users", filterJson={}, maxRowCount=1000):
    """
    return the running spark code which will get a specified uploaded table info from hdfs,
    mode can be "schema", "data" and "both"
    """
    rootUrl = "hdfs://{0}:{1}{2}/{3}".format(hdfsHost, port, rootFolder, userName)
    fileTable = fileTable.encode(encoding="utf-8", errors='strict')
    filterJson = json.dumps(filterJson, ensure_ascii=True)
    logger.debug("rootUrl: {0}, filterJson: {1}, type: {2}".format(rootUrl, filterJson, type(filterJson)))

    sparkCode = specialDataTypesEncoderSparkCode() + setupLoggingSparkCode() + filterDataFrameSparkCode() + \
        splitColumnSparkCode() + aggDataFrameSparkCode() + '''
    import json


    def getSpecUploadedTable( rootUrl, fileTable, mode, filterJson='{}', maxRowCount=1000):
        """
        get the specified table schema,
        fileTable might be the format of <parentFolder>/<fileTable>
        """
        fileTable = fileTable.decode(encoding="utf-8", errors="strict")
        logger.debug(u"fileTable: {0}".format(fileTable))
        csvUrl = u"{0}/csv/{1}".format(rootUrl, fileTable)
        logger.debug(u"csvUrl:{0}".format(csvUrl))
        dframe1 = spark.read.csv(csvUrl, header=True, inferSchema=True).limit(maxRowCount)

        logger.debug("filterJson:{0}, type:{1}".format(filterJson, type(filterJson)))
        filterJson = json.loads(filterJson, encoding="utf-8")
        if len(filterJson) > 0:
            dframe1 = filterDF(dframe1, filterJson)
            dframe1 = aggDF(dframe1, filterJson)
            dframe1 = splitColumn(dframe1, filterJson)

        outputDict = {}
        if mode == "all" or mode == "schema":
            parquetUrl = u"{0}/parquet/{1}".format(rootUrl, fileTable)
            parquetDF = spark.read.parquet(parquetUrl)
            if "mapcustomized" in filterJson.keys():
                parquetDF = splitColumn(parquetDF, {"customized": filterJson["mapcustomized"]})
            parquetFileds = parquetDF.schema.fields

            csvFields = dframe1.schema.fields
            logger.debug(u"parquetFileds:{0}, csvFields:{1}".format(parquetFileds, csvFields))
            if len(csvFields) != len(parquetFileds):
                logger.error(u"csvUrl:{0}, parquetUrl:{1}. csv don't match parquet.".format(csvUrl, parquetUrl))
                return False
            outputDict["schema"] = []
            for i in range(len(csvFields)):
                # logger.debug(u"i:{0}, item: {1}".format(i, csvFields[i]))
                # logger.debug(u"field: {0}, mappedfield: {1}, type: {2}".format(
                #     csvFields[i].name, parquetFileds[i].name, csvFields[i].dataType))
                outputDict["schema"].append({"field": csvFields[i].name,
                    "mappedfield": parquetFileds[i].name, "type": str(csvFields[i].dataType)})

        if mode == "all" or mode == "data":
            outputDict["data"] = []
            for rowItem in dframe1.collect():
                outputDict["data"].append(rowItem.asDict())
        logger.debug(u"Getting {0} url successfully".format(csvUrl))
        return json.dumps(outputDict, cls = SpecialDataTypesEncoder)
    ''' + '''
    print(getSpecUploadedTable(u'{0}', {1}, '{2}', '{3}', {4}))
    '''.format(rootUrl, fileTable, mode, filterJson, maxRowCount)

    return sparkCode
