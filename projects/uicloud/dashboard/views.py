from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import  JsonResponse
from .importTestDataTmp import testDataHandler


class HomeView(TemplateView):
    template_name = 'dashboard/dashboard.html'

def hello(request):

    td = testDataHandler()
    context          = {}
    context['table_name'] = td.getAlldata()
    return render(request, 'dashboard/dashboard.html', context)

def ajax_list(request):
    td = testDataHandler()

    return JsonResponse(td.getAjaxList())


