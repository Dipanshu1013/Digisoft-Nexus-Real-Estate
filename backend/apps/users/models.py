"""DigiSoft Nexus — Custom User Model"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user model with role-based access."""

    class Role(models.TextChoices):
        SUPER_ADMIN = 'super_admin', 'Super Admin'
        MANAGER = 'manager', 'Manager'
        AGENT = 'agent', 'Agent'
        CLIENT = 'client', 'Client'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    leads_assigned = models.IntegerField(default=0)
    leads_converted = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_joined']
        verbose_name = 'User'

    @property
    def conversion_rate(self):
        if self.leads_assigned == 0:
            return 0
        return round((self.leads_converted / self.leads_assigned) * 100, 1)

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.username

    def __str__(self):
        return f'{self.full_name} ({self.role})'
