from rest_framework import viewsets
from rest_framework import serializers 
from .models import Households, HhAllergies
from rest_framework.response import Response
import logging
logging.basicConfig(level = logging.WARNING)

class AllergySerializer(serializers.ModelSerializer):       
    class Meta():
        model = HhAllergies
        fields = (['a_type'])

class HouseholdSerializer(serializers.ModelSerializer):
	class Meta():
		model = Households
		fields = ('__all__')

class HouseholdsView(viewsets.ModelViewSet):
	queryset = Households.objects.all()
	serializer_class = HouseholdSerializer

class HouseholdAllergySerializer(serializers.ModelSerializer):
    hh_allergies = AllergySerializer(many=True)
    class Meta():
        model = Households
        depth = 1
        fields = ('hh_id', 'hh_first_name', 'hh_last_name', 'num_adult', 'num_child_lt_6', 'num_child_gt_6', 'sms_flag',
                'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag', 'paying', 'phone', 'street', 'city',
                'pcode', 'state', 'delivery_notes', 'hh_allergies', 'hh_bags_or_crates', 'ppMealKit_flag', 
                'childrenSnacks_flag', 'foodBox_flag', 'rteMeal_flag', 'ebt', 'ebt_refill_date')

    def create(self, validated_data):
        allergy_data = validated_data.pop('hh_allergies')
        hh_model = Households.objects.create(**validated_data)
        for allergy in allergy_data:
            allergy['a_hh_id'] = hh_model
            allergy['hh_a_id'] = HhAllergies.objects.latest('hh_a_id').hh_a_id + 1
            allergy_model = HhAllergies.objects.create(**allergy)
        return hh_model
    def update(self, hh_instance, validated_data):
        # Create nested allergy objects
        allergy_data = validated_data.pop('hh_allergies')
        HhAllergies.objects.all().filter(a_hh_id = hh_instance).delete()
        for allergy in allergy_data:
            allergy['a_hh_id'] = hh_instance
            allergy['hh_a_id'] = HhAllergies.objects.latest('hh_a_id').hh_a_id + 1
            allergy_model = HhAllergies.objects.create(**allergy)
        logging.warning(hh_instance.hh_id)
        # If the primary key is changing, we need to delete the existing entry
        # before saving the new one
        # changing_pk = False
        # new_instance = None
        # if (hh_instance.hh_id != validated_data['hh_id']):
        #     changing_pk = True
        #     new_instance = Households.objects.create(**validated_data)
        # if changing_pk:
        #     hh_instance.delete()
        # for key, value in validated_data.items():
            # setattr(hh_instance, key, value)  
        return super().update(hh_instance, validated_data)

class HouseholdsWithAllergies(viewsets.ModelViewSet):
    queryset = Households.objects.all()
    serializer_class = HouseholdAllergySerializer