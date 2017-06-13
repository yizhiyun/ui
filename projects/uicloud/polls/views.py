from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import loader
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views import generic

from .models import Question, Choice

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


class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by('-pub_date')[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'


class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'


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
