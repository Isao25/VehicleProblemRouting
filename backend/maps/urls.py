from django.urls import path
from .views import add_location

urlpatterns = [
    path('add_location/', add_location, name='add_location'),
]