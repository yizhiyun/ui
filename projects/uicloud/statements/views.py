from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import  JsonResponse



class HomeView(TemplateView):
    template_name = 'statements/statements.html'


