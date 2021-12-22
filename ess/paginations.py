from rest_framework.pagination import PageNumberPagination


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 10000

    def paginate_queryset(self, queryset, request, view=None):
        if "no_page" in request.query_params:
            return None

        return super().paginate_queryset(queryset, request, view=view)
