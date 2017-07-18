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
    ),
    url(
        r'^cloudapi/v1/tables$',
        views.getAllTablesFromUser,
        name='getAllTablesFromUser'
    ),
    url(
        r'^cloudapi/v1/tables/(?P<tableName>\w+)/(?P<modeName>\w+)$',
        views.getTableViaSpark,
        name='getTableViaSpark'
    ),
]
