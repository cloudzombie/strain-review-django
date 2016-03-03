from django.conf.urls import url, include
from . import views

urlpatterns = [
    # ex: /
    url(r'^$', views.strain_review_list, name='strain_review_list'),
    # ex: /review/5/
    url(r'^strain_review/(?P<strain_review_id>[0-9]+)/$', views.strain_review_detail, name='strain_review_detail'),
    # ex: /wine/
    url(r'^strain$', views.strain_list, name='strain_list'),
    # ex: /wine/5/
    url(r'^strain/(?P<strain_id>[0-9]+)/$', views.strain_detail, name='strain_detail'),
    url(r'^strain/(?P<strain_id>[0-9]+)/add_strain_review/$', views.add_strain_review, name='add_strain_review'),

]
