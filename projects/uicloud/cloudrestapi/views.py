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

        output = executeSpark(sparkCode)
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
            sucessObj = {"status": "success", "results": results}
            return JsonResponse(sucessObj)


@api_view(['POST'])
def upload(request):
    '''
    此处后续应添加空行问题，分隔符如非默认问题的处理手段
    '''

    jsonData = request.data
    file = request.FILES.get('file')
    if request.method == 'POST':
        file = fileFormat(file)
        upload = uploadToHdfs(
            file,
            nNPort=jsonData['nnport'],
            hdfsHost=jsonData['hdfshost'],
            rootFolder=jsonData['rootfolder'],
            username=jsonData['username']
        )
        if upload:
            delimiter = ','
            if jsonData['delimiter']:
                delimiter = jsonData['delimiter']
            quote = '"'
            if jsonData['quote']:
                quote = jsonData['quote']

            sparkCode = getUploadInfoSparkCode(
                file.name,
                delimiter,
                quote,
                hdfsHost=jsonData['hdfshost'],
                Port=jsonData['port'],
                rootFolder=jsonData['rootfolder'],
                username=jsonData['username'],
                header=jsonData['header'],
                maxRowCount=jsonData['maxRowCount']
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
                sucessObj = {"status": "success", "results": results}
                return JsonResponse(sucessObj)
        else:
            return JsonResponse({"status": "false"})
