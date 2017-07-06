from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
# Create your views here.
class IndexView(TemplateView):
    template_name = 'common/nav_base.html'

# 筛选器
def filterConditionAdd(req):
    if req.method == "POST":
        if req.POST["flag"] == "content-top":
            return render(req, "common/filter/content-top-scroll.html")
        elif req.POST["flag"] == "content-term":
            return  render(req,"common/filter/content-term-scroll.html")