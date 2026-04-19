from rest_framework import serializers
from .models import Booking
class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True) 
    user_name = serializers.CharField(source='user.username', read_only=True)
    service_name=serializers.CharField(source='service.name',read_only=True)
    operator_name=serializers.CharField(source='operator.username',read_only=True)
    class Meta:
        model=Booking
        fields='__all__'
        

