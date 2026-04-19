from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .forms import CustomUserCreationForm
from django.contrib.auth import login
from rest_framework.decorators import api_view
from rest_framework.response import Response
def signup(request):
    if request.method=='POST':
       form=CustomUserCreationForm(request.POST)
       if form.is_valid():
           user=form.save()
           login(request,user)
           return redirect('home')
       else:
           print(form.errors)
    else:
        form=CustomUserCreationForm()
    return render(request,'signup.html',{'form':form})

# Create your views here.
@api_view(['GET'])
def get_user(request):
    return Response({
        "username":request.user.username,
        "role":request.user.role

    })
