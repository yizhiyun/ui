from django.conf.urls import url
from . import views

#add an app_name to set the application namespace
app_name = 'dataCollection'

urlpatterns = [
    url(r"^pallasdata$",views.IndexView.as_view()),
    url(r"^pallasdata1$",views.Test.as_view()),
]

