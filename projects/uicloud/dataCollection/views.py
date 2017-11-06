from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view
# from django.views.generic import TemplateView
from .gxmHandleClass.ConnectDataBase import ConnectDataBase
from .gxmHandleClass.Singleton import *
from dashboard.models import DashboardFolderByUser, DashboardViewByUser, DashboardIndexByUser
import time
import pyhdfs
import logging

# Get an instance of a logger
logger = logging.getLogger("uicloud.dataCollection.views")
logger.setLevel(logging.DEBUG)
# Create your views here.


# @permission_required('uiaccounts.pallasdata', login_url='/uiaccounts/afterlogin/')
def IndexView(request):
    return render(request, 'dataCollection/dataSourceSelect.html')


# @permission_required('uiaccounts.dataBuildView', login_url='/uiaccounts/afterlogin/')
def dataBuildView(request):
    return render(request, 'dataCollection/dataAnalysis.html')


@api_view(['POST'])
def connectDataBaseHandle(request):
    '''
    连接数据库平台
    '''
    jsonData = request.data
    if request.method == 'POST':
        dbPaltName = jsonData["dataBaseName"].lower()
        dbSid = None
        if dbPaltName == 'oracle':
            dbSid = jsonData["dbSid"]
        dataBaseObj = ConnectDataBase(
            dbPaltName,
            jsonData["location"],
            jsonData["port"],
            jsonData["dbuserName"],
            jsonData["dbuserPwd"],
            dbSid,
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        )
        isConnect = dataBaseObj.connectDB()
        if isConnect:
            username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
            notIn = Singleton().addPalt(dataBaseObj, username)
            if not notIn:
                return JsonResponse({'status': 'failed', 'reason': 'the_palt_is_already_has'})
            return JsonResponse({'status': 'success'})

        else:
            context = {'status': 'failed', 'reason': "can't connect db"}
            return JsonResponse(context)


@api_view(['POST'])
def showAllDbOfPalt(request):
    '''
    返回当前平台所有数据库
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        context = {
            'status': 'success',
            'results': {}
        }
        if username not in Singleton().dataPaltForm.keys():
            return JsonResponse({'status': 'failed', 'reason': '{0} has not connected to any database'.format(username)})
        for md5, dbObj in Singleton().dataPaltForm[username].items():
            if not judgeConn(dbObj.con):
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


@api_view(['POST'])
def showAllTablesOfaDataBase(request):
    '''
    选择具体数据库下的表格
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        dbObjIndex = jsonData['dbObjIndex']

        if username not in Singleton().dataPaltForm.keys():
            return JsonResponse({'status': 'failed', 'reason': '{0} has not connected to any database'.format(username)})
        if dbObjIndex not in Singleton().dataPaltForm[username].keys():
            return JsonResponse({'status': 'failed', 'reason': 'This database is not yet connected'})
        dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
        if not judgeConn(dataBaseObj.con):
            isConnect = dataBaseObj.connectDB()
            if not isConnect:
                context = {'status': 'failed', 'reason': "can't connect db"}
                return JsonResponse(context)

        data = dataBaseObj.fetchTableBydataBaseName(jsonData["theDBName"])
        if data == 'failed':
            return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})

        context = {
            "status": "success",
            "data": data
        }
        return JsonResponse(context)


@api_view(['POST'])
def filterTable(request, modeName):
    '''
    根据条件查询. 返回表格数据
    '''
    jsonData = request.data
    logger.debug('jsondata: {0}'.format(jsonData))
    dbObjIndex = jsonData['source']
    username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
    if username not in Singleton().dataPaltForm.keys():
        return JsonResponse({'status': 'failed', 'reason': '{0} has not connected to any database'.format(username)})
    if dbObjIndex not in Singleton().dataPaltForm[username].keys():
        return JsonResponse({'status': 'failed', 'reason': 'This database is not yet connected'})

    dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
    if not judgeConn(dataBaseObj.con):
        isConnect = dataBaseObj.connectDB()
        if not isConnect:
            context = {'status': 'failed', 'reason': "can't connect db"}
            return JsonResponse(context)

    if request.method == 'POST':
        modeList = ['all', 'data', 'schema']
        if modeName not in modeList:
            failObj = {"status": "failed",
                       "reason": "the mode must one of {0}".format(modeList)}
            return JsonResponse(failObj, status=400)

        rs = dataBaseObj.filterTableData(jsonData, modeName)
        if rs == 'failed':
            return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})
        elif rs == 'name error':
            return JsonResponse({'status': 'failed', 'reason': 'name repetition'})
        elif rs == 'limit type':
            return JsonResponse({'status': 'failed', 'reason': 'limit type must be int'})

        rs = dataBaseObj.columnMap(rs, jsonData, modeName)
        if rs == 'newNameFalse':
            return JsonResponse({'status': 'failed', 'reason': 'new column name has been repetition'})
        elif rs == 'oldNameFalse':
            return JsonResponse({'status': 'failed', 'reason': "can't find the old column name"})

        context = {
            "status": "success",
            "results": rs
        }
        return JsonResponse(context)


@api_view(['POST'])
def deletePlat(request):
    '''
    删除平台文件
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        rs = Singleton().deletePalt(username, jsonData['dbObjIndex'])
        if not rs:
            return JsonResponse({'status': 'failed', 'reason': 'please see the detail logs'})
        return JsonResponse({'status': 'success'})


@api_view(['POST'])
def deleteTempCol(request):
    '''
    删除拆分后的字段
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        if 'tables' not in jsonData.keys():
            rs = Singleton().deleteTempSplit(username)
        else:
            rs = Singleton().deleteTempSplit(username, jsonData['tables'])

        if not rs:
            return JsonResponse({'status': 'failed', 'reason': 'please see the detail logs'})
        return JsonResponse({'status': 'success'})


@api_view(['POST'])
def judgeIcon(request, hdfsHost="spark-master0", nnPort="50070", csvUrl="/tmp/users", url="/users", userName="myfolder"):
    '''
    返回图标状态（是否亮）
    '''
    jsonData = request.data
    logger.debug('jsondata: {0}'.format(jsonData))
    if request.method == 'POST':
        dashusername = jsonData['dashusername'] if 'dashusername' in jsonData.keys() else 'yzy'
        datausername = jsonData['datausername'] if 'datausername' in jsonData.keys() else 'yzy'
        second = 0
        third = 0
        fourth = 1

        if datausername in Singleton().dataPaltForm.keys():
            for key, value in Singleton().dataPaltForm[datausername].items():
                if judgeConn(value.con):
                    second = 1
                    break
        csvUrl = '{0}/{1}'.format(csvUrl, userName)
        url = '{0}/{1}'.format(url, userName)
        client = pyhdfs.HdfsClient(hosts="{0}:{1}".format(hdfsHost, nnPort))
        if client.exists(url):
            fileList = client.listdir(url)
            if fileList:
                second = 1
                third = 1
        if second == 0:
            if client.exists('{0}/{1}'.format(csvUrl, 'parquet')):
                parquetList = client.listdir('{0}/{1}'.format(csvUrl, 'parquet'))
                if parquetList:
                    second = 1

        folderList = DashboardFolderByUser.objects.filter(username=dashusername)
        viewList = DashboardViewByUser.objects.filter(username=dashusername)
        indexList = DashboardIndexByUser.objects.filter(username=dashusername)
        logger.debug('folderList: {0}, viewList: {1}, indexList: {2}'.format(folderList, viewList, indexList))
        if len(folderList) == 0 and len(viewList) == 0 and len(indexList) == 0:
            fourth = 0

        context = {
            "status": "success",
            "results": {
                "constructview": second,
                "dashboardview": third,
                "statementview": fourth
            }
        }
        return JsonResponse(context)
