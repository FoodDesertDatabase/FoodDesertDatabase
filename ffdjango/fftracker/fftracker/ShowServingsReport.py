from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.utils.dateparse import parse_date
from datetime import datetime
from .models import Households

class ServingsReportView(APIView):
    def get(self, request):
        from_date = request.query_params.get('from')
        to_date = request.query_params.get('to')

        if not from_date or not to_date:
            return Response({'error': 'Please provide both from and to dates.'}, status=status.HTTP_400_BAD_REQUEST)

        from_date = parse_date(from_date)
        to_date = parse_date(to_date)

        if not from_date or not to_date:
            return Response({'error': 'Invalid date format.'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate the number of weeks between the dates
        delta = to_date - from_date
        weeks = (delta.days // 7) + 1

        # Get total adults
        total_adults = Households.objects.aggregate(Sum('num_adult'))['num_adult__sum'] or 0

        # Get total children (grouped by age)
        total_children_data = Households.objects.aggregate(
            Sum('num_child_lt_6'),  # Children aged 0-6
            Sum('num_child_gt_6')   # Children aged 7-17
        )

        # Extract values (handle None cases)
        total_children_0_6 = total_children_data['num_child_lt_6__sum'] or 0
        total_children_7_17 = total_children_data['num_child_gt_6__sum'] or 0
        total_children = total_children_0_6 + total_children_7_17  # Total children

        # Compute total servings (adults + children/2) multiplied by the number of weeks
        total_servings = (total_adults + total_children_7_17 + total_children_0_6 / 2) * weeks

        return Response({
            'total_servings': round(total_servings, 2),
            'num_adult': total_adults,
            'num_child_0_6': total_children_0_6,
            'num_child_7_17': total_children_7_17,
            'total_children': total_children
        }, status=status.HTTP_200_OK)
