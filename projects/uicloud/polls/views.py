from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import loader
from django.shortcuts import render, get_object_or_404, render_to_response
from django.urls import reverse
from django.views import generic

from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.decorators import login_required, permission_required

from .models import Question, Choice
from django.db import connections

from django.utils.decorators import method_decorator
from django.views.generic.base import View
from django.views.decorators.clickjacking import xframe_options_sameorigin

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

"""
def index(request):
    
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    
    #output = '<br> '.join(["{0}:{1}".format(q.id,q.question_text) for q in latest_question_list])
    #output = "Just a test. You're at the polls index"
    
    context = {
        'latest_question_list': latest_question_list,
    }
    '''
    template = loader.get_template('polls/index.html')
    output = template.render(context,request)
    return HttpResponse(output)
    '''

    #Note that once we've done this in all these views, importing loader and HttpResponse is unnecessary.
    return render(request, 'polls/index.html', context)

def detail(request, question_id):
    #output = "You're looking at question {0}.".format(question_id)
    '''
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    '''
    question = get_object_or_404(Question, pk=question_id)

    #return HttpResponse(output) 
    return render(request, "polls/detail.html",{'question':question})

def results(request, question_id):
    question = get_object_or_404(Question,pk=question_id)

    #response = "The question:{0} <br>id:{1} <br>choice set:{2}".format(question, question_id, question.choice_set.all())
    #return HttpResponse(response)
    return render(request, 'polls/results.html', {'question': question})
"""


class IndexView(LoginRequiredMixin, PermissionRequiredMixin, generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    permission_required = ("polls.view_globalapppermission")

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by('-pub_date')[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'


class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'

@login_required
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
    #return HttpResponse("You're voting on question %s." % question_id)

class DbView(View):
    connDict = """{
    'mysql': {
        'ENGINE': 'django.db.backends.mysql',
        'host' : '192.168.1.36',
        'database': 'mysql',
        'user' : 'root',
        'password' : 'password',
        'port' : '3306',
        'default-character-set' : 'utf8'
    },
}"""

    @method_decorator(xframe_options_sameorigin)
    def dispatch(self, *args, **kwargs):
        return super(DbView, self).dispatch(*args, **kwargs)

    def get(self, request, *args, **kwargs):
        return render_to_response('polls/dbtest.html',
                                  {'schema': self.conn})

    def conn(self):
        conn = connections(self.connDict)
        logger.warn('LogTest {}'.format(conn))
        print(conn)
        return conn
