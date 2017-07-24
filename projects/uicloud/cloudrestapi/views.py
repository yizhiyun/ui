from rest_framework.decorators import api_view
# from rest_framework.response import Response
from .data_handler import *
from django.http import JsonResponse

import json
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)
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


@api_view(['GET'])
def getTableViaSpark(request, tableName, modeName):
    '''
    GET:
    Get all table from the current user.
    '''

    jsonData = request.data
    logger.info("request.data: {0}, tableName: {1}".format(
        jsonData, tableName))
    if request.method == 'GET':

        modeList = ['all', 'data', 'schema']
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)
        # response all valid columns
        curUserName = "myfolder"
        sparkCode = getTableInfoSparkCode(
            curUserName, tableName, mode=modeName)

        output = executeSpark(sparkCode)
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
