from django.urls import path
from . import views

urlpatterns = [
    path('', views.campaign_list, name='campaign-list'),
    path('<slug:slug>/', views.campaign_detail, name='campaign-detail'),
    path('<slug:slug>/click/', views.record_click, name='campaign-click'),
]
