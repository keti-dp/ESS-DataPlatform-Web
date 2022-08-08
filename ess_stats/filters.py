from rest_framework.filters import BaseFilterBackend


class CustomDateFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        start_date = request.query_params.get("start-date")
        end_date = request.query_params.get("end-date")

        if start_date is not None and end_date is not None:
            return queryset.filter(date__gte=start_date, date__lt=end_date)
        elif start_date is not None:
            return queryset.filter(date__gte=start_date)
        elif end_date is not None:
            return queryset.filter(date__lt=end_date)
        else:
            return queryset
