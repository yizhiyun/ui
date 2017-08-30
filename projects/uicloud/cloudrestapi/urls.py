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
    url(
        r'^cloudapi/v1/customtables$',
        views.getAllTablesFromCustom,
        name='getAllTablesFromCustom'
    ),
    url(
        r'^cloudapi/v1/customtables/(?P<tableName>\w+)/(?P<modeName>\w+)$',
        views.getTableViaSparkCustom,
        name='getTableViaSparkCustom'
    ),
    url(
        r'^cloudapi/v1/ml/basicstats$',
        views.getBasicStats,
        name='getBasicStats'
    ),
    url(
        r'^cloudapi/v1/ml/hyptest$',
        views.getHypothesisTest,
        name='getHypothesisTest'
    ),
    url(
        r'^cloudapi/v1/uploadcsv$',
        views.uploadCsv,
        name='uploadCsv'
    ),
    url(
        r'^cloudapi/v1/uploadedcsvs$',
        views.getAllTempPairedTablesFromUser,
        name='getAllTempPairedTablesFromUser'
    ),
    url(
        r'^cloudapi/v1/uploadedcsv/(?P<fileName>\w+)/(?P<tableName>\w+)/(?P<modeName>\w+)$',
        views.getSpecUploadedTableViaSpark,
        name='getSpecUploadedTableViaSpark'
    ),
]
