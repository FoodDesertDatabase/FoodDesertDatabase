from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import DietaryRestrictions
from .serializers import DietaryRestrictionsSerializer

class DietaryRestrictionsViewSet(viewsets.ModelViewSet):
    queryset = DietaryRestrictions.objects.all()
    serializer_class = DietaryRestrictionsSerializer

    def get_queryset(self):
        queryset = DietaryRestrictions.objects.all()
        household = self.request.query_params.get('household', None)
        if household is not None:
            queryset = queryset.filter(household=household)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        household_id = instance.household.hh_id
        self.perform_destroy(instance)
        
        # Check if this was the last restriction for this household
        remaining_restrictions = DietaryRestrictions.objects.filter(household_id=household_id).count()
        if remaining_restrictions == 0:
            # Update household's restriction_flag
            instance.household.restriction_flag = 0
            instance.household.save()
            
        return Response(status=status.HTTP_204_NO_CONTENT)