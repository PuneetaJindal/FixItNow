"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from services.views import home, bookings_page,profile
from django.contrib.auth import views as auth_views
from users.views import signup
from bookings.views import pending_bookings
urlpatterns = [
    path('signup/',signup,name='signup'),
    path('login/',auth_views.LoginView.as_view(template_name='login.html',next_page='home'),name='login'),
    path('logout/',auth_views.LogoutView.as_view(),name='logout'),
    path('',home,name='home'),
    path('admin/', admin.site.urls),
    path('api/',include('services.urls')),
    path('api/',include('bookings.urls')),
    path('bookings/',bookings_page),
    path('api/',include('users.urls')),
    path('services/',home),
    path('pending_bookings/', pending_bookings),
    path('profile/', profile,name='profile'),
]
