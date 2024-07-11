from django.http import JsonResponse
from .models import Location
from django.views.decorators.csrf import csrf_exempt
import json
from .apps import MapsConfig
from utils.VRP_functions import solve_CVRP, solve_VRP, solve_VRPTW

@csrf_exempt
def add_location(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        location = Location.objects.create(name=name, latitude=latitude, longitude=longitude)
        return JsonResponse({'message': 'Location added successfully', 'location_id': location.id})
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def solveVRPView(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        G = MapsConfig.graph  
        if G is not None:
            solver = solve_VRP(G,data)
            if solver:
                return JsonResponse({'routes': solver})
            else:
                return JsonResponse({'message': 'Failed to solve VRP problem'}, status=400)
        else:
            return JsonResponse({'error': 'Graph is not yet accesible. Try again later.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def solveCVRPView(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        G = MapsConfig.graph  
        if G is not None:
            solver = solve_CVRP(G,data)
            if solver:
                return JsonResponse({'routes': solver})
            else:
                return JsonResponse({'message': 'Failed to solve CVRP problem'}, status=400)
        else:
            return JsonResponse({'error': 'Graph is not yet accesible. Try again later.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def solveVRPTWView(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        G = MapsConfig.graph  
        if G is not None:
            solver = solve_VRPTW(G,data)
            if solver:
                return JsonResponse({'routes': solver})
            else:
                return JsonResponse({'message': 'Failed to solve VRPTW problem'}, status=400)
        else:
            return JsonResponse({'error': 'Graph is not yet accesible. Try again later.'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

