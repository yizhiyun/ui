from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .columnsMapping import *
from django.http import HttpResponseBadRequest

import json
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

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
        ]
    }
    '''
    logger.info("type(request.data): {0}, \n request.data: {1}".format(type(request.data), request.data))

    jsonData = request.data

    if request.method == 'POST':

        outputColumnsDict = getOutputColumns(jsonData)

        if not outputColumnsDict:
            failObj = {"status": "failed", \
                "reason": "the request data didn't meet the required format. Please check it again."}
            return HttpResponseBadRequest( json.dumps(failObj) )

        # response all valid columns
        successobj = {"columns": outputColumnsDict}
        return Response( json.dumps(outputColumnsDict) )

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

    logger.info("type(request.data): {0}, \n request.data: {1}".format(type(request.data), request.data))
    jsonData=request.data

    if request.method == 'POST':

        # response all valid columns
        sparkCode = getSparkCode(jsonData)
        
        if not sparkCode:
            failObj = {"status": "failed", \
                "reason": "Cannot get the db sources mapping."}
            return HttpResponseBadRequest( failObj )
        
        output = executeSpark( sparkCode )
        if not output:
            failObj = {"status": "failed", \
                "reason": "Please see the detailed logs."}
            return HttpResponseBadRequest( failObj )
        elif output["status"] !="ok":
            failObj = {"status": "failed", \
                "reason": output}
            return HttpResponseBadRequest( failObj )
        else:
            sucessObj = { "status": "success" }
            return Response( sucessObj )

