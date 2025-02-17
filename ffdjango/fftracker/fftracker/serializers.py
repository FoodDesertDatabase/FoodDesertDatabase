from collections import UserString
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Households, HhAllergies, PausedDates, Ingredients, Kits, MealPlans, Packaging, ProductSubscriptionHistory, Recipes, Users, MealPacks, RecipeAllergies, RecipeDiets, RecipeIngredients, RecipeInstructions, Servings

class AllergySerializer(ModelSerializer):
	class Meta():
		model = HhAllergies
		fields = ('__all__')
		depth = 1


class PausedDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PausedDates
        fields = ['paused_date_id', 'pause_start_date', 'pause_end_date', 'description', 'hh_id']



class UserSerializer(ModelSerializer):
	class Meta():
		model = Users
		fields = ('__all__')

class HouseholdSerializer(ModelSerializer):
	class Meta():
		model = Households
		fields = ('__all__')

class HouseholdAllergySerializer(ModelSerializer):
	hh_allergies = AllergySerializer(many=True)
	class Meta():
		model = Households
		fields = ('hh_name', 'num_adult', 'num_child_lt_6', 'num_child_gt_6', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag',' PausedDates', 'phone', 'street', 'city', 'pcode', 'state', 'delivery_notes', 'hh_allergies')




class IngredientInvSerializer(ModelSerializer):
	isupplier_name = serializers.CharField(max_length=200)
	pref_isupplier_name = serializers.CharField(max_length=200)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_name', 'pref_isupplier_name')

#class MainSerializer(ModelSerializer):
 # 	class Meta():
	#	model = Households
	#	fields = ('__all__')

class MealKitSerializer(ModelSerializer):
	class Meta():
		model = Kits
		fields = ('__all__')

class MealPacksSerializers(ModelSerializer):
	class Meta():
		model = MealPacks
		fields = ('__all__')

class MealPlansSerializer(ModelSerializer):
	class Meta():
		model = MealPlans
		fields = ('__all__')

class MenuSerializer(ModelSerializer):                                                                                          
	meal_name = serializers.CharField(max_length=200)
	snack_name = serializers.CharField(max_length=200)
	class Meta():
		model = MealPlans
		fields = ('m_id', 'm_date', 'meal_name', 'snack_name')

class PackagingSerializer(ModelSerializer):
	class Meta():
		model = Packaging
		fields = ('__all__')
		
class RecipeAllergySerializers(ModelSerializer):
	class Meta():
		model = RecipeAllergies
		fields = ('__all__')

class RecipeDietsSerializers(ModelSerializer):
	class Meta():
		model = RecipeDiets
		fields = ('__all__')

class RecipeIngredientsSerializers(ModelSerializer):
	class Meta():
		model = RecipeIngredients
		fields = ('__all__')

class RecipeInstructionsSerializers(ModelSerializer):
	class Meta():
		model = RecipeInstructions
		fields = ('__all__')

class RecipesSerializers(ModelSerializer):
	class Meta():
		model = Recipes
		fields = ('__all__')


class StationSerializer(ModelSerializer):
	class Meta():
		model = Households
		fields = ('__all__')

class StationListSerializer(ModelSerializer):
	hh_allergies = AllergySerializer(many=True)
	class Meta():
		model = Households
		fields = ('stn_name', 'num_servings', 'hh_allergies')

class ProductSubscriptionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSubscriptionHistory
        fields = '__all__'

class HouseholdReportSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    class Meta:
        model = Households
        fields = ['id', 'hh_first_name', 'hh_last_name', 'products', 'paused_flag' , 'children_under_6', 'children_over_6', 'adults']

class ViewPausedDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PausedDates
        fields = ['pause_start_date', 'pause_end_date', 'description']

class ServingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servings
        fields = ['date', 'total_servings']