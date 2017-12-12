from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import permission_required
from django.http import JsonResponse
import sys
from .models import DashboardFolderByUser, DashboardViewByUser, DashboardIndexByUser
import logging

# Get an instance of a logger
logger = logging.getLogger("uicloud.dashboard.views")
logger.setLevel(logging.DEBUG)


# @permission_required('uiaccounts.pallasdata2', login_url='/uiaccounts/afterlogin/')
def HomeView(request):
    return render(request, 'dashboard/dashboard.html')


def getAllDataFunction(username, datatype=None):
    context = {}
    folderList = DashboardFolderByUser.objects.filter(username=username, parentfoldername=None)
    if datatype is not None and datatype == 'folder':
        for folder in folderList:
            context[folder.foldername] = []
            subfolderList = DashboardFolderByUser.objects.filter(parentfoldername=folder.foldername)
            for subfolder in subfolderList:
                context[folder.foldername].append(subfolder.foldername)
            return context
    else:
        for folder in folderList:
            context[folder.foldername] = {}
            subfolderList = DashboardFolderByUser.objects.filter(parentfoldername=folder.foldername)
            for subfolder in subfolderList:
                context[folder.foldername][subfolder.foldername] = {}
                tablelist = subfolder.dashboardviewbyuser_set.all()
                num = len(tablelist)
                for i in range(num):
                    if tablelist[i].row == 'row':
                        continue
                    context[folder.foldername][subfolder.foldername]['视图{0}'.format(i + 1)] = {
                        'row': tablelist[i].row,
                        'column': tablelist[i].column,
                        'username': tablelist[i].username,
                        'tablename': tablelist[i].tablename,
                        'viewtype': tablelist[i].viewtype,
                        'viewname': tablelist[i].viewname,
                        'note': tablelist[i].note,
                        'id': tablelist[i].id,
                        'show': tablelist[i].show,
                        'isopen': tablelist[i].isopen,
                        'calculation': tablelist[i].calculation,
                        'status': tablelist[i].status,
                        'viewstyle': tablelist[i].viewstyle,
                        'customcalculate': tablelist[i].customcalculate,
                        'sequential': tablelist[i].sequential,
                        'handledatapost': tablelist[i].handledatapost,
                        'drilldowndata' : tablelist[i].drilldowndata
                    }
        return context


@api_view(['POST'])
def getAllData(request):
    '''
    第一次进去  返回用户所有数据
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        if 'datatype' in jsonData.keys() and jsonData['datatype'] == 'folder':
            try:
                context = getAllDataFunction(username, jsonData['datatype'])
                return JsonResponse(context)
            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})

        else:
            try:
                context = getAllDataFunction(username)
                return JsonResponse(context)
            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def dashboardTableAdd(request):
    '''
    传入一个table的各项参数，保存并返回用户所有数据
    '''
    jsonData = request.data
    username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'

    if request.method == 'POST':
        try:
            if 'id' in jsonData.keys() and jsonData['id']:
                table = DashboardViewByUser.objects.get(id=int(jsonData['id']))
                table.row = jsonData['row']
                table.column = jsonData['column']
                table.viewtype = jsonData['viewtype']
                table.calculation = jsonData['calculation']
                table.viewstyle = jsonData['viewstyle']
                table.customcalculate = jsonData['customcalculate']
                table.tablename = jsonData['tablename']
                table.sequential = jsonData['sequential']
                table.handledatapost = jsonData['handledatapost']
                table.drilldowndata = jsonData['drilldowndata']
                table.save()
            else:
                foldername = jsonData['foldername']
                if jsonData['row'] == 'row':
                    countlist = DashboardFolderByUser.objects.filter(foldername=foldername)
                    if len(countlist) > 0:
                        return JsonResponse({'status': 'false'})

                defaultfolderlist = DashboardFolderByUser.objects.filter(foldername=jsonData['defaultparent'])
                if len(defaultfolderlist) == 0:
                    defaultfolder = DashboardFolderByUser(
                        username=username,
                        foldername=jsonData['defaultparent']
                    )
                    defaultfolder.save()

                folderlist = DashboardFolderByUser.objects.filter(foldername=foldername)
                if len(folderlist) == 0:
                    folder = DashboardFolderByUser(
                        username=username,
                        foldername=foldername,
                        parentfoldername=jsonData['defaultparent']
                    )
                    folder.save()
                else:
                    folder = folderlist[0]

                table = DashboardViewByUser(
                    row=jsonData['row'],
                    column=jsonData['column'],
                    username=username,
                    tablename=jsonData['tablename'],
                    viewtype=jsonData['viewtype'],
                    calculation=jsonData['calculation'],
                    folder=folder,
                    viewstyle=jsonData['viewstyle'],
                    customcalculate=jsonData['customcalculate'],
                    sequential=jsonData['sequential'],
                    handledatapost=jsonData['handledatapost'],
                    drilldowndata=jsonData['drilldowndata']
                )
                table.save()

            context = {'status': 'ok', 'tableid': table.id}
            return JsonResponse(context)
        except Exception:
            logger.error("Exception: {0}".format(sys.exc_info()))
            return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def dashboardFolderAdd(request):
    '''
    保存文件夹.
    '''
    jsonData = request.data

    if request.method == 'POST':
        folderlist = DashboardFolderByUser.objects.filter(foldername=jsonData['foldername'])
        if len(folderlist) > 0:
            context = {
                'status': 'false',
                "reason": "the name has been used"
            }
            return JsonResponse(context)

        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        folder = DashboardFolderByUser(
            foldername=jsonData['foldername'],
            username=username
        )
        folder.save()

        context = {
            'status': 'ok'
        }
        return JsonResponse(context)


@api_view(['POST'])
def RelevanceFolder(request):
    '''
    把报表跟文件夹关联起来.
    '''
    jsonData = request.data

    if request.method == 'POST':
        try:
            parentfoldername = jsonData['parentfoldername']
            folder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
            folder.parentfoldername = parentfoldername
            folder.save()

            username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
            context = getAllDataFunction(username)
            return JsonResponse(context)
        except Exception:
            logger.error("Exception: {0}".format(sys.exc_info()))
            return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def changeName(request):
    '''
    用户自定义view的名字
    '''
    jsonData = request.data
    username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'

    if request.method == 'POST':
        objtype = jsonData['objtype']
        try:
            if objtype == 'view':
                countlist = DashboardViewByUser.objects.filter(viewname=jsonData['newname'])
                if len(countlist) > 0:
                    return JsonResponse({"status": "false", "reason": "this name has been used"})
                table = DashboardViewByUser.objects.get(id=int(jsonData['oldname']))
                table.viewname = jsonData['newname']
                table.save()
                return JsonResponse({'status': 'ok'})

            elif objtype == 'note':
                note = jsonData['note']
                table = DashboardViewByUser.objects.get(id=int(jsonData['id']))
                table.note = note
                table.save()
                context = getAllDataFunction(username)
                return JsonResponse(context)

            elif objtype == 'folder':
                countlist = DashboardFolderByUser.objects.filter(foldername=jsonData['newname'])
                if len(countlist) > 0:
                    return JsonResponse({"status": "false", "reason": "this name has been used"})

                folder = DashboardFolderByUser.objects.get(foldername=jsonData['oldname'])
                folder.foldername = jsonData['newname']
                folder.save()
                context = getAllDataFunction(username)
                return JsonResponse(context)

            elif objtype == 'parentfolder':
                countlist = DashboardFolderByUser.objects.filter(foldername=jsonData['newname'])
                if len(countlist) > 0:
                    return JsonResponse({"status": "false", "reason": "this name has been used"})
                parentfolder = DashboardFolderByUser.objects.get(foldername=jsonData['oldname'])
                folderList = DashboardFolderByUser.objects.filter(parentfoldername=jsonData['oldname'])
                for folder in folderList:
                    folder.parentfoldername = jsonData['newname']
                    folder.save()
                parentfolder.foldername = jsonData['newname']
                parentfolder.save()
                return JsonResponse({'status': 'ok'})
        except Exception:
            logger.error("Exception: {0}".format(sys.exc_info()))
            return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def deleteFolder(request):
    '''
    删除文件夹，子文件夹或者视图
    '''
    jsonData = request.data
    username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'

    if request.method == 'POST':
        datatype = jsonData['datatype']
        try:
            if datatype == 'parentfolder':
                isDeleteAll = jsonData['recursive']
                if isDeleteAll == 'yes':
                    if 'foldername' in jsonData.keys():
                        folderList = DashboardFolderByUser.objects.filter(parentfoldername=jsonData['foldername'])
                        for folder in folderList:
                            folder.dashboardviewbyuser_set.all().delete()
                            folder.delete()
                        parentfolder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
                        parentfolder.delete()

                    else:

                        pFolderList = DashboardFolderByUser.objects.filter(username=username,
                                                                           parentfoldername=None)
                        for pFolder in pFolderList:
                            if pFolder.foldername == jsonData['defaultparent']:
                                continue
                            cFolderList = DashboardFolderByUser.objects.filter(parentfoldername=pFolder.foldername)
                            for cfolder in cFolderList:
                                cfolder.dashboardviewbyuser_set.all().delete()
                                cfolder.delete()
                            pFolder.delete()

                else:
                    if 'foldername' in jsonData.keys():
                        folderList = DashboardFolderByUser.objects.filter(parentfoldername=jsonData['foldername'])
                        for folder in folderList:
                            folder.parentfoldername = jsonData['defaultparent']
                            folder.save()
                        parentfolder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
                        parentfolder.delete()

                    else:
                        defaultfolderlist = DashboardFolderByUser.objects.filter(foldername=jsonData['defaultparent'])
                        if len(defaultfolderlist) == 0:
                            defaultfolder = DashboardFolderByUser(
                                username=username,
                                foldername=jsonData['defaultparent']
                            )
                            defaultfolder.save()
                        pFolderList = DashboardFolderByUser.objects.filter(username=username,
                                                                           parentfoldername=None)
                        for pFolder in pFolderList:
                            if pFolder.foldername == jsonData['defaultparent']:
                                continue
                            cFolderList = DashboardFolderByUser.objects.filter(parentfoldername=pFolder.foldername)
                            for cfolder in cFolderList:
                                cfolder.parentfoldername = jsonData['defaultparent']
                                cfolder.save()
                            pFolder.delete()

            elif datatype == 'folder':
                folder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
                folder.dashboardviewbyuser_set.all().delete()
                folder.delete()

            elif datatype == 'view':
                table = DashboardViewByUser.objects.get(id=int(jsonData['tableid']))
                table.delete()

            context = getAllDataFunction(username)
            return JsonResponse(context)
        except Exception:
            logger.error("Exception: {0}".format(sys.exc_info()))
            return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def setSwitch(request):
    '''
    记录table的状态 show:隐藏 isopen:table是否打开 status:记录table位置信息
    '''
    jsonData = request.data

    if request.method == 'POST':
        try:
            if jsonData['switch'] == 'show':
                username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
                if 'showall' in jsonData.keys() and jsonData['showall'] == 'yes':
                    tableList = DashboardViewByUser.objects.filter(username=username)
                    for table in tableList:
                        table.show = True
                        table.save()
                else:
                    table = DashboardViewByUser.objects.get(id=int(jsonData['id']))
                    if table.show:
                        table.show = False
                        table.status = None  # 每次调用都会把status置空 防止位置冲突
                    else:
                        table.show = True
                    table.save()
                context = getAllDataFunction(username)
                return JsonResponse(context)

            elif jsonData['switch'] == 'isopen':
                table = DashboardViewByUser.objects.get(id=int(jsonData['id']))
                if table.isopen:
                    table.isopen = False
                else:
                    table.isopen = True
                table.save()
                context = {
                    'status': 'ok'
                }
                return JsonResponse(context)

            elif jsonData['switch'] == 'status':
                tableList = eval(jsonData['tablelist'])
                for key, value in tableList.items():
                    try:
                        table = DashboardViewByUser.objects.get(id=key[1:])
                        table.status = value
                        table.save()
                    except Exception:
                        return JsonResponse({'status': 'false', 'reason': 'table id is wrong'})
                context = {
                    'status': 'ok'
                }
                return JsonResponse(context)

            else:
                return JsonResponse({'status': 'false', 'reason': 'i don"t know your switch.'})

        except Exception:
            logger.error("Exception: {0}".format(sys.exc_info()))
            return JsonResponse({'status': 'false', 'reason': 'Please see the detailed logs.'})


@api_view(['POST'])
def indexAdd(request):
    '''
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        indexList = DashboardIndexByUser.objects.filter(
            username=username,
            tablename=jsonData['tablename'],
            indexname=jsonData['indexname']
        )
        if len(indexList) > 0:
            context = {
                'status': 'failed',
                "reason": "the name has been used"
            }
            return JsonResponse(context)

        index = DashboardIndexByUser(
            row=jsonData['row'],
            column=jsonData['column'],
            username=username,
            tablename=jsonData['tablename'],
            indextype=jsonData['indextype'],
            indexname=jsonData['indexname'],
            calculation=jsonData['calculation'],
            indexstyle=jsonData['indexstyle'],
            customcalculate=jsonData['customcalculate'],
            sequential=jsonData['sequential'],
            handledatapost=jsonData['handledatapost'],
            drilldowndata=jsonData['drilldowndata']

        )
        index.save()
        context = {'status': 'success'}
        return JsonResponse(context)


@api_view(['POST'])
def indexGet(request):
    '''
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        if 'indexname' not in jsonData.keys():
            indexList = DashboardIndexByUser.objects.filter(username=username, tablename=jsonData['tablename'])
            indexNameList = []
            for index in indexList:
                indexNameList.append(index.indexname)
            indexNameList.reverse()
            context = {
                "status": "success",
                "indexNameList": indexNameList
            }
            return JsonResponse(context)
        else:
            try:
                index = DashboardIndexByUser.objects.get(
                    username=username,
                    tablename=jsonData['tablename'],
                    indexname=jsonData['indexname']
                )
                if 'newname' in jsonData.keys():
                    indexList = DashboardIndexByUser.objects.filter(
                        username=username,
                        tablename=jsonData['tablename'],
                        indexname=jsonData['newname']
                    )
                    if len(indexList) > 0:
                        context = {
                            'status': 'failed',
                            "reason": "the name has been used"
                        }
                    else:
                        index.indexname = jsonData['newname']
                        index.save()
                        context = {'status': 'success'}

                elif 'remove' in jsonData.keys() and jsonData['remove'] == 'yes':
                    index.delete()
                    context = {'status': 'success'}

                else:
                    context = {
                        'status': 'success',
                        'data': {
                            'row': index.row,
                            'column': index.column,
                            'username': index.username,
                            'tablename': index.tablename,
                            'indextype': index.indextype,
                            'indexname': index.indexname,
                            'indexstyle': index.indexstyle,
                            'calculation': index.calculation,
                            'customcalculate': index.customcalculate,
                            'sequential': index.sequential,
                            'handledatapost': index.handledatapost,
                            'drilldowndata' : index.drilldowndata
                        }
                    }
            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                context = {
                    "status": "failed",
                    "reason": "there is no this index"
                }
            return JsonResponse(context)
