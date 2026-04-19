from django.urls import path
from .views import get_services,profile
urlpatterns=[
    path('services/',get_services),
    path('dashboard/',profile),
]
