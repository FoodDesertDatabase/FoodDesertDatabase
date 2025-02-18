from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Households

class ProductReportView(APIView):

    def get(self, request):
        product = request.query_params.get('product', None)
        if not product:
            return Response({'error': 'Product must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        product_flag_map = {
            'ppMealKit': 'ppMealKit_flag',
            'childrenSnacks': 'childrenSnacks_flag',
            'foodBox': 'foodBox_flag',
            'rteMeal': 'rteMeal_flag'
        }

        if product not in product_flag_map:
            return Response({'error': 'Invalid product'}, status=status.HTTP_400_BAD_REQUEST)

        product_flag = product_flag_map[product]

        households = Households.objects.filter(**{product_flag: True, 'paused_flag': False})

        report_data = []
        total_servings = 0

        for household in households:
            adult_servings = household.num_adult or 0
            child_servings = (household.num_child_gt_6 or 0) + 0.5 * (household.num_child_lt_6 or 0)
            
            if product == 'childrenSnacks':
                total_household_servings = child_servings
            else:
                total_household_servings = adult_servings + child_servings

            report_data.append({
                'household_id': household.hh_id,
                'first_name': household.hh_first_name,
                'last_name': household.hh_last_name,
                'adult_servings': adult_servings,
                'child_servings': child_servings,
                'total_servings': total_household_servings
            })

            total_servings += total_household_servings

        return Response({
            'product': product,
            'total_servings': total_servings,
            'households': report_data
        })