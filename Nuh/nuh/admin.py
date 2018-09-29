from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Registering custom user from .models and making it capable of being user admin
admin.site.register(User, UserAdmin)
