from django.conf.urls import url
from . import views
# add an app_name to set the application namespace
app_name = 'dataCollection'

urlpatterns = [
    url(r"^pallasdata$", views.IndexView.as_view()),
    url(r"^connectDataBaseHandle$", views.connectDataBaseHandle),
    url(r"^showAllDbOfPalt$", views.showAllDbOfPalt),
    url(r"^tablesOfaDB$", views.showAllTablesOfaDataBase),
    url(r"^showTableInfo/(?P<modeName>\w+)$", views.showTableInfo),
    url(r"^filterTable/(?P<modeName>\w+)$", views.filterTable),
    url(r"^dataBuildView$", views.dataBuildView.as_view())
]
