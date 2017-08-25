from django.db import models


class FileNameMap(models.Model):
    filename = models.CharField(max_length=255)
    idname = models.CharField(max_length=255, null=True)
