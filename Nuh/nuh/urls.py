from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views


# urlpatterns are used to call specific view function depending on the url visitor wants to go to
# path links the url to specific view while name can be later reused instead of hard_coding the url
# even tho that is not used in this project very much, at all actually
app_name = 'nuh'

# url paths
urlpatterns = [
    path('get_accommodation_need_help', views.get_accommodation_need_help),
    path('get_food_need_help', views.get_food_need_help),
    path('get_clothes_need_help', views.get_clothes_need_help),
    path('get_medicine_need_help', views.get_medicine_need_help),
    path('get_other_need_help', views.get_other_need_help),
    path('get_accommodation_give_help', views.get_accommodation_give_help),
    path('get_food_give_help', views.get_food_give_help),
    path('get_clothes_give_help', views.get_clothes_give_help),
    path('get_medicine_give_help', views.get_medicine_give_help),
    path('get_other_give_help', views.get_other_give_help),
    path('index', views.index, name='index'),
    path('myprofile', views.my_profile, name='myprofile'),
    path('account_settings', views.acc_settings, name='acc_settings'),
    path('user_profile', views.user_profile, name='user_profile'),
    path('status', views.status, name='status'),
    path('login', views.login),
    path('logout', LogoutView.as_view(template_name='nuh/index.html'),
         name='logout'),
    path('advices', views.advices, name='advices'),
    path('get_all_need_help', views.get_all_need_help, name='get_all_need_help'),
    path('get_all_give_help', views.get_all_give_help, name='get_all_give_help'),
    path('change_password', views.change_password),
    path('save_checkboxes', views.save_checkboxes, name='save_check_boxes'),
    path('register', views.register, name='register'),
    path('', views.start, name='start'),
    path('update_location', views.update_location),
]
