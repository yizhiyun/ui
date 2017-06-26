from django.shortcuts import render
from django.views.generic import TemplateView
from .gxmHandleClass.ConnectDataBase import ConnectDataBase
from .DataModels.PaltInfoModel import PaltInfoModel
from .gxmHandleClass.Singleton import Singleton
import  json
from django.http import HttpResponse
# Create your views here.
class IndexView(TemplateView):
    template_name = 'dataCollection/dataSourceSelect.html'

# 连接数据库平台
def connectDataBaseHandle(req):
    dataBaseObj = ConnectDataBase(
        req.POST["dataBaseName"],
        req.POST["location"],
        req.POST["port"],
        req.POST["userName"],
        req.POST["userPwd"]
         )
    dataBaseObj.connectDB()
    dataBaseObj.fetchAllDabaBase()
    #  创建数据平台模型实例
    # paltInfo = PaltInfoModel(req.POST["dataBaseName"],req.POST["location"],req.POST["port"],req.POST["userName"],req.POST["userPwd"],dataBaseObj.dataBasesRs)
    Singleton().addPalt(dataBaseObj)
    return render(req,"dataCollection/dataAnalysis.html",{"paltInfoList":Singleton().dataPaltForm})

# 选择具体数据库下的表格
def showAllTablesOfaDabaBase(req):
    # print(req.POST)
    Singleton().currentDBObjIndex = int(req.POST["dbObjIndex"])
    return HttpResponse(json.dumps({
        "status":"ok",
        "data":Singleton().dataPaltForm[Singleton().currentDBObjIndex].fetchTableBydataBaseName(req.POST["theDBName"])
    }))

# 返回某个表格下的具体字段
def showTableFiledsOFaTable(req):
    return HttpResponse(json.dumps({
        "status":"ok",
        "data":Singleton().dataPaltForm[Singleton().currentDBObjIndex].fetchFiledsOfATable(req.POST["tableName"])
    }))
