import json
import logging
# import pprint
import requests
import textwrap
import time
import os

from dataCollection.gxmHandleClass.Singleton import Singleton

# Get an instance of a logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def executeSpark(sparkCode, pyFiles=[], sparkHost='http://spark-master0:8998'):
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
    if (curSessionsReqJson['total'] > 0) and \
        (curSessionsReqJson['sessions'][-1]['kind'] == 'pyspark') and \
            (curSessionsReqJson['sessions'][-1]['state'] == 'idle'):
        sessionUrl = "{0}/{1}".format(rootSessionsUrl,
                                      curSessionsReqJson['sessions'][-1]['id'])
    else:
        newSessionReqJson = requests.post(
            rootSessionsUrl, data=json.dumps(sessionData), headers=headers).json()
        # pprint.pprint(newSessionReqJson)
        logger.debug("newSessionReqJson:{0}".format(newSessionReqJson))
        sessionUrl = "{0}/{1}".format(rootSessionsUrl, newSessionReqJson['id'])

        reqJsonTmp = getReqFromDesiredReqState(sessionUrl)
        if not reqJsonTmp:
            #            requests.delete(sessionUrl, headers=headers)
            return False

    # execute spark codes
    runData = {
        'code': textwrap.dedent(sparkCode)
    }
    statementsUrl = sessionUrl + '/statements'
    sparkCodesReq = requests.post(
        statementsUrl, data=json.dumps(runData), headers=headers)
    logger.debug("sparkCodesReq:{0}, headers:{1}".format(
        sparkCodesReq.json(), sparkCodesReq.headers))

    resultReqJson = getReqFromDesiredReqState(host + sparkCodesReq.headers['location'],
                                              desiredState='available', eachSleepDuration=5)

    if not resultReqJson:
        # requests.delete(sessionUrl, headers=headers)
        return False

    # pprint.pprint(resultReqJson)
    logger.debug("resultReqJson:{0}".format(resultReqJson))

    results = resultReqJson['output']

#    # close the session url.
#    requests.delete(sessionUrl, headers=headers)

    return results


def getReqFromDesiredReqState(reqUrl, headers={'Content-Type': 'application/json'},
                              desiredState='idle', maxReqCount=60, eachSleepDuration=2):
    '''
    '''
    reqCount = 0
    reqJson = requests.get(reqUrl, headers=headers).json()
    logger.debug("Step:{0}, response:{1}".format(reqCount, reqJson))
    while reqCount < maxReqCount and reqJson['state'] != desiredState:
        if reqJson['state'] == 'error':
            logger.error(
                "There is an error in Step-{0}, see the details for the response:{1}".format(reqCount, reqJson))
            return False
        if reqJson['state'] in ['cancelled', 'cancelling']:
            logger.error(
                "The job has been cancelled in Step-{0}, see the details for the response:{1}"
                .format(reqCount, reqJson))
            return False
        # sleep half a second
        time.sleep(eachSleepDuration)
        reqCount = reqCount + 1
        reqJson = requests.get(reqUrl, headers=headers).json()

        logger.debug("Step:{0}, response:{1}".format(reqCount, reqJson))

    if reqCount >= 60:
        return False

    return reqJson


def getOutputColumns(jsonData):
    '''
    check the valid columns
    '''

    # check the json format
    if ("tables" not in jsonData.keys()) or ("relationships" not in jsonData.keys()):
        errMsg = "ERROR, The jsonData don't include 'tables' or 'relationships'."
        logger.error(errMsg)
        print(errMsg)
        return False

    tables = jsonData["tables"]
    tableNum = len(tables)

    # save all the output column names.
    outputColumnsList = []
    # save it using the format of <fullColName>:<renamedColName>
    # <fullColName> has the format of <dbName>.<tableName>.<colName>
    outputColumnsDict = {}

    for seq in range(0, tableNum):
        dbName = tables[seq]["database"]
        tableName = tables[seq]["tableName"]
        columnList = list(tables[seq]['columns'].keys())

        curTableColumnList = []

        # check if the generated new table exists the same column name.
        for colName in columnList:
            fullColName = "{0}.{1}.{2}".format(dbName, tableName, colName)
            if colName in outputColumnsList:
                curTableColumnList.append(fullColName)
                outputColumnsDict[fullColName] = fullColName
            else:
                curTableColumnList.append(colName)
                outputColumnsDict[fullColName] = colName

        outputColumnsList.extend(curTableColumnList)

    # check if all columns is available. BTW, it maybe is unnecessary.
    #

    return outputColumnsDict


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

    palts = Singleton().dataPaltForm['db']
    dbSourceDict = {}
    if palts:
        for key, value in palts.items():

            dbSourceDict[key] = {
                "dbtype": "mysql",
                "dbserver": value.dbLocation,
                "source": value.dbPaltName,
                "dbport": value.dbPort,
                "user": value.dbUserName,
                "password": value.dbUserPwd
            }
        return dbSourceDict

    try:
        with open(sourcesMappingFile) as f:
            dbSourceDict = json.load(f)
            logger.debug("dbSourceDict: {}".format(dbSourceDict))
            return dbSourceDict
    except:
        logger.error("Cannot get the db sources mapping!")
        return False


def getGenNewTableSparkCode(jsonData, hdfsHost="spark-master0", port="9000", folder="myfolder"):
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
    #         "password": <password>
    #     },
    #     ...
    # }
    dbSourceDict = getDbSource()
    if not dbSourceDict:
        return False
    jsonData["dbsources"] = dbSourceDict

    return """
    import sys
    import logging
    import traceback
    # Get an instance of a logger
    logger = logging.getLogger("sparkCodeExecutedBylivy")
    def writeDataFrame( jsonData, savedPathUrl ):
        '''
        '''
        newDF = generateNewDataFrame(jsonData);
        if not newDF:
            return False;

        #get user information, especially username.

        newDF.write.parquet(savedPathUrl, mode='overwrite')
        return True

    def generateNewDataFrame(jsonData):

        # check the json format
        if (("tables" not in jsonData.keys()) or
            ("relationships" not in jsonData.keys()) or
                ("outputs" not in jsonData.keys())):
            errMsg = "ERROR, The jsonData don't include 'tables', 'relationships' or 'outputs'."
            logger.error(errMsg)
            print(errMsg)
            return False

        dfDict = {{}}

        try:
            tables = jsonData["tables"]
            tableNum = len(tables)

            # change the removedColumn list to dict for comparing by table.
            removedColsDict = {{}}
            if "removedColumns" in jsonData["outputs"].keys():
                for item in jsonData["outputs"]["removedColumns"]:
                    (db, table, col) = item.split(".")
                    dbTable = "{{0}}.{{1}}".format(db, table)
                    if dbTable in removedColsDict.keys():
                        removedColsDict[dbTable].append(col)
                    else:
                        removedColsDict[dbTable] = [col]

            # get data from those db sources
            for seq in range(0, tableNum):
                # get the table connection information
                dbSourceDict = jsonData["dbsources"][tables[seq]["source"]]
                dbType = dbSourceDict["dbtype"]
                dbServer = dbSourceDict["dbserver"]
                dbPort = dbSourceDict["dbport"]
                user = dbSourceDict["user"]
                password = dbSourceDict["password"]

                dbName = tables[seq]["database"]
                tableName = tables[seq]["tableName"]

                connUrl = "jdbc:{{0}}://{{1}}:{{2}}".format(dbType, dbServer, dbPort)
                dbTable = "{{0}}.{{1}}".format(dbName, tableName)

                # check the "removedColumns" item, remove them from table columns
                if dbTable in removedColsDict.keys():
                    for colItem in removedColsDict:
                        if colItem in tables[seq]['columns'].keys():
                            tables[seq]['columns'].pop(colItem)

                columnList = list(tables[seq]['columns'].keys())

                if dbType == "oracle":
                    sid = ""
                    connUrl = "jdbc:{{0}}:thin:@{{1}}:{{2}}:{{3}}".format(dbType, dbServer, dbPort, sid)
                elif dbType == "postgresql":
                    connUrl = "jdbc:{{0}}://{{1}}".format(dbType, dbServer)

                try:
                    dfDict[dbTable] = spark.read \
                        .format("jdbc") \
                        .option("url", connUrl) \
                        .option("dbtable", dbTable) \
                        .option("user", user) \
                        .option("password", password) \
                        .load().select(columnList)
                    dfDict[dbTable] = filterDF(dfDict[dbTable], tables[seq])
                except:
                    traceback.print_exc()
                    print(sys.exc_info())
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
        except KeyError:
            print(sys.exc_info())
            return False
        except:
            print(sys.exc_info())
            traceback.print_exc()
            return False;
        return outputDf

    def filterDF(inDataFrame, tableDict):
        '''
        '''
        if "conditions" in tableDict.keys():
            # add the specified conditions in the DataFrame
            for condIt in tableDict["conditions"]:
                condType = condIt["type"]
                colName = condIt["columnName"]
                if condType == "limit" and type(condIt["value"]) == int:
                    inDataFrame = inDataFrame.limit(condIt["value"])
                elif condType in [">","=","<"]:
                    condStr = "{{0}} {{1}} {{2}}".format(colName, condType, condIt["value"])
                    inDataFrame = inDataFrame.filter(condStr)
                elif condType == "like":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].like(condIt["value"]))
                elif condType == "startswith":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].startswith(condIt["value"]))
                elif condType == "isin":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isin(condIt["value"]))
                elif condType == "isnull":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isNull())
                elif condType == "isnotnull":
                    inDataFrame = inDataFrame.filter(inDataFrame[colName].isNotNull())
                else:
                    pass
        return inDataFrame

    def sortTableRelationship(jsonData):
        '''
        # sort the jsonData["relationships"] list to follow the below rule
        # 1. saved both tables from the first relationship into joinedTableSet.
        # 2. At least one table from the latter relationship exist in the joinedTableSet.
        '''

        joinedTableSet = set()
        sortedRelList = []
        traverseList = [ i for i in range(len(jsonData["relationships"])) ]

        loopNum = 0;
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
        '''
        The sortedRelList sort the table relationship list using the function of sortTableRelationship.
        The dfDict parameter store content like {{"<dbName>.<tableName>":tableDataFrame, ...}}
        This function will handle all the relationships to return the output dataFrame.
        '''

        # For safety and unification, update all old DataFrame's Columns
        # with the format of "<dbName>.<tableName>.<columnName>"
        for dbTable in dfDict.keys():
            for colItem in dfDict[dbTable].columns:
                dfDict[dbTable] = dfDict[dbTable].withColumnRenamed(colItem,
                    "{{0}}_{{1}}".format(dbTable.replace('.','_'),colItem))

        # TBD, this mapping need to be researched again for the details.
        # joinType must be one of below
        # inner, cross, outer, full, full_outer, left, left_outer, right, right_outer, left_semi, and left_anti.
        joinTypeMapping = {{
            "inner join":"inner",
            "join":"inner",
            "full join": "full",
            "full outer join": "full_outer",
            "left join": "left",
            "left outer join": "left_outer",
            "right join": "right",
            "right outer join": "right_outer",
            "left semi join": "left_semi",
            "left anti join": "left_anti"
        }}

        outputDf = None
        for relItem in sortedRelList:
            # check if two column types is different
            fromDbTable = relItem['fromTable']
            toDbTable = relItem['toTable']
            columnMapList = relItem['columnMap']

            cond = [];
            #print(dfDict[fromDbTable].printSchema())
            #print(dfDict[toDbTable].printSchema())
            for mapit in columnMapList:
                fromCol = "{{0}}_{{1}}".format(fromDbTable.replace('.','_'),mapit["fromCol"])
                toCol = "{{0}}_{{1}}".format(toDbTable.replace('.','_'), mapit["toCol"])
                #print(fromCol, toCol)
                cond.append(dfDict[fromDbTable][fromCol] == dfDict[toDbTable][toCol])

            joinType = joinTypeMapping[relItem['joinType']]

            if outputDf is None:
                #The first join connection
                outputDf = dfDict[fromDbTable].join(dfDict[toDbTable], cond, joinType)

            elif fromDbTable in joinedTableSet:
                outputDf = outputDf.join(dfDict[toDbTable], cond, joinType)

            else:
                outputDf = outputDf.join(dfDict[fromDbTable], cond, joinType)

        return outputDf

    print(writeDataFrame({0}, "{1}"))
    """.format(jsonData, savedPathUrl)


def getTableInfoSparkCode(userName, tableName, mode="all", hdfsHost="spark-master0", port="9000", rootFolder="users"):
    '''
    return the running spark code which will get a specified table schema from hdfs,
    mode can be 'schema', 'data' and 'both'
    '''
    userUrl = "hdfs://{0}:{1}/{2}/{3}/{4}".format(
        hdfsHost, port, rootFolder, userName, tableName)

    sparkCode = """
    import sys
    import logging
    import json
    import decimal

    # Get an instance of a logger
    logger = logging.getLogger("sparkCodeExecutedBylivy")

    class DecimalEncoder(json.JSONEncoder):
        def default(self, o):
            if isinstance(o, decimal.Decimal):
                return float(o)
            return super(DecimalEncoder, self).default(o)

    def getTableSchema( url, mode ):
        '''
        get the specified table schema,
        note, the table format is parquet.
        '''
        t1 = spark.read.parquet(url)

        outputDict = {{}}
        if mode == 'all' or mode == 'schema':
            outputDict['schema'] = []
            for colItem in t1.schema.fields:
                outputDict['schema'].append( '{{0}}:{{1}}'.format(colItem.name, colItem.dataType) )
        if mode == 'all' or mode == 'data':
            outputDict['data'] = []
            for rowItem in t1.collect():
                outputDict['data'].append( rowItem.asDict() )

        return json.dumps(outputDict, cls = DecimalEncoder)
    print(getTableSchema("{0}", "{1}"))
    """.format(userUrl, mode)

    return sparkCode


def listDirectoryFromHdfs(path="/", hdfsHost="spark-master0", port="50070", fileType='DIRECTORY'):
    '''
    list a specified directory from HDFS using webHDFS.
    '''

    rootUrl = "http://{0}:{1}/webhdfs/v1".format(hdfsHost, port)
    # headers = {'Content-Type': 'application/json'}
    listUrl = rootUrl + path + "?op=LISTSTATUS"
    resp1 = requests.get(listUrl)

    outputList = []
    if resp1.status_code < 300:
        for item in resp1.json()['FileStatuses']['FileStatus']:
            if fileType == item['type']:
                outputList.append(item['pathSuffix'])
    else:
        logger.error("response Code:{0}, response Content:{1}".format(
            resp1.status_code, resp1.json()))
        return False

    return outputList
