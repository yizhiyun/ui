from .models import *


def checkOrDeleteView(fileName, username, delete=False, changeName=None):
    '''
    '''
    viewList = DashboardViewByUser.objects.filter(tablename=fileName, username=username)
    indexList = DashboardIndexByUser.objects.filter(tablename=fileName, username=username)
    layoutList = Layout.objects.filter(tablename=fileName, username=username)

    if changeName:
        '''
        更改视图或指标的tablename
        '''
        for view in viewList:
            view.tablename = changeName
            view.save()
        for index in indexList:
            index.tablename = changeName
            index.save()
        for layout in layoutList:
            layout.tablename = changeName
            layout.save()

    else:
        if not delete:
            if len(viewList) > 0 or len(indexList) > 0:
                return True
            else:
                return False
        else:
            for view in viewList:
                view.delete()
            for index in indexList:
                index.delete()
            for layout in layoutList:
                layout.delete()
