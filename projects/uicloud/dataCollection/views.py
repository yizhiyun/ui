# from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.views.generic import TemplateView
from .gxmHandleClass.ConnectDataBase import ConnectDataBase
# from .DataModels.PaltInfoModel import PaltInfoModel
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


class SpecialDataTypesEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        elif isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        elif isinstance(obj, datetime.timedelta):
            return (datetime.datetime.min + obj).time().isoformat()
        else:
            return super(SpecialDataTypesEncoder, self).default(obj)


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
        context = {
            'status': 'failed',
            'reason': "can't connect db"
        }
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
            dbObj.connectDB()
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
        dataBaseObj.connectDB()
    data = dataBaseObj.fetchTableBydataBaseName(request.POST["theDBName"])
    context = {
        "status": "ok",
        "data": data
    }
    return JsonResponse(context)

# 返回某个表格下的all字段.


def showTableFiledsOFaTable(request):
    username = request.POST['username'] if 'username' in request.POST else 'yzy'
    dbObjIndex = request.POST['dbObjIndex']
    dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
    if not dataBaseObj.con:
        dataBaseObj.connectDB()
    data = dataBaseObj.fetchFiledsOfATable(request.POST["tableName"])
    context = {
        "status": "success",
        "results": {"schema": data}
    }
    return JsonResponse(context)

# 返回这个表格的所有的数据


def showTableDetailDataOfFileds(request):
    username = request.POST['username'] if 'username' in request.POST else 'yzy'
    dbInfoArr = request.POST["dbInfo"].split("_YZYPD_")
    dbindex = dbInfoArr[0]
    tbName = dbInfoArr[2]
    dataBaseObj = Singleton().dataPaltForm[username][dbindex]
    if not dataBaseObj.con:
        dataBaseObj.connectDB()
    data = dataBaseObj.fetchAllDataOfaTableByFields(tbName)
    return HttpResponse(json.dumps({
        "status": "ok",
        "data": data
    }, cls=SpecialDataTypesEncoder))

# 根据条件查询. 返回表格数据


@api_view(['POST'])
def filterTable(request, modeName):
    jsonData = request.data
    Singleton().currentDBObjIndex = jsonData['source']
    username = jsonData['username'] if 'username' in jsonData else 'yzy'
    dataBaseObj = Singleton().dataPaltForm[username][Singleton().currentDBObjIndex]
    if not dataBaseObj.con:
        dataBaseObj.connectDB()
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

        if modeName == 'all':
            results = {
                "schema": schema,
                "data": dataBaseObj.filterTableData(jsonData)
            }
        elif modeName == 'schema':
            results = {
                "schema": schema
            }
        elif modeName == 'data':
            results = {
                "data": dataBaseObj.filterTableData(jsonData)
            }

        context = {
            "status": "success",
            "results": results
        }
        return JsonResponse(context)
