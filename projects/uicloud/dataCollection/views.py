from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.generic import TemplateView
from .gxmHandleClass.ConnectDataBase import ConnectDataBase
from .gxmHandleClass.Singleton import Singleton
import json
import decimal
import datetime
import time


import logging

# Get an instance of a logger
logger = logging.getLogger("uicloud.dataCollection.views")
logger.setLevel(logging.DEBUG)
# Create your views here.


class IndexView(TemplateView):
    template_name = 'dataCollection/dataSourceSelect.html'


class dataBuildView(TemplateView):
    template_name = 'dataCollection/dataAnalysis.html'

# 连接数据库平台


def connectDataBaseHandle(request):
    dbPaltName = request.POST["dataBaseName"].lower()
    dbSid = None
    if dbPaltName == 'oracle':
        dbSid = request.POST["dbSid"]
    dataBaseObj = ConnectDataBase(
        dbPaltName,
        request.POST["location"],
        request.POST["port"],
        request.POST["dbuserName"],
        request.POST["dbuserPwd"],
        dbSid,
        time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    )
    isConnect = dataBaseObj.connectDB()
    if isConnect:
        username = request.POST['username'] if 'username' in request.POST else 'yzy'
        notIn = Singleton().addPalt(dataBaseObj, username)
        if not notIn:
            return JsonResponse({'status': 'failed', 'reason': 'the palt is already has'})
        return JsonResponse({'status': 'success'})

    else:
        context = {'status': 'failed', 'reason': "can't connect db"}
        return JsonResponse(context)


# 返回当前平台所有数据库


def showAllDbOfPalt(request):
    username = request.POST['username'] if 'username' in request.POST else 'yzy'
    context = {
        'status': 'success',
        'results': {}
    }
    for md5, dbObj in Singleton().dataPaltForm[username].items():
        if not dbObj.con:
            isConnect = dbObj.connectDB()
            if not isConnect:
                context = {'status': 'failed', 'reason': "can't connect db"}
                return JsonResponse(context)
        dbObj.fetchAllDabaBase()
        context['results'][md5] = {
            'dbtype': dbObj.dbPaltName,
            'dbport': dbObj.dbPort,
            'dbuser': dbObj.dbUserName,
            'dblist': dbObj.dataBasesRs
        }
    return JsonResponse(context)


# 选择具体数据库下的表格


def showAllTablesOfaDataBase(request):
    username = request.POST['username'] if 'username' in request.POST else 'yzy'
    dbObjIndex = request.POST['dbObjIndex']
    dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
    if not dataBaseObj.con:
        isConnect = dataBaseObj.connectDB()
        if not isConnect:
            context = {'status': 'failed', 'reason': "can't connect db"}
            return JsonResponse(context)

    data = dataBaseObj.fetchTableBydataBaseName(request.POST["theDBName"])
    if data == 'failed':
        return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})

    context = {
        "status": "success",
        "data": data
    }
    return JsonResponse(context)

# 返回表格数据


def showTableInfo(request, modeName):
    modeList = ['all', 'data', 'schema']
    if modeName not in modeList:
        failObj = {"status": "failed",
                   "reason": "the mode must one of {0}".format(modeList)}
        return JsonResponse(failObj, status=400)

    username = request.POST['username'] if 'username' in request.POST else 'yzy'
    dbObjIndex = request.POST['dbObjIndex']
    dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
    if not dataBaseObj.con:
        isConnect = dataBaseObj.connectDB()
        if not isConnect:
            context = {'status': 'failed', 'reason': "can't connect db"}
            return JsonResponse(context)

    data = dataBaseObj.fetchTableData(request.POST["tableName"], modeName, request.POST['database'])
    if data == 'failed':
        return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})

    context = {
        "status": "success",
        "results": data
    }
    return JsonResponse(context)

# 根据条件查询. 返回表格数据


@api_view(['POST'])
def filterTable(request, modeName):
    jsonData = request.data
    Singleton().currentDBObjIndex = jsonData['source']
    username = jsonData['username'] if 'username' in jsonData else 'yzy'
    dataBaseObj = Singleton().dataPaltForm[username][Singleton().currentDBObjIndex]
    if not dataBaseObj.con:
        isConnect = dataBaseObj.connectDB()
        if not isConnect:
            context = {'status': 'failed', 'reason': "can't connect db"}
            return JsonResponse(context)

    data = dataBaseObj.filterTableData(jsonData)
    if data == 'failed':
        return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})

    if request.method == 'POST':
        modeList = ['all', 'data', 'schema']
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)

        results = {}
        schema = []
        for column in jsonData['columns'].items():
            schema.append('{0}:{1}'.format(column[0], column[1]["columnType"]))

        if modeName == 'all' or modeName == 'schema':
            results['schema'] = schema

        if modeName == 'all' or modeName == 'data':
            results['data'] = data

        context = {
            "status": "success",
            "results": results
        }
        return JsonResponse(context)
