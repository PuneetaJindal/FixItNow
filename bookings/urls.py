from django.urls import path
from .views import bookings_list_create,update_booking,operator_bookings,check_auth,pending_bookings
urlpatterns=[
    path('bookings/',bookings_list_create),
    path('bookings/<int:pk>/',update_booking),
    path('operator/bookings/',operator_bookings),
    path('check_auth/',check_auth),
    path('operator/pending/', pending_bookings),
]