from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.generic import TemplateView
from django.http import JsonResponse
from .importTestDataTmp import testDataHandler
from .models import DashboardFolderByUser, DashboardViewByUser


class HomeView(TemplateView):
    template_name = 'dashboard/dashboard.html'


def hello(request):

    td = testDataHandler()
    context = {}
    context['table_name'] = td.getAlldata()
    return render(request, 'dashboard/dashboard.html', context)


def ajax_list(request):
    td = testDataHandler()

    return JsonResponse(td.getAjaxList())


@api_view(['POST'])
def getAllData(request):
    '''
    第一次进去  返回用户所有数据
    '''
    jsonData = request.data
    if request.method == 'POST':
        username = jsonData['username']
        context = {}
        folderList = DashboardFolderByUser.objects.filter(username=username)
        for folder in folderList:
            tablelist = folder.dashboardviewbyuser_set.all()
            num = len(tablelist)
            if num > 0:  # 此处做一个判断 有对应的table说明是subfolder
                context[folder.foldername] = {}
                context[folder.foldername]['parentfoldername'] = folder.parentfoldername
                for i in range(num):
                    if tablelist[i].row == 'row':
                        continue
                    context[folder.foldername]['table{0}'.format(tablelist[i].id)] = {
                        'row': tablelist[i].row,
                        'column': tablelist[i].column,
                        'username': tablelist[i].username,
                        'tablename': tablelist[i].tablename,
                        'viewtype': tablelist[i].viewtype,
                        'viewname': tablelist[i].viewname
                    }

        return JsonResponse(context)


@api_view(['POST'])
def dashboardTableAdd(request):
    '''
    传入一个table的各项参数，保存并返回下一个页面与这些参数.
    '''
    jsonData = request.data

    if request.method == 'POST':
        foldername = jsonData['foldername']
        try:
            if jsonData['row'] == 'row':
                folder = DashboardFolderByUser.objects.get(foldername=foldername)
                return JsonResponse({'status': 'faild'})
            folder = DashboardFolderByUser.objects.get(foldername=foldername)
        except Exception:
            folder = DashboardFolderByUser(
                username=jsonData['username'],
                foldername=foldername
            )
            folder.save()
        table = DashboardViewByUser(
            row=jsonData['row'],
            column=jsonData['column'],
            username=jsonData['username'],
            tablename=jsonData['tablename'],
            viewtype=jsonData['viewtype'],
            folder=folder
        )
        table.save()

        context = {
            'foldername': folder.foldername,
            'row': table.row,
            'column': table.column,
            'username': table.username,
            'tablename': table.tablename,
            'viewtype': table.viewtype
        }
        return JsonResponse(context)
        # return render(request, 'dashboard/xxxx', {'detail': detail})


@api_view(['POST'])
def dashboardFolderAdd(request):
    '''
    保存文件夹.
    '''
    jsonData = request.data

    if request.method == 'POST':
        try:
            DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
            context = {
                'status': 'failed',
                "reason": "the name has been used"
            }
            return JsonResponse(context)

        except Exception:
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

        context = {
            'status': 'ok'
        }
        return JsonResponse(context)


@api_view(['POST'])
def changeViewName(request):
    '''
    用户自定义view的名字
    '''
    jsonData = request.data

    if request.method == 'POST':
        table = DashboardViewByUser.objects.get(id=int(jsonData['viewid'][5:]))
        table.viewname = jsonData['viewname']
        table.save()
        return JsonResponse({'viewname': table.viewname})


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
                parentfolder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
                parentfolder.delete()

        elif foldertype == 'folder':
            folder = DashboardFolderByUser.objects.get(foldername=jsonData['foldername'])
            folder.dashboardviewbyuser_set.all().delete()
            folder.delete()
            return JsonResponse({'status': 'ok'})
