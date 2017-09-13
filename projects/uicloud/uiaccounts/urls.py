from django.conf.urls import url
from . import views

# add an app_name to set the application namespace
app_name = 'uiaccounts'

urlpatterns = [
    url(r'^register/$', views.register, name='register'),
    url(r'^login/$', views.userLogin, name='userLogin'),
    url(r'^active_user/(?P<token>.+)$', views.active_user, name='active_user'),
    url(r'^logout/$', views.userLogout, name='userLogout'),
    url(r'^afterlogin/$', views.afterLogin, name='afterLogin'),
    url(r'^add/(?P<permission>.+)/$', views.addPermission, name='addPermission'),
    url(r'^remove/(?P<permission>.+)/$', views.removePermission, name='removePermission'),
    url(r'^loginproblem/$', views.loginproblem, name='loginproblem'),
    url(r'^getvertify/$', views.getvertify, name='getvertify'),
    url(r'^authcode/$', views.authcode, name='authcode'),
    url(r'^setpassword/$', views.setpassword, name='setpassword'),
]
