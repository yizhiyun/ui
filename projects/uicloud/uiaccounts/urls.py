from django.conf.urls import url
from django.contrib.auth import views as auth_views

#add an app_name to set the application namespace
app_name = 'uiaccounts'

urlpatterns = [
    url(r'^login/$',
        auth_views.login,
        {'template_name': 'uiaccounts/login.html'},
        name='login'),
    url(r'^logout/$',
        auth_views.logout,
        {'template_name': 'uiaccounts/logged_out.html'},
        name='logout'),
    url(r'^password_change/$',
        auth_views.password_change,
        {'template_name': 'uiaccounts/password_change_form.html',
         'post_change_redirect': '/uiaccounts/password_change/done/'},
        name='password_change'),
    url(r'^password_change/done/$',
        auth_views.password_change_done,
        {'template_name': 'uiaccounts/password_change_done.html'},
        name='password_change_done'),
]
