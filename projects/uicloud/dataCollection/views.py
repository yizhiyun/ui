from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view
# from django.views.generic import TemplateView
from .gxmHandleClass.ConnectDataBase import ConnectDataBase
from .gxmHandleClass.Singleton import Singleton
import time
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
                return JsonResponse({'status': 'failed', 'reason': 'the palt is already has'})
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
        if not dataBaseObj.con:
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
    dbObjIndex = jsonData['source']
    username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
    if username not in Singleton().dataPaltForm.keys():
        return JsonResponse({'status': 'failed', 'reason': '{0} has not connected to any database'.format(username)})
    if dbObjIndex not in Singleton().dataPaltForm[username].keys():
        return JsonResponse({'status': 'failed', 'reason': 'This database is not yet connected'})

    dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
    if not dataBaseObj.con:
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

        maxRowCount = jsonData['maxrowcount'] if 'maxrowcount' in jsonData.keys() else 200
        data = dataBaseObj.filterTableData(jsonData, modeName, maxRowCount)
        if data == 'failed':
            return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})
        elif data == 'name error':
            return JsonResponse({'status': 'failed', 'reason': 'name repetition'})
        elif data == 'limit type':
            return JsonResponse({'status': 'failed', 'reason': 'limit type must be int'})

        context = {
            "status": "success",
            "results": data
        }
        return JsonResponse(context)


@api_view(['POST'])
def deletePlat(request):
    '''
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        dbObjIndex = jsonData['dbObjIndex']
        if username not in Singleton().dataPaltForm.keys():
            return JsonResponse({'status': 'failed', 'reason': '{0} has not connected to any database'.format(username)})
        if dbObjIndex not in Singleton().dataPaltForm[username].keys():
            return JsonResponse({'status': 'failed', 'reason': 'This database is not yet connected'})

        result = Singleton().deletePalt(dbObjIndex, username)
        if result:
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'failed', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def deleteTempCol(request):
    '''
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        dbObjIndex = jsonData['source']

        if username not in Singleton().dataPaltForm.keys():
            return JsonResponse({'status': 'failed', 'reason': '{0} has not connected to any database'.format(username)})
        if dbObjIndex not in Singleton().dataPaltForm[username].keys():
            return JsonResponse({'status': 'failed', 'reason': 'This database is not yet connected'})

        dataBaseObj = Singleton().dataPaltForm[username][dbObjIndex]
        for tablename in jsonData['tableNameList']:
            coldickey = '{0}_{1}'.format(jsonData['database'], tablename)
            if coldickey in dataBaseObj.list.keys():
                dataBaseObj.list[coldickey].clear()
        return JsonResponse({'status': 'success'})
