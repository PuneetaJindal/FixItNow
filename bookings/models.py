from django.db import models
from django.conf import settings
from services.models import Service
class Booking(models.Model):
   STATUS_CHOICES= (
        ('pending','Pending'),
        ('assigned','Assigned'),
        ('in_progress','In Progress'),
        ('completed','Completed'),
    )
   user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
   service=models.ForeignKey(Service,on_delete=models.CASCADE)
   operator=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,blank=True,related_name='assigned_bookings')
   date=models.DateField()
   time=models.TimeField()
   status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
   created_at=models.DateTimeField(auto_now_add=True)
   updated_at=models.DateTimeField(auto_now=True)
   phone = models.CharField(max_length=15, blank=True, null=True)
   address = models.TextField(blank=True, null=True)
   def __str__(self):
      return f"{self.user.username}-{self.service.name}({self.status})"
# Create your models here.
