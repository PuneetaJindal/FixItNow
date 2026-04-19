from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Service
from .serializers import ServiceSerializer
from django.shortcuts import render
def bookings_page(request):
    return render(request,'bookings.html')
def home(request):
    return render(request,'index.html')
def profile(request):
    return render(request,'profile.html')
@api_view(['GET'])
def get_services(request):
    services=Service.objects.all()
    serializer=ServiceSerializer(services,many=True)
    return Response(serializer.data)