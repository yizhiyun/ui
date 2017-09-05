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
    """
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
                "type":"equal", # type include "equal","greate than", "less than", "like" and so on.
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
    """
    logger.info("type(request.data): {0}, \n request.data: {1}".format(
        type(request.data), request.data))

    jsonData = request.data

    if request.method == "POST":

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
    """
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
                "type":"equal", # type include "equal","greate than", "less than", "like" and so on.
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
    """

    jsonData = request.data

    logger.debug("type(request.data): {0}, \n request.data: {1}".format(
        type(jsonData), jsonData))
    if request.method == "POST":

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
        elif output["status"] != "ok" or output["data"]["text/plain"] != "True":
            failObj = {"status": "failed",
                       "reason": output}
            return JsonResponse(failObj, status=400)
        else:
            sucessObj = {"status": "success"}
            return JsonResponse(sucessObj)


@api_view(['GET'])
def getAllTablesFromUser(request):
    """
    GET:
    Get all table from the current user.
    """
    if request.method == "GET":
        userPath = "/users/{}".format("myfolder")
        output = listDirectoryFromHdfs(path=userPath)
        if not output["status"]:
            if "RemoteException" in output["results"].keys() and \
               "message" in output["results"]["RemoteException"].keys():
                reason = output["results"]["RemoteException"]["message"]
            else:
                reason = "Please see the logs for details."
            failObj = {"status": "failed", "reason": reason}
            return JsonResponse(failObj, status=400)
        successObj = {"status": "success", "results": output["results"]}
        return JsonResponse(successObj)


@api_view(['POST'])
def getTableViaSpark(request, tableName, modeName):
    """
    GET:
    Get all table from the current user.
    """

    jsonData = request.data
    logger.info("request.data: {0}, tableName: {1}".format(jsonData, tableName))
    if request.method == "POST":

        modeList = ["all", "data", "schema"]
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
    """
    GET:
    Get all table from the custom user.
    """

    if request.method == "POST":
        jsonData = request.data
        output = listDirectoryFromHdfs(
            path=jsonData["rootfolder"], hdfsHost=jsonData["host"], port=jsonData["port"])
        if not output["status"]:
            if "RemoteException" in output["results"].keys() and \
               "message" in output["results"]["RemoteException"].keys():
                reason = output["results"]["RemoteException"]["message"]
            else:
                reason = "Please see the logs for details."
            failObj = {"status": "failed", "reason": reason}
            return JsonResponse(failObj, status=400)
        successObj = {"status": "success", "results": output["results"]}
        return JsonResponse(successObj)


@api_view(['POST'])
def getTableViaSparkCustom(request, tableName, modeName):
    """
    GET:
    Get all table from the custom user.
    """

    jsonData = request.data
    logger.info("request.data: {0}, tableName: {1}".format(
        jsonData, tableName))
    if request.method == "POST":

        modeList = ["all", "data", "schema"]
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)
        # response all valid columns
        sparkCode = getTableInfoSparkCode(
            jsonData["subfolder"],
            tableName,
            mode=modeName,
            hdfsHost=jsonData["host"],
            port=jsonData["port"],
            rootFolder=jsonData["rootfolder"],
            filterJson=jsonData
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
    """
    GET:
    Get basic Statistics information.
    """

    jsonData = request.data
    logger.debug("request.data: {0}".format(jsonData))
    if request.method == "POST":

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
def uploadCsv(request):
    """
    upload csv into hdfs with the paired files, csv and parquet.
    """

    jsonData = request.POST.dict()
    file = request.FILES.get("file")
    if request.method == "POST":

        nnPort = jsonData["nnport"] if "nnport" in jsonData else "50070"
        hdfsHost = jsonData["hdfshost"] if "hdfshost" in jsonData else "spark-master0"
        userName = jsonData["username"] if "username" in jsonData else "myfolder"
        rootFolder = jsonData["rootfolder"] if "rootfolder" in jsonData else "/tmp/users"
        port = jsonData["port"] if "port" in jsonData else "9000"

        # pre-process. If csv, save it into csv files for each worksheet.
        fileDict = preUploadFile(file, userName, jsonData)
        if not fileDict["tables"]:
            return JsonResponse({"status": "failed", "reason": "Only 'csv','xls' and 'xlsx' are supported."})

        # upload csv to hdfs server
        uploadedCsvList = []
        logger.debug("fileDict:{0}".format(fileDict))
        uploadedCsvList = uploadToHdfs(fileDict, hdfsHost, nnPort, rootFolder, userName)
        if not uploadedCsvList:
            return JsonResponse({"status": "failed", "reason": "Please see the logs for details."})

        # process the csv to generate the related parquet table in use.
        sparkCode = convertCsvToParquetSparkCode(uploadedCsvList, jsonData, hdfsHost, port)

        output = executeSpark(sparkCode, maxCheckCount=600, reqCheckDuration=0.2)
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
            if data.startswith("False") or data.endswith("False"):
                failObj = {"status": "failed",
                           "reason": data.replace("False", "", 1)}
                return JsonResponse(failObj, status=400)
            sucessObj = {"status": "success", "results": data}
            return JsonResponse(sucessObj)


@api_view(['GET'])
def getAllTempPairedTablesFromUser(request):
    """
    GET:
    Get all Temporary paired tables(csv and parquet) from the current user.
    """
    if request.method == "GET":
        rootFolder = "/tmp/users"
        username = "myfolder"
        # tmpCsvPath = "{0}/{1}/csv".format(rootFolder, username)
        # output = listDirectoryFromHdfs(path=tmpCsvPath)

        tmpTablePath = "{0}/{1}/parquet".format(rootFolder, username)
        output = listDirectoryFromHdfs(path=tmpTablePath)
        logger.debug("output: {0}".format(output))
        if not output["status"]:
            if "RemoteException" in output["results"].keys() and \
               "message" in output["results"]["RemoteException"].keys():
                reason = output["results"]["RemoteException"]["message"]
            else:
                reason = "Please see the logs for details."
            failObj = {"status": "failed", "reason": reason}
            return JsonResponse(failObj, status=400)

        resDict = {}
        for tableItem in output["results"]:
            tmpCsvTable = "{0}/{1}".format(tmpTablePath, tableItem)
            subOutput = listDirectoryFromHdfs(path=tmpCsvTable, fileTypeList=["DIRECTORY", "FILE"])
            if not subOutput["status"]:
                if "RemoteException" in subOutput["results"].keys() and \
                   "message" in subOutput["results"]["RemoteException"].keys():
                    reason = subOutput["results"]["RemoteException"]["message"]
                else:
                    reason = "Please see the logs for details."
                failObj = {"status": "failed", "reason": reason}
                return JsonResponse(failObj, status=400)

            resDict[tableItem] = subOutput["results"]
        successObj = {"status": "success", "results": resDict}
        return JsonResponse(successObj)


@api_view(['POST'])
def getSpecUploadedTableViaSpark(request, fileName, tableName, modeName):
    """
    GET:
    Get specified table which is generated from the uploaded csv file.
    """

    jsonData = request.data
    logger.debug("request.data: {0}, fileName: {1}, tableName: {2}".format(
        jsonData, fileName, tableName))
    if request.method == "POST":

        modeList = ["all", "data", "schema"]
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "The mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)
        fileTable = "{0}/{1}".format(fileName, tableName)
        logger.debug("fileTable: {0}".format(fileTable))
        # response all valid columns
        sparkCode = getSpecUploadedTableSparkCode(
            fileTable, userName="myfolder", mode=modeName, filterJson=jsonData)
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
            # logger.debug("output: {}".format(output))
            data = output["data"]["text/plain"]

            results = json.loads(data)
            sucessObj = {"status": "success", "results": results}
            return JsonResponse(sucessObj)
