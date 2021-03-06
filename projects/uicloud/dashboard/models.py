from django.db import models

# Create your models here.


class DashboardFolderByUser(models.Model):
    username = models.CharField(max_length=32)
    foldername = models.CharField(max_length=32)
    parentfoldername = models.CharField(max_length=32, null=True)


class DashboardViewByUser(models.Model):
    username = models.CharField(max_length=32)
    row = models.CharField(max_length=255)
    column = models.CharField(max_length=255)
    tablename = models.CharField(max_length=64)
    viewtype = models.CharField(max_length=255)
    viewname = models.CharField(max_length=32, null=True)
    folder = models.ForeignKey(DashboardFolderByUser, on_delete=models.CASCADE, null=True)
    note = models.CharField(max_length=255, null=True)
    show = models.BooleanField(default=True)
    isopen = models.BooleanField(default=True)
    calculation = models.CharField(max_length=255)
    status = models.CharField(max_length=255, null=True)
    viewstyle = models.CharField(max_length=255)
    customcalculate = models.CharField(max_length=255)
    sequential = models.CharField(max_length=255)
    handledatapost = models.CharField(max_length=255)
    drilldowndata = models.CharField(max_length=255)
    filterconditions = models.CharField(max_length=255)


class DashboardIndexByUser(models.Model):
    username = models.CharField(max_length=32)
    row = models.CharField(max_length=255)
    column = models.CharField(max_length=255)
    tablename = models.CharField(max_length=64)
    indextype = models.CharField(max_length=255)
    indexname = models.CharField(max_length=32)
    calculation = models.CharField(max_length=255)
    indexstyle = models.CharField(max_length=255)
    customcalculate = models.CharField(max_length=255)
    sequential = models.CharField(max_length=255)
    handledatapost = models.CharField(max_length=255)
    drilldowndata = models.CharField(max_length=255)
    filterconditions = models.CharField(max_length=255)


class Layout(models.Model):
    username = models.CharField(max_length=32)
    structure = models.CharField(max_length=255)
    tablename = models.CharField(max_length=255)
