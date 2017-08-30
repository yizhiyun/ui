from django.conf.urls import url
from . import views
from .gxmHandleClass import panelFileHandle
# add an app_name to set the application namespace
app_name = 'dataCollection'

urlpatterns = [
    url(r"^pallasdata$", views.IndexView.as_view()),
    url(r"^connectDataBaseHandle$", views.connectDataBaseHandle),
    url(r"^showAllDbOfPalt$", views.showAllDbOfPalt),
    url(r"^tablesOfaDB$", views.showAllTablesOfaDataBase),
    url(r"^tableFileds$", views.showTableFiledsOFaTable),
    url(r"^uploadFile$", panelFileHandle.upload),
    url(r"^detailTableData$", views.showTableDetailDataOfFileds),
    url(r"^filterTable/(?P<modeName>\w+)$", views.filterTable),
    url(r"^dataBuildView$", views.dataBuildView.as_view())
]
