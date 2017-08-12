from django.conf.urls import url
from . import views

app_name = 'statements'


urlpatterns = [
    url(r"^pallasdata3$", views.HomeView.as_view()),
]