from django.conf.urls import url
from . import views

app_name = 'dashboard'


urlpatterns = [
    url(r"^pallasdata2$", views.HomeView),
    url(r'^getAllData$', views.getAllData, name='getAllData'),
    url(r'^dashboardTableAdd$', views.dashboardTableAdd, name='dashboardTableAdd'),
    url(r'^dashboardFolderAdd$', views.dashboardFolderAdd, name='dashboardFolderAdd'),
    url(r'^RelevanceFolder$', views.RelevanceFolder, name='RelevanceFolder'),
    url(r'^changeName$', views.changeName, name='changeName'),
    url(r'^deleteFolder$', views.deleteFolder, name='deleteFolder'),
    url(r'^setSwitch$', views.setSwitch, name='setSwitch'),
    url(r'^indexAdd$', views.indexAdd, name='indexAdd'),
    url(r'^indexGet$', views.indexGet, name='indexGet'),
]
