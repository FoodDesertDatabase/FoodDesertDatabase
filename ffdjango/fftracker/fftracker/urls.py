"""fftracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from django.urls import path, include
from .models import (Households, Ingredients, Packaging, MealPlans, Recipes)
from rest_framework import routers

from .MealRecipeViews import *
from .AccountCreationViews import AccountCreateView
from .CalculationsView import CalculationsView
from .CostTotalView import IngCostTotalView, PackCostTotalView
from .HouseholdViews import HouseholdsView, HouseholdsWithAllergies
from .IngredientViews import IngredientInvView
from .IngPurchaseViews import IPLView #MealView, IPSnacksView
from .MenuView import MenuView
from .MealPlanViews import MealPlansView
from .MealPlanReportViews import MealPlanReportView, MealHistoryReportView, SnackHistoryReportView
from .MealView import MealView
from .PackagingViews import PackagingInvView, PackagingDefView
from .PacPurchaseViews import PPLView
from .PackagingReturnViews import PackagingReturnView
from .RecipeListViews import RecipeListView
from .ServingCalculationViews import ServingCalculationViews
from .StationViews import StationsView, StationInstructionsView
from .SupplierViews import SupplierView
from .UserView import UserAuth
from .UserView import UserView
from .IngDefViews import IngNameView, IngUnitView
from .HistoricalDataViews import ProductSubscriptionHistoryView
from .IndividualClientViews import IndividualClientView
from .HouseholdIdView import HouseholdIdView
from .viewpauseddates import PausedDatesViewSet, HouseholdDateView 
from .ShowServingsReport import ServingsReportView

#admin.site.register(Households)
#admin.site.register(Ingredients)
#admin.site.register(Packaging)

router = routers.DefaultRouter()

# Report Views
router.register(r'households-report', HouseholdsView, basename='households-report')
router.register(r'ingredients-report', IngredientInvView, basename='ingredients-report')
router.register(r'packaging-report', PackagingInvView, basename='packaging-report')
router.register(r'ing-purchase-report', IPLView, basename='ing-purchase-report')
router.register(r'pack-purchase-report', PPLView, basename='pack-purchase-report')
router.register(r'mealplanreport', MealPlanReportView, basename='mealplanreport')
router.register(r'mealhistoryreport', MealHistoryReportView, basename='mealhistoryreport')
router.register(r'snackhistoryreport', SnackHistoryReportView, basename='snackhistoryreport')
router.register(r'packaging-return-report', PackagingReturnView, basename='packaging-return-report')
router.register(r'station-instructions', StationInstructionsView, basename='station-instructions')
router.register(r'individual-client', IndividualClientView, basename='individual-client')
router.register(r'paused-dates', HouseholdDateView, basename='paused-dates')
# Functional Views
router.register(r'serving-calculations', ServingCalculationViews, basename='serving-calculations')
router.register(r'calculations', CalculationsView, basename='calculations')
router.register(r'ing-costtotals', IngCostTotalView, basename='ing-costtotals')
router.register(r'pack-costtotals', PackCostTotalView, basename='pack-costtotals')
# Definition Views
router.register(r'ing-name-definitions', IngNameView)
router.register(r'ing-unit-definitions', IngUnitView)
# Inventory Views
router.register(r'ingredient-inventory', IngredientInvView, basename='ingredient-inventory')
router.register(r'packaging', PackagingInvView, basename='packaging')
router.register(r'packaging-inventory', PackagingInvView, basename='packaging-inventory')
router.register(r'packaging-type-definitions', PackagingDefView, basename='packaging-defs')
# Client/User Views
router.register(r'households', HouseholdsWithAllergies, basename='households')
router.register(r'datelist', PausedDatesViewSet, basename = 'datelist')  

router.register(r'household-date', HouseholdDateView, basename='household-date')
router.register(r'users', UserView, basename='users')
router.register(r'user-auth', UserAuth, basename='user-auth')
router.register(r'create-account', AccountCreateView, basename='create-account')
# Meal Views
router.register(r'menu', MenuView, basename='menu')
router.register(r'meal', MealView, basename='meals-list')
router.register(r'mealplans', MealPlansView, basename='mealplans')
router.register(r'mealrecipes', RecipeView, basename='mealrecipes')
router.register(r'mealrecipe-image', RecipeImageView, basename='mealrecipe-image')
router.register(r'mealrecipe-card', RecipeCardView, basename='mealrecipe-card')
router.register(r'mealrecipe-ingredients', RecipeIngredientsView, basename='mealrecipe-ingredients')
router.register(r'mealrecipe-packaging', RecipePackagingView, basename='mealrecipe-packaging')
router.register(r'mealrecipe-diets', RecipeDietsView, basename='mealrecipe-diets')
router.register(r'mealrecipe-instructions', RecipeInstructionsView, basename='mealrecipe-instructions')
router.register(r'recipe-list', RecipeListView, basename='recipe-list')
router.register(r'stations', StationsView, basename='stations')
router.register(r'suppliers', SupplierView, basename='suppliers')
router.register(r'tempimageupload', TempImageUploadView, basename='tempimageupload')
router.register(r'tempcardupload', TempCardUploadView, basename='tempcardupload')
router.register(r'product-subscription-history', ProductSubscriptionHistoryView, basename='product-subscription-history')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/create-account', AccountCreateView.as_view({'get': 'retrieve'})),
    path('api/get-ing-costtotals', IngCostTotalView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-pack-costtotals', PackCostTotalView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/update-household/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve', 'patch': 'update'})),
    path('api/get-households', HouseholdsView.as_view({'get': 'list', 'post': 'create'})),
    path('api/get-households/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve'})),
    path('api/get-ingredient', IngredientInvView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-ing-purchase-report', IPLView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-packaging', PackagingInvView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-pack-purchase-report', PPLView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-users', UserView.as_view({'get': 'retrieve'})),
    path('api/get-menu', MenuView.as_view({'get': 'retrieve'})),
    path('api/get-meals', MealView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-mealplans', MealPlansView.as_view({'get': 'retrieve'})),
    path('api/get-mealrecipes', RecipeView.as_view({'get': 'retrieve'})),
    path('api/get-stations', StationsView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/household-id/', HouseholdIdView.as_view(), name='household-id'),
    path('api/household/<str:pk>/delete_all_dates/', HouseholdDateView.as_view({'delete': 'delete_all_dates'})),
    path('api/servings', ServingsReportView.as_view(), name='servings-report'),
]
