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
    folder = models.ForeignKey(DashboardFolderByUser, null=True)
