from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    conversion_rate = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'full_name', 'role', 'phone', 'leads_assigned',
                  'leads_converted', 'conversion_rate', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined', 'leads_assigned', 'leads_converted']


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
