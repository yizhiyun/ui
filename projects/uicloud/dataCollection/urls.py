from django.conf.urls import url
from . import views
from .gxmHandleClass import panelFileHandle
#add an app_name to set the application namespace
app_name = 'dataCollection'

urlpatterns = [
    url(r"^pallasdata$",views.IndexView.as_view()),
    url(r"^connectDataBaseHandle$",views.connectDataBaseHandle),
    url(r"^tablesOfaDB$", views.showAllTablesOfaDabaBase),
    url(r"^tableFileds$", views.showTableFiledsOFaTable),
    url(r"^uploadFile$",panelFileHandle.upload),
    url(r"^detailTableData$",views.showTableDetailDataOfFileds)

]

