from django.db import models

# Create your models here.


class Test(models.Model):

    class Meta:
        permissions = (
            ("pallasdata", "Can do something pallasdata"),
            ("dataBuildView", "Can do something dataBuildView"),
            ("pallasdata2", "Can do something pallasdata2"),
        )
