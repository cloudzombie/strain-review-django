from django.shortcuts import render_to_response
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
# from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Review, Strain
from .forms import ReviewForm
import datetime

# Create your views here.
def index(request):
    return render(request, 'strain_review/index.html')

def strain_review_list(request):
    latest_review_list = Review.objects.order_by('-pub_date')[:9]
    context = {'latest_review_list':latest_review_list}
    return render(request, 'strain_review/strain_review_list.html', context)

def strain_review_detail(request, review_id):
    review = get_object_or_404(Review, pk=review_id)
    return render(request, 'strain_review/strain_review_detail.html', {'review': review})

def strain_list(request):
    strain_list = Strain.objects.order_by('-name')
    context = {'strain_list':strain_list}
    return render(request, 'strain_review/strain_list.html', context)

def strain_detail(request, strain_id):
    strain = get_object_or_404(Strain, pk=strain_id)
    form = ReviewForm()
    return render(request, 'strain_review/strain_detail.html', {'strain': strain, 'form': form})

@login_required
def add_strain_review(request, strain_id):
    strain = get_object_or_404(Strain, pk=strain_id)
    form = ReviewForm(request.POST)
    if form.is_valid():
        rating = form.cleaned_data['rating']
        comment = form.cleaned_data['comment']
        # user_name = form.cleaned_data['user_name']
        user_name = request.user.username
        review = Review()
        review.strain = strain
        review.user_name = user_name
        review.rating = rating
        review.comment = comment
        review.pub_date = datetime.datetime.now()
        review.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('strain_review:strain_detail', args=(strain.id,)))

    return render(request, 'strain_review/strain_detail.html', {'strain': strain, 'form': form})

def user_review_list(request, username=None):
    if not username:
        username = request.user.username
    latest_review_list = Review.objects.filter(user_name=username).order_by('-pub_date')
    context = {'latest_review_list':latest_review_list, 'username':username}
    return render(request, 'strain_review/user_review_list.html', context)
