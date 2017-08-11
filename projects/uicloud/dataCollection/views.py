from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from django.views.generic import TemplateView
from .gxmHandleClass.ConnectDataBase import ConnectDataBase
# from .DataModels.PaltInfoModel import PaltInfoModel
from .gxmHandleClass.Singleton import Singleton
import json
import decimal
import datetime


import logging
logger = logging.getLogger(__name__)
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
        dbSid
    )
    dataBaseObj.connectDB()
    dataBaseObj.fetchAllDabaBase()
    #  创建数据平台模型实例
    Singleton().addPalt(dataBaseObj)
    logger.warn(Singleton().dataPaltForm)
    return render(req, "dataCollection/dataAnalysis.html", {"paltInfoList": Singleton().dataPaltForm})

# 选择具体数据库下的表格


def showAllTablesOfaDabaBase(req):
    Singleton().currentDBObjIndex = req.POST["dbObjIndex"]
    return HttpResponse(json.dumps({
        "status": "ok",
        "data": Singleton().dataPaltForm["db"][Singleton().currentDBObjIndex].fetchTableBydataBaseName(
            req.POST["theDBName"])
    }))

# 返回某个表格下的具体字段


def showTableFiledsOFaTable(req):
    return HttpResponse(json.dumps({
        "status": "ok",
        "data": Singleton().dataPaltForm["db"][Singleton().currentDBObjIndex].fetchFiledsOfATable(req.POST["tableName"])
    }))

# 返回这个表格指定字段的所有的数据,只需要table参数


def showTableDetailDataOfFileds(req):
    dbInfoArr = req.POST["dbInfo"].split("_YZYPD_")
    dbindex = dbInfoArr[0]
    tbName = dbInfoArr[2]
    Singleton().currentDBObjIndex = dbindex
    return HttpResponse(json.dumps({
        "status": "ok",
        "data": Singleton().dataPaltForm["db"][Singleton().currentDBObjIndex].fetchAllDataOfaTableByFields(
            tbName)
    }, cls=SpecialDataTypesEncoder))

# 根据条件查询. 返回表格数据


@api_view(['POST'])
def filterTable(request, modeName):
    jsonData = request.data
    Singleton().currentDBObjIndex = jsonData['source']
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
                "data": Singleton().dataPaltForm["db"][Singleton().currentDBObjIndex].filterTableData(jsonData)
            }
        elif modeName == 'schema':
            results = {
                "schema": schema
            }
        elif modeName == 'data':
            results = {
                "data": Singleton().dataPaltForm["db"][Singleton().currentDBObjIndex].filterTableData(jsonData)
            }

        context = {
            "status": "success",
            "results": results
        }
        return JsonResponse(context)
