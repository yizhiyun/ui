# Register your models here.
from django.contrib import admin

from .models import Question,Choice

#admin.site.register(Question)
#class QuestionAdmin(admin.ModelAdmin):
#    fields = ['pub_date', 'question_text']
# split the form up into fieldsets
class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['question_text']}),
        ('Date information', {'fields': ['pub_date']}),
    ]
    # By default, Django displays the str() of each object. You can use the list_display admin option, 
    # which is a tuple of field names to display, as columns, on the change list page for the object:
    list_display = ('question_text', 'pub_date', 'was_published_recently')
    list_filter = ['pub_date']
    search_fields = ['question_text']
    
admin.site.register(Question, QuestionAdmin)

class ChoiceInline(admin.TabularInline):
    #...
    pass
admin.site.register(Choice)
