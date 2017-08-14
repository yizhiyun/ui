# from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.generic import TemplateView
from django.http import JsonResponse

from .models import DashboardFolderByUser, DashboardViewByUser


class HomeView(TemplateView):
    template_name = 'dashboard/dashboard.html'


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
                        'id': tablelist[i].id
                    }
        return context


@api_view(['POST'])
def getAllData(request):
    '''
    第一次进去  返回用户所有数据
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username']
        if 'datatype' in jsonData.keys() and jsonData['datatype'] == 'folder':
            context = getAllDataFunction(username, jsonData['datatype'])
            return JsonResponse(context)

        else:
            context = getAllDataFunction(username)
            return JsonResponse(context)


@api_view(['POST'])
def dashboardTableAdd(request):
    '''
    传入一个table的各项参数，保存并返回下一个页面与这些参数.
    '''
    jsonData = request.data

    if request.method == 'POST':
        foldername = jsonData['foldername']
        if jsonData['row'] == 'row':
            countlist = DashboardFolderByUser.objects.filter(foldername=foldername)
            if len(countlist) > 0:
                return JsonResponse({'status': 'false'})

        defaultfolderlist = DashboardFolderByUser.objects.filter(foldername=jsonData['defaultparent'])
        if len(defaultfolderlist) == 0:
            defaultfolder = DashboardFolderByUser(
                username=jsonData['username'],
                foldername=jsonData['defaultparent']
            )
            defaultfolder.save()

        folderlist = DashboardFolderByUser.objects.filter(foldername=foldername)
        if len(folderlist) == 0:
            folder = DashboardFolderByUser(
                username=jsonData['username'],
                foldername=foldername,
                parentfoldername=jsonData['defaultparent']
            )
            folder.save()
        else:
            folder = folderlist[0]

        table = DashboardViewByUser(
            row=jsonData['row'],
            column=jsonData['column'],
            username=jsonData['username'],
            tablename=jsonData['tablename'],
            viewtype=jsonData['viewtype'],
            folder=folder
        )
        table.save()

        context = {'status': 'ok'}
        return JsonResponse(context)


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

        folder = DashboardFolderByUser(
            foldername=jsonData['foldername'],
            username=jsonData['username']
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
        parentfoldername = jsonData['parentfoldername']
        folder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
        folder.parentfoldername = parentfoldername
        folder.save()

        context = getAllDataFunction(jsonData['username'])
        return JsonResponse(context)


@api_view(['POST'])
def changeViewName(request):
    '''
    用户自定义view的名字
    '''
    jsonData = request.data

    if request.method == 'POST':
        objtype = jsonData['objtype']
        if objtype == 'view':
            countlist = DashboardViewByUser.objects.filter(viewname=jsonData['newname'])
            if len(countlist) > 0:
                return JsonResponse({"status": "false", "reason": "this name has been used"})
            table = DashboardViewByUser.objects.get(id=int(jsonData['oldname']))
            table.viewname = jsonData['newname']
            table.save()
            return JsonResponse({'status': 'ok'})

        elif objtype == 'folder':
            countlist = DashboardFolderByUser.objects.filter(foldername=jsonData['newname'])
            if len(countlist) > 0:
                return JsonResponse({"status": "false", "reason": "this name has been used"})

            folder = DashboardFolderByUser.objects.get(foldername=jsonData['oldname'])
            folder.foldername = jsonData['newname']
            folder.save()
            return JsonResponse({'status': 'ok'})

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


@api_view(['POST'])
def deleteFolder(request):
    '''
    '''
    jsonData = request.data

    if request.method == 'POST':
        foldertype = jsonData['foldertype']
        if foldertype == 'parentfolder':
            isDeleteAll = jsonData['isdeleteall']
            if isDeleteAll == 'yes':
                folderList = DashboardFolderByUser.objects.filter(parentfoldername=jsonData['foldername'])
                for folder in folderList:
                    folder.dashboardviewbyuser_set.all().delete()
                    folder.delete()
            else:
                folderList = DashboardFolderByUser.objects.filter(parentfoldername=jsonData['foldername'])
                for folder in folderList:
                    folder.parentfoldername = jsonData['defaultparent']
                    folder.save()
            parentfolder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
            parentfolder.delete()
            context = getAllDataFunction(jsonData['username'])
            return JsonResponse(context)

        elif foldertype == 'folder':
            folder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
            folder.dashboardviewbyuser_set.all().delete()
            folder.delete()
            context = getAllDataFunction(jsonData['username'])
            return JsonResponse(context)


@api_view(['POST'])
def addNote(request):
    '''
    '''
    jsonData = request.data

    if request.method == 'POST':
        note = jsonData['note']
        table = DashboardViewByUser.objects.get(id=int(jsonData['id']))
        table.note = note
        table.save()
        context = getAllDataFunction(jsonData['username'])
        return JsonResponse(context)
