from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import  JsonResponse

class HomeView(TemplateView):
    template_name = 'dashboard/dashboard.html'

import sqlite3


con = sqlite3.connect('dashboard/dashboard.db')
cur = con.cursor()
con.commit()

cur.execute("SELECT four FROM dashtemp WHERE id=18")

data = cur.fetchall();

cur.execute("PRAGMA table_info([dashtemp])")

data1 = cur.fetchall()
# weidu
cur.execute("SELECT three FROM dashtemp Limit 20")
# duliang
dimensionality = cur.fetchall()

cur.execute("SELECT three FROM dashtemp Limit 21,26;")

measure = cur.fetchall()

# zhibiao
cur.execute("SELECT three FROM dashtemp limit 27,57;")

index = cur.fetchall()
# canshu

cur.execute("SELECT two FROM dashtemp limit 10,45;")

parameter = cur.fetchall()

cur.execute("SELECT one FROM dashtemp")

ceshi1 = cur.fetchall()

cur.execute("SELECT two FROM dashtemp")

ceshi2 = cur.fetchall()

cur.execute("SELECT three FROM dashtemp")

ceshi3 = cur.fetchall()



# cur.execute("SELECT * FROM dashtemp")
#
# data2 = cur.fetchall()

def hello(request):
    context          = {}
    context['table_name'] = data
    return render(request, 'dashboard/dashboard.html', context)

def ajax_list(request):
    abc = {};
    abc['dimensionality'] = dimensionality;
    abc['measure'] = measure;
    abc['index'] = index;
    abc['parameter'] = parameter;
    abc['ceshi1'] = ceshi1;
    abc['ceshi2'] = ceshi2;
    abc['ceshi3'] = ceshi3;
    return JsonResponse(abc)


