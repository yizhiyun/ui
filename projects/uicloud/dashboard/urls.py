from django.conf.urls import url
from . import views

app_name = 'dashboard'


urlpatterns = [
    # url(r"^pallasdata2$", views.HomeView.as_view()),
    url(r"^pallasdata2$", views.hello),
    url(r'^ajax-list$',views.ajax_list, name='ajax-list'),
]