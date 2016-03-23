from django.conf.urls import url, include
from . import views

urlpatterns = [
    # all patterns preceeded by /strain_review
    # ex: /
    url(r'^$', views.strain_review_list, name='strain_review_list'),
    #piff app
    url(r'^index/$', views.index, name='index'),
    # ex: /review/5/
    url(r'^strain_review/(?P<review_id>[0-9]+)/$', views.strain_review_detail, name='strain_review_detail'),
    # ex: /wine/
    url(r'^strain/$', views.strain_list, name='strain_list'),
    # ex: /wine/5/
    url(r'^strain/(?P<strain_id>[0-9]+)/$', views.strain_detail, name='strain_detail'),
    url(r'^strain/(?P<strain_id>[0-9]+)/add_review/$', views.add_strain_review, name='add_strain_review'),
    url(r'^review/user/(?P<username>\w+)/$', views.user_review_list, name='user_review_list'),
    url(r'^review/user/$', views.user_review_list, name='user_review_list'),
]
