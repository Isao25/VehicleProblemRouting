from django.shortcuts import render
from django.http import JsonResponse
from .models import Location
from django.views.decorators.csrf import csrf_exempt
import json

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
