from django.conf.urls import url
from . import views


urlpatterns = [
    url(
        r'^cloudapi/v1/mergetables/check$',
        views.checkTableMapping,
        name='checkTableMapping'
    ),
    url(
        r'^cloudapi/v1/mergetables/generate$',
        views.generateNewTable,
        name='generateNewTable'
    )
]
