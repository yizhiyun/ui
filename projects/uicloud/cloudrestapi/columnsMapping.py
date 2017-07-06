import json
import logging
import pprint
import requests
import textwrap
import time


# Get an instance of a logger
logger = logging.getLogger(__name__)

def executeSpark(sparkCode, pyFiles = [], sparkHost = 'http://spark-master0:8998'):
    '''
    '''
    host = sparkHost
    sessionData = {
        'kind': 'pyspark',
        'pyFiles': pyFiles
        }
    headers = {'Content-Type': 'application/json'}
    
    # create a session to be used
    rootSessionsUrl = host + '/sessions'
    sessionReq = requests.post(rootSessionsUrl, data=json.dumps(sessionData), headers=headers)
    pprint.pprint(sessionReq.json())
    sessionUrl = host + sessionReq.headers['location']

    reqJsonTmp = getReqFromDesiredReqState( sessionUrl )
    if not reqJsonTmp:
        requests.delete(sessionUrl, headers=headers)
        return False

    # execute spark codes
    runData = {
      'code': textwrap.dedent(sparkCode)
    }
    sessionUrl = host + sessionReq.headers['location']
    statementsUrl = sessionUrl + '/statements'
    sparkCodesReq = requests.post(statementsUrl, data=json.dumps(runData), headers=headers)
    pprint.pprint(sparkCodesReq.json())
    pprint.pprint(sparkCodesReq.headers)

    resultReqJson = getReqFromDesiredReqState(host + sparkCodesReq.headers['location'], eachSleepDuration=10)
    if not resultReqJson:
        requests.delete(sessionUrl, headers=headers)
        return False

    pprint.pprint(resultReqJson)

    results = resultReqJson['output']

    # close the session url.
    requests.delete(sessionUrl, headers=headers)

    return results


def getReqFromDesiredReqState(reqUrl, headers = {'Content-Type': 'application/json'}, \
        desiredState = 'idle', maxReqCount = 30, eachSleepDuration = 5):
    '''
    '''
    reqCount = 0
    reqJson = requests.get(reqUrl, headers=headers).json()
    while reqCount < maxReqCount and reqJson['state'] != desiredState:
        # sleep half a second
        time.sleep(eachSleepDuration)
        reqCount = reqCount + 1
        reqJson = requests.get(reqUrl, headers=headers).json()

    if reqCount >= 60:
        return False;

    return reqJson
    

def getOutputColumns(jsonData):
    '''
    check the valid columns 
    '''

    # check the json format
    if ("tables" not in jsonData.keys()) or ( "relationships" not in jsonData.keys()):
        errMsg = "ERROR, The jsonData don't include 'tables' or 'relationships'."
        logger.error(errMsg)
        print(errMsg)
        return False;
    
    tables = jsonData["tables"]
    tableNum = len(tables)

    # save all the output column names.
    outputColumnsList = []
    # save it using the format of <fullColName>:<renamedColName>
    # <fullColName> has the format of <dbName>.<tableName>.<colName>
    outputColumnsDict = {}

    for seq in range(0,tableNum):
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


def getDbSource():
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
    dbSourceDict = {
        "mysqlDB1": {
            "dbtype":"mysql",
            "dbserver": "mysql1",
            "dbport": "3306",
            "user": "root",
            "password": "password"
        }
    }

    return dbSourceDict
    

def getSparkCode(jsonData, url="hdfs://spark-master0:9000/users", folders="myfolder" ):
    '''
    return the running spark code which write the New table into hdfs by default
    '''
    savedPathUrl = "{0}/{1}/{2}".format(url, folders, jsonData["outputs"]["outputTableName"])

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
    jsonData["dbsources"] = getDbSource();

    return """
    import sys
    import logging
    # Get an instance of a logger
    logger = logging.getLogger("sparkCodeExecutedBylivy")
    def writeDataFrame( jsonData, savedPathUrl ):
        '''
        '''
        newDF = generateNewDataFrame(jsonData);
        if not newDF:
            return False;
    
        #get user information, especially username.
        
        newDF.write.parquet(savedPathUrl)
        return True
    
    def generateNewDataFrame(jsonData):
    
        # check the json format
        if ( "tables" not in jsonData.keys() ) or \
           ( "relationships" not in jsonData.keys() ) or \
           ( "outputs"  not in jsonData.keys() ):
            errMsg = "ERROR, The jsonData don't include 'tables', 'relationships' or 'outputs'."
            logger.error(errMsg)
            print(errMsg)
            return False;
        
        dfDict = {{}}

        try:
            tables = jsonData["tables"]
            tableNum = len(tables)
            
        
            
            for seq in range(0,tableNum):
                # get the table connection information
                dbSourceDict = jsonData["dbsources"][tables[seq]["source"]]
                dbType = dbSourceDict["dbtype"]
                dbServer = dbSourceDict["dbserver"]
                dbPort = dbSourceDict["dbport"]
                user = dbSourceDict["user"]
                password = dbSourceDict["password"]
            
                dbName = tables[seq]["database"]
                tableName = tables[seq]["tableName"]
                columnList = list(tables[seq]['columns'].keys())
        
                connUrl = "jdbc:{{0}}://{{1}}:{{2}}".format(dbType, dbServer, dbPort)
                dbTable = "{{0}}.{{1}}".format(dbName, tableName)
        
                if dbType=="oracle":
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
                        .load().select( columnList )
                except:
                    print(sys.exc_info())
                    return False;
            
            # check if all columns is available. BTW, it maybe is unnecessary.
            # 
            sortedRelList = sortTableRelationship(jsonData)
            if not sortedRelList:
                return False;
        
            outputDf = joinDF(sortedRelList, dfDict)
            if outputDf is None:
                return False
        
            # remove some columns
            for col in jsonData["outputs"]['removedColumns']:
                outputDf = outputDf.drop(col.replace('.', '_'))
            
            # rename the new dataframe.
            for key, newCol in jsonData["outputs"]['columnRenameMapping'].items():
                oldCol = key.replace('.', '_')
                outputDf = outputDf.withColumnRenamed(oldCol, newCol)
        except:
            print(sys.exc_info())
            return False;
        return outputDf
    
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
    
        # For safety and unification, update all old DataFrame's Columns with the format of "<dbName>.<tableName>.<columnName>"
        for dbTable in dfDict.keys():
            for colItem in dfDict[dbTable].columns:
                dfDict[dbTable] = dfDict[dbTable].withColumnRenamed(colItem, "{{0}}_{{1}}".format(dbTable.replace('.','_'),colItem))
        
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
                fromCol, toCol = "{{0}}_{{1}}".format(fromDbTable.replace('.','_'),mapit["fromCol"]), "{{0}}_{{1}}".format(toDbTable.replace('.','_'), mapit["toCol"])
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

