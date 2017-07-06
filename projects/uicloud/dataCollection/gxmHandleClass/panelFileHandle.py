import django_excel as  excel
import pyexcel_io
# from django import forms
from django.http import HttpResponse,HttpResponseBadRequest
import json
from django.shortcuts import render
from ..gxmHandleClass.Singleton import Singleton
from ..DataModels.FileModel import FileModel
# class UploadFileForm(forms.Form):
#     file = forms.FileField()

try:
    from django.http import JsonResponse
except ImportError:
    from django.http import HttpResponse
    import json

    def JsonResponse(data):

        return HttpResponse(json.dumps(data),
                            content_type="application/json")

def upload(request):
    if(request.method == "POST"):
       return parse(request,"book_dict")

#  列处理
def columHandle(column_index,start_column,column_limit):
    # print(pyexcel_io.constants.TAKE_DATA(column_index))
    # print(column_index,start_column,column_limit)
    if (pyexcel_io.constants.TAKE_DATA == 0):
     return  pyexcel_io.constants.SKIP_DATA


def parse(request, data_struct_type):

    for f in request.FILES.getlist("file"):
        fileName = f.name
        data = f.get_book_dict(skipinitialspace=True,skip_empty_rows=True)
        
        sheets = {}
        for sheet in data:
            sheets[sheet] = data[sheet]
        afile = FileModel(fileName,sheets)
        Singleton().addPanelFile(afile)
    return render(request, "dataCollection/dataAnalysis.html", {"paltInfoList": Singleton().dataPaltForm})


