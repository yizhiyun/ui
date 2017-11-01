from django.conf.urls import url
from . import views
# add an app_name to set the application namespace
app_name = 'dataCollection'

urlpatterns = [
    url(r"^pallasdata$", views.IndexView),
    url(r"^connectDataBaseHandle$", views.connectDataBaseHandle),
    url(r"^showAllDbOfPalt$", views.showAllDbOfPalt),
    url(r"^tablesOfaDB$", views.showAllTablesOfaDataBase),
    url(r"^filterTable/(?P<modeName>\w+)$", views.filterTable),
    url(r"^deletePlat$", views.deletePlat),
    url(r"^dataBuildView$", views.dataBuildView),
    url(r"^deleteTempCol$", views.deleteTempCol),
    url(r"^judgeIcon$", views.judgeIcon),
]
