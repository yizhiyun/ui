from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from django.utils import timezone

import datetime

# Create your models here.


class GlobalAppPermission(models.Model):

    class Meta:

        managed = False  # No database table creation or deletion operations \
                         # will be performed for this model. 
        #permissions = ( 
        #    ('view_polls', 'View Global polls app'),
        #    ('vendor_rigths', 'View Global polls app'),
        #)
        default_permissions = ('add', 'change', 'delete', 'view')

@python_2_unicode_compatible  # only if you need to support Python 2
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    
    class Meta:
        default_permissions = ('add', 'change', 'delete', 'view')
    
    def __str__(self):
        return "question_text:{0}, pub_date:{1}".format(self.question_text, self.pub_date)

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = 'Published recently?'

@python_2_unicode_compatible  # only if you need to support Python 2
class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return "choice_text:{0}, votes:{1}".format(self.choice_text, self.votes)

