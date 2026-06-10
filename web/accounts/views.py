from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .permissions import IsOwner
from .serializers import CustomUserSeriealizer


class CustomUserRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = CustomUserSeriealizer

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True

        return super().update(request, *args, **kwargs)
