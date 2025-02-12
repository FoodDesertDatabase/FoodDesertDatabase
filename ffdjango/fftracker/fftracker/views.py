from django.dispatch.dispatcher import receiver
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout, get_user
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.urls import conf
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import Households, HhAllergies, Ingredients, Users, Recipes, MealPlans, Stations, PausedDates
from .serializers import HouseholdSerializer, AllergySerializer, HouseholdAllergySerializer, IngredientInvSerializer, UserSerializer, StationSerializer, StationListSerializer, PausedDatesSerializer
from .helperfuncs import execute_query
from django.db import connection

class UserView(ModelViewSet):
	queryset = Users.objects.all()
	serializer_class = UserSerializer

#class MainView(ModelViewSet):
 # 	queryset = Users.objects.all() 
  #  serializer_class = UserSerializer

class HouseholdsView(ModelViewSet):
	queryset = Households.objects.all()
	serializer_class = HouseholdSerializer

def households_query():
	with connection.cursor() as cursor:
		cursor.execute("SELECT hh_name, num_adult, num_child FROM households")
		data = cursor.fetchall()

		keys = ('hh_name', 'num_adult', 'num_child')
		result = []

		for row in data:
			result.append(dict(zip(keys, row)))

		return result

class HouseholdsWithAllergies(ModelViewSet):
	queryset = Households.objects.all()
	serializer_class = HouseholdAllergySerializer
     

	#def list(self, request):
		#queryset = Households.objects.all()
		#serializer = HouseholdAllergySerializer(queryset)
		#return Response(serializer.data)
	#def retrieve(self, request, pk):
		#queryset = ingredients_query("SELECT i.*, s.s_name FROM ingredients i INNER JOIN supplier s WHERE (i_id = %s) AND (i.isupplier_id = s.s_id OR i.pref_isupplier_id = s.s_id)"%(pk))
		#serializer = IngredientSerializer(queryset)
		#return Response(serializer.data)
	#def update(self, request, pk):
		#serializer = HouseholdAllergySerializer(request.data)
		#if serializer.is_valid():
			#serializer.save()
			#return Response(data=serializer.data, status=status.HTTP_200_OK)
		#return Response(status=status.HTTP_400_BAD_REQUEST)

def login_page(request):
  page = 'login'

  if request.method == "POST":
    user = authenticate(
      username = request.POST(['username']),
      password = request.POST(['password'])
    )

    if user is not None:
        login(request, user)
        messages.info(request, 'Successfully logged in')
        return redirect('home')
    else:
        messages.error(request, 'Username OR Password is incorrect')
        return redirect('login')

    context = {'page':page}
    return render(request, 'login_register.html', context)

def register_page(request):
  form = CustomUserCreationForm()

  if request.method == 'POST':
      form = CustomCreationForm(request.POST, request.FILES)
      if form.is_valid():
        user = form.save(commit=False)
        user.save()
        login(request, user)
        messages.success(request, 'User account was created!')
        return redirect('home')
      else:
          messages.error(request, 'An error has occurred during registration')
  page = 'register'
  context = {'page':page, 'form':form}
  return render(request, 'login_register.html', context)

def account_reset(request):
  page = 'reset'

  if request.method == "POST":
    user = authenticate(
      username = request.POST(['username']),
      email = request.POST(['email'])
    )

    if ( (get_user('username')=='username') & (get_user('email')=='email') ):
        reset(request, user)
        messages.info(request, 'Reset email sent.')
        return redirect('login')
    else:
        messages.error(request, 'Username OR Email is incorrect')
        return redirect('reset')

  context = {'page':page}
  return redirect('login')

def landing_page(request):
	#Links to other pages?
	#
	#
	#
	return redirect('login')

def logout_user(request):
    logout(request)
    messages.info(request, 'User was logged out!')
    return redirect('login')

def index(request):
  return HttpResponse("Hello! Welcome to Food Forward Tracker")

class StationView(ModelViewSet):
	queryset = Stations.objects.all()
	serializer_class = StationSerializer

class StationListView(ModelViewSet):
	queryset = Stations.objects.all()
	serializer_class = StationListSerializer

