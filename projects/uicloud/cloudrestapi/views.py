from rest_framework.decorators import api_view
# from rest_framework.response import Response
from .data_handler import *
from .mllib_handler import *
from .upload import *
from django.http import JsonResponse

import json
import logging

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.views")
logger.setLevel(logging.DEBUG)


@api_view(['POST'])
def checkTableMapping(request):
    '''
    POST:
    Here is request data schema.
    {
        "tables": [
            {
                "source": <sourceName or connectString>,
                "database": <databaseName>,
                "tableName": <tableName>,
                "columns": {
                    <columnName1>: {
                        "columnType": <columnType>,
                        "nullable": "yes/no",
                        "primaryKey": "yes/no",
                        "uniqueKey": "yes/no",
                        "foreignKey": "no"
                    },
                    <columnName2>: {
                        ...
                    },
                    ...
                },
                <otherProperty>:<otherValue>,
                ...
            },
            ...
        ],

        "relationships": [
            {
                "fromTable": "<databaseName>.<tableName>",
                "toTable": "<databaseName>.<tableName>",
                "joinType": <connectionType>,
                "columnMap": [
                    {
                        "fromCol": <columnName>,
                        "toCol": <columnName>
                    },
                    ...
                ]
            }
            ...
        ],

        "conditions": [
            {
                "type":"equal", # type include 'equal','greate than', 'less than', 'like' and so on.
                "columnName": "<databaseName>.<tableName>.<columnName>",
                "value": <value>
            },
            {
                "type":"limit",
                "value": <value>
            },
            ...
        ]
    }
    '''
    logger.info("type(request.data): {0}, \n request.data: {1}".format(
        type(request.data), request.data))

    jsonData = request.data

    if request.method == 'POST':

        outputColumnsDict = getOutputColumns(jsonData)

        if not outputColumnsDict:
            failObj = {"status": "failed",
                       "reason": "the request data didn't meet the required format. Please check it again."}
            return JsonResponse(failObj, status=400)

        # response all valid columns
        successObj = {"status": "success",
                      "columns": outputColumnsDict}
        return JsonResponse(successObj)


@api_view(['POST'])
def generateNewTable(request):
    '''
    POST:
    Here is request data schema.
    {
        "tables": [
            {
                "source": <sourceName or connectString>,
                "database": <databaseName>,
                "tableName": <tableName>,
                "columns": {
                    <columnName1>: {
                        "columnType": <columnType>,
                        "nullable": "yes/no",
                        "primaryKey": "yes/no",
                        "uniqueKey": "yes/no",
                        "foreignKey": "no"
                    },
                    <columnName2>: {
                        ...
                    },
                    ...
                },
                <otherProperty>:<otherValue>,
                ...
            },
            ...
        ],

        "relationships": [
            {
                "fromTable": "<databaseName>.<tableName>",
                "toTable": "<databaseName>.<tableName>",
                "joinType": <connectionType>,
                "columnMap": [
                    {
                        "fromCol": <columnName>,
                        "toCol": <columnName>
                    },
                    ...
                ]
            }
            ...
        ],

        "conditions": [
            {
                "type":"equal", # type include 'equal','greate than', 'less than', 'like' and so on.
                "columnName": "<databaseName>.<tableName>.<columnName>",
                "value": <value>
            },
            {
                "type":"limit",
                "value": <value>
            },
            ...
        ],

        "outputs":{
            "outputTableName": <tableName>,
            "columnsMapping": {
                "<databaseName>.<tableName>.<columnName>": <renamedColumnName>,
                ...
            },
            "removedColumns": ["<databaseName>.<tableName>.<columnName>","<tableName>.<columnName>",...],
            ...
        }
    }
    '''

    jsonData = request.data

    logger.debug("type(request.data): {0}, \n request.data: {1}".format(
        type(jsonData), jsonData))
    if request.method == 'POST':

        # response all valid columns
        sparkCode = getGenNewTableSparkCode(jsonData)

        if not sparkCode:
            failObj = {"status": "failed",
                       "reason": "Cannot get the db sources mapping."}
            return JsonResponse(failObj, status=400)
        maxCheck = 300 if "maxchecknum" not in jsonData.keys() else jsonData["maxchecknum"]
        duration = 1 if "checkduration" not in jsonData.keys() else jsonData["checkduration"]
        output = executeSpark(sparkCode, maxCheckCount=maxCheck, reqCheckDuration=duration)
        logger.debug("output: {0}".format(output))
        if not output:
            failObj = {"status": "failed",
                       "reason": "Please see the detailed logs."}
            return JsonResponse(failObj, status=400)
        elif output["status"] != "ok" or output["data"]['text/plain'] != "True":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            sucessObj = {"status": "success"}
            return JsonResponse(sucessObj)


@api_view(['GET'])
def getAllTablesFromUser(request):
    '''
    GET:
    Get all table from the current user.
    '''
    if request.method == 'GET':
        userPath = "/users/{}".format("myfolder")
        outputList = listDirectoryFromHdfs(path=userPath)
        if not outputList:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        successObj = {"status": "success", "results": outputList}
        return JsonResponse(successObj)


@api_view(['POST'])
def getTableViaSpark(request, tableName, modeName):
    '''
    GET:
    Get all table from the current user.
    '''

    jsonData = request.data
    logger.info("request.data: {0}, tableName: {1}".format(jsonData, tableName))
    if request.method == 'POST':

        modeList = ['all', 'data', 'schema']
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)
        # response all valid columns
        curUserName = "myfolder"
        sparkCode = getTableInfoSparkCode(
            curUserName, tableName, mode=modeName, filterJson=jsonData)
        maxCheck = 600 if "maxchecknum" not in jsonData.keys() else jsonData["maxchecknum"]
        duration = 0.1 if "checkduration" not in jsonData.keys() else jsonData["checkduration"]
        output = executeSpark(sparkCode, maxCheckCount=maxCheck, reqCheckDuration=duration)
        if not output:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        elif output["status"] != "ok":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            logger.debug("output: {}".format(output))
            data = output["data"]["text/plain"]

            results = json.loads(data)
            sucessObj = {"status": "success", "results": results}
            return JsonResponse(sucessObj)


@api_view(['POST'])
def getAllTablesFromCustom(request):
    '''
    GET:
    Get all table from the custom user.
    '''

    if request.method == 'POST':
        jsonData = request.data
        outputList = listDirectoryFromHdfs(
            path=jsonData['rootfolder'], hdfsHost=jsonData['host'], port=jsonData['port'])
        if not outputList:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        successObj = {"status": "success", "results": outputList}
        return JsonResponse(successObj)


@api_view(['POST'])
def getTableViaSparkCustom(request, tableName, modeName):
    '''
    GET:
    Get all table from the custom user.
    '''

    jsonData = request.data
    logger.info("request.data: {0}, tableName: {1}".format(
        jsonData, tableName))
    if request.method == 'POST':

        modeList = ['all', 'data', 'schema']
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)
        # response all valid columns
        sparkCode = getTableInfoSparkCode(
            jsonData['subfolder'],
            tableName,
            mode=modeName,
            hdfsHost=jsonData['host'],
            port=jsonData['port'],
            rootFolder=jsonData['rootfolder']
        )
        maxCheck = 600 if "maxchecknum" not in jsonData.keys() else jsonData["maxchecknum"]
        duration = 0.1 if "checkduration" not in jsonData.keys() else jsonData["checkduration"]
        output = executeSpark(sparkCode, maxCheckCount=maxCheck, reqCheckDuration=duration)
        if not output:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        elif output["status"] != "ok":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            logger.debug("output: {}".format(output))
            data = output["data"]["text/plain"]

            results = json.loads(data)
            sucessObj = {"status": "success", "results": results}
            return JsonResponse(sucessObj)


@api_view(['POST'])
def getBasicStats(request):
    '''
    GET:
    Get basic Statistics information.
    '''

    jsonData = request.data
    logger.debug("request.data: {0}".format(jsonData))
    if request.method == 'POST':

        # check the request data
        if ("sourceType" not in jsonData or "opTypes" not in jsonData):
            failObj = {"status": "failed",
                       "reason": "Please make sure your request data is valid."}
            return JsonResponse(failObj, status=400)
        # response all valid columns
        sparkCode = getBasicStatsSparkCode(jsonData)
        maxCheck = 600 if "maxchecknum" not in jsonData.keys() else jsonData["maxchecknum"]
        duration = 0.1 if "checkduration" not in jsonData.keys() else jsonData["checkduration"]
        output = executeSpark(sparkCode, maxCheckCount=maxCheck, reqCheckDuration=duration)
        if not output:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        elif output["status"] != "ok":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            logger.debug("output: {}".format(output))
            data = output["data"]["text/plain"]

            results = json.loads(data)
            sucessObj = {"status": "success", "results": results}
            return JsonResponse(sucessObj)


@api_view(['POST'])
def getHypothesisTest(request):
    '''
    GET:
    Get hypothesis test information.
    '''

    jsonData = request.data
    logger.debug("request.data: {0}".format(jsonData))
    if request.method == 'POST':

        # check the request data
        if ("sourceType" not in jsonData or "inputParams" not in jsonData):
            failObj = {"status": "failed",
                       "reason": "Please make sure your request data is valid."}
            return JsonResponse(failObj, status=400)
        # response all valid columns
        sparkCode = getHypothesisTestSparkCode(jsonData)

        maxCheck = 600 if "maxchecknum" not in jsonData.keys() else jsonData["maxchecknum"]
        duration = 0.1 if "checkduration" not in jsonData.keys() else jsonData["checkduration"]
        output = executeSpark(sparkCode, maxCheckCount=maxCheck, reqCheckDuration=duration)
        if not output:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        elif output["status"] != "ok":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            logger.debug("output: {}".format(output))
            data = output["data"]["text/plain"]

            results = json.loads(data)
            sucessObj = {"status": "success", "results": results}
            return JsonResponse(sucessObj)


@api_view(['POST'])
def upload(request):
    '''
    上传csv文件到hdfs， 返回表单。 目前支持中文，空行， 自定义分隔符。

    '''

    jsonData = request.POST
    file = request.FILES.get('file')
    fileName = file.name
    if request.method == 'POST':
        files = fileFormat(file)
        if not files:
            return JsonResponse({'status': 'false', 'reason': 'filetype is wrong'})
        nNPort = jsonData['nnport'] if 'nnport' in jsonData else "50070"
        hdfsHost = jsonData['hdfshost'] if 'hdfshost' in jsonData else "spark-master0"
        rootFolder = jsonData['rootfolder'] if 'rootfolder' in jsonData else "tmp/users"
        username = jsonData['username'] if 'username' in jsonData else "yzy"
        header = jsonData['header'] if 'header' in jsonData else 'false'
        # maxRowCount = jsonData['maxrowcount'] if 'maxrowcount' in jsonData else 10000
        delimiter = jsonData['delimiter'] if 'delimiter' in jsonData else ','
        quote = jsonData['quote'] if 'quote' in jsonData else '"'
        port = jsonData['port'] if 'port' in jsonData else '9000'

        for file in files:

            upload = uploadToHdfs(
                file, hdfsHost, nNPort, rootFolder, username
            )
            if not upload:
                return JsonResponse({"status": "false", 'reason': 'see the logs'})

            else:
                sparkCode = csvToParquetSparkCode(
                    file.name, delimiter, quote, hdfsHost,
                    port, rootFolder, username, header
                )

                output = executeSpark(sparkCode, maxCheckCount=600, reqCheckDuration=0.1)
                if not output:
                    failObj = {"status": "failed",
                               "reason": "Please see the logs for details."}
                    return JsonResponse(failObj, status=400)
                elif output["status"] != "ok":
                    failObj = {"status": "failed",
                               "reason": output}
                    return JsonResponse(failObj, status=400)
                else:
                    Singleton().addPanelFile(fileName, file, username)
        context = {
            'status': 'ok',
            'data': {
                'db': {},
                'panel': {}
            }
        }
        for key, value in Singleton().dataPaltForm[username]['panel'].items():
            context['data']['panel'][key] = []
            for file in value:
                chname = chName(file.name)
                context['data']['panel'][key].append(chname)

            if 'db' in Singleton().dataPaltForm[username].keys():
                for md5, dbObj in Singleton().dataPaltForm[username]['db'].items():
                    if not dbObj.con:
                        dbObj.connectDB()
                    dbObj.fetchAllDabaBase()

                    context['data']['db'][md5] = {
                        'dbtype': dbObj.dbPaltName,
                        'dbport': dbObj.dbPort,
                        'dbuser': dbObj.dbUserName,
                        'dblist': dbObj.dataBasesRs
                    }
            # data = output["data"]["text/plain"]

            # results = json.loads(data)
            # sucessObj = {"status": "success", "results": results}
        return JsonResponse(context)


@api_view(['POST'])
def getPanel(request, modeName):
    '''
    '''

    jsonData = request.data
    if request.method == 'POST':
        modeList = ['all', 'data', 'schema']
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)

        rootFolder = jsonData['rootfolder'] if 'rootfolder' in jsonData else "tmp/users"
        username = jsonData['username'] if 'username' in jsonData else "yzy"
        maxRowCount = jsonData['maxrowcount'] if 'maxrowcount' in jsonData else 10000
        sparkCode = getCsvParquetSparkCode(
            idName(jsonData['filename']), modeName, rootFolder, username, maxRowCount
        )

        output = executeSpark(sparkCode, maxCheckCount=600, reqCheckDuration=0.1)
        if not output:
            failObj = {"status": "failed",
                       "reason": "Please see the logs for details."}
            return JsonResponse(failObj, status=400)
        elif output["status"] != "ok":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            logger.debug("output: {}".format(output))
            data = output["data"]["text/plain"]

            results = json.loads(data)
            sucessObj = {"status": "ok", "results": results}
            return JsonResponse(sucessObj)
