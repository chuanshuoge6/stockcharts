from django.urls import path
from . import views

urlpatterns = [
    path('tickers/', views.tickers, name='tickers'),
    path('about_yahoo_fin/', views.about_yahoo_fin, name='about_yahoo_fin'),
    path('analysts/', views.analysts, name='analysts'),
    path('balance/', views.balance, name='balance'),
    path('cash/', views.cash, name='cash'),
    path('holder/', views.holder, name='holder'),
    path('income/', views.income, name='income'),
    path('quote/', views.quote, name='quote'),
    path('stats/', views.stats, name='stats'),
    path('history/', views.history, name='history'),
    path('live/', views.live, name='live'),
]