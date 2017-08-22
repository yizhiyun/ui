from django.conf.urls import url
from . import views

app_name = 'dashboard'


urlpatterns = [
    url(r"^pallasdata2$", views.HomeView.as_view()),
    # url(r"^pallasdata2$", views.hello),
    url(r'^getAllData$', views.getAllData, name='getAllData'),
    url(r'^dashboardTableAdd$', views.dashboardTableAdd, name='dashboardTableAdd'),
    url(r'^dashboardFolderAdd$', views.dashboardFolderAdd, name='dashboardFolderAdd'),
    url(r'^RelevanceFolder$', views.RelevanceFolder, name='RelevanceFolder'),
    url(r'^changeViewName$', views.changeViewName, name='changeViewName'),
    url(r'^deleteFolder$', views.deleteFolder, name='deleteFolder'),
    url(r'^addNote$', views.addNote, name='addNote'),
    url(r'^setShow$', views.setShow, name='setShow'),
]
