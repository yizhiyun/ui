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

# 连接数据库平台


def connectDataBaseHandle(req):
    dbPaltName = req.POST["dataBaseName"].lower()
    dbSid = None
    if dbPaltName == 'oracle':
        dbSid = req.POST["dbSid"]
    dataBaseObj = ConnectDataBase(
        dbPaltName,
        req.POST["location"],
        req.POST["port"],
        req.POST["dbuserName"],
        req.POST["dbuserPwd"],
        dbSid,
        time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    )
    isConnect = dataBaseObj.connectDB()
    logger.error(isConnect)
    if isConnect:
        username = req.POST['username']
        isAlreadyIn = Singleton().addPalt(dataBaseObj, username)
        if not isAlreadyIn:
            return JsonResponse({'status': 'false', 'reason': 'the palt is already has'})
        context = {
            'db': {},
            'panel': []
        }
        for md5, dbObj in Singleton().dataPaltForm[username]['db'].items():
            dbObj.fetchAllDabaBase()
            context['db'][md5] = {
                'dbtype': dbObj.dbPaltName,
                'dbport': dbObj.dbPort,
                'dbuser': dbObj.dbdbUserName,
                'dblist': dbObj.dataBasesRs
            }

        if 'panel' in Singleton().dataPaltForm[username].keys():
            for panel in Singleton().dataPaltForm[username]['panel']:
                context['panel'].append(panel.name)

        return JsonResponse(context)

    else:
        context = {
            'status': 'false',
            'reason': "can't connect db"
        }
        return JsonResponse(context)

# 选择具体数据库下的表格


def showAllTablesOfaDabaBase(request):
    username = request.POST['username']
    dbObjIndex = request.POST['dbObjIndex']
    dataBaseObj = Singleton().dataPaltForm[username]['db'][dbObjIndex]
    data = dataBaseObj.fetchTableBydataBaseName(request.POST["theDBName"])
    context = {
        "status": "ok",
        "data": data
    }
    return JsonResponse(context)

# 返回某个表格下的具体字段.


def showTableFiledsOFaTable(request):
    username = request.POST['username']
    dbObjIndex = request.POST['dbObjIndex']
    dataBaseObj = Singleton().dataPaltForm[username]['db'][dbObjIndex]
    data = dataBaseObj.fetchFiledsOfATable(request.POST["tableName"])
    context = {
        "status": "ok",
        "data": data
    }
    return JsonResponse(context)

# 返回这个表格的所有的数据


def showTableDetailDataOfFileds(req):
    username = req.POST['username']
    dbInfoArr = req.POST["dbInfo"].split("_YZYPD_")
    dbindex = dbInfoArr[0]
    tbName = dbInfoArr[2]
    dataBaseObj = Singleton().dataPaltForm[username]["db"][dbindex]
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
    username = jsonData['username']
    dataBaseObj = Singleton().dataPaltForm[username]["db"][Singleton().currentDBObjIndex]
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
