from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Servings
from .serializers import ServingsSerializer
from django.db.models import Sum
from datetime import datetime

class ServingsReportView(APIView):
    def get(self, request):
        from_date = request.query_params.get('from')
        to_date = request.query_params.get('to')
        if from_date and to_date:
            from_date = datetime.strptime(from_date, '%Y-%m-%d')
            to_date = datetime.strptime(to_date, '%Y-%m-%d')
            total_servings = Servings.objects.filter(date__range=[from_date, to_date]).aggregate(Sum('total_servings'))
            return Response({'totalServings': total_servings['total_servings__sum']}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid date range'}, status=status.HTTP_400_BAD_REQUEST)
