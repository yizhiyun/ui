from django.shortcuts import render
from django.views.generic import TemplateView
# Create your views here.
class IndexView(TemplateView):
    template_name = 'dataCollection/dataConnectSelect.html'
class Test(TemplateView):
    template_name = 'dataCollection/dataSourceSelect.html'