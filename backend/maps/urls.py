from django.urls import path
from .views import add_location,solveVRPView,solveCVRPView,solveVRPTWView

urlpatterns = [
    path('add_location/', add_location, name='add_location'),
    path('solve_VRP/', solveVRPView, name='sove_VRP'),
    path('solve_CVRP/', solveCVRPView, name='sove_CVRP'),
    path('solve_VRPTW/', solveVRPTWView, name='sove_VRPTW'),
]