from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Households, PausedDates
from .serializers import PausedDatesSerializer


class PausedDatesViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing PausedDates.
    Provides CRUD operations on paused dates.
    """
    queryset = PausedDates.objects.all()
    serializer_class = PausedDatesSerializer


class HouseholdDateView(viewsets.ViewSet):
    """
    ViewSet for managing paused dates specific to households.
    """

    def get_household(self, pk):
        """Utility function to fetch a household by primary key."""
        try:
            return Households.objects.get(pk=pk)
        except Households.DoesNotExist:
            return None

    @action(detail=True, methods=['get'])
    def paused_dates(self, request, pk=None):
        """
        Retrieve all paused dates for a specific household.
        """
        household = self.get_household(pk)
        if not household:
            return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch related paused dates
        paused_dates = PausedDates.objects.filter(hh_id=household)
        serialized_dates = PausedDatesSerializer(paused_dates, many=True).data

        # Construct response data
        response_data = {
            'household': {
                'id': household.hh_id,
                'name': f"{household.hh_first_name} {household.hh_last_name}",
                'children_servings': (household.num_child_lt_6 * 0.5) + household.num_child_gt_6,
                'adult_servings': household.num_adult,
            },
            'paused_dates': serialized_dates,
        }

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def delete_all_dates(self, request, pk=None):
        """
        Delete all paused dates associated with a specific household.
        """
        household = self.get_household(pk)
        if not household:
            return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)

        # Delete all related paused dates
        paused_dates = PausedDates.objects.filter(hh_id=household)
        if not paused_dates.exists():
            return Response({'error': 'No paused dates found for this household'}, status=status.HTTP_404_NOT_FOUND)

        deleted_count, _ = paused_dates.delete()

        # Update household status to active
        household.status = 'active'
        household.save()

        return Response(
            {'message': f'All paused dates deleted successfully ({deleted_count} records removed). Household status updated to active.'},
            status=status.HTTP_204_NO_CONTENT
        )
