from django.shortcuts import render
from django.http import JsonResponse
from .models import Households
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

class EbtView(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def get_people_by_ebt_day(self, request):
        day_number = request.query_params.get('day_number')
        if day_number is None:
            return Response({'error': 'day_number parameter is required'}, status=400)
        
        households = Households.objects.filter(ebt_refill_date=day_number)
        data = []
        for household in households:
            total_servings = (household.num_adult or 0) + (household.num_child_gt_6 or 0) + 0.5 * (household.num_child_lt_6 or 0)
            children_snack_servings = (household.num_child_gt_6 or 0) + 0.5 * (household.num_child_lt_6 or 0)
            data.append({
                'household_name': f"{household.hh_first_name} {household.hh_last_name}",
                'ebt_number': household.ebt,
                'refresh_day': household.ebt_refill_date,
                'ppMealKit_flag': household.ppMealKit_flag,
                'childrenSnacks_flag': household.childrenSnacks_flag,
                'foodBox_flag': household.foodBox_flag,
                'rteMeal_flag': household.rteMeal_flag,
                'total_servings': total_servings,
                'children_snack_servings': children_snack_servings
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def get_all_households_with_ebt(self, request):
        households = Households.objects.filter(ebt__isnull=False)
        data = []
        for household in households:
            total_servings = (household.num_adult or 0) + (household.num_child_gt_6 or 0) + 0.5 * (household.num_child_lt_6 or 0)
            children_snack_servings = (household.num_child_gt_6 or 0) + 0.5 * (household.num_child_lt_6 or 0)
            data.append({
                'household_name': f"{household.hh_first_name} {household.hh_last_name}",
                'ebt_number': household.ebt,
                'refresh_day': household.ebt_refill_date,
                'ppMealKit_flag': household.ppMealKit_flag,
                'childrenSnacks_flag': household.childrenSnacks_flag,
                'foodBox_flag': household.foodBox_flag,
                'rteMeal_flag': household.rteMeal_flag,
                'total_servings': total_servings,
                'children_snack_servings': children_snack_servings
            })
        return Response(data)