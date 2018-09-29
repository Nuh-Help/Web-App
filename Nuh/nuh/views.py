from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from .models import *
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login as auth_login
from .user_info_class import User as UserHelpInfo
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.password_validation import validate_password, password_validators_help_texts


# Used to redirect to nuh/index from url defined in urls.py
def empty_start(request):
    return HttpResponseRedirect('nuh/index')


@ensure_csrf_cookie  # Ensures that csrf cookie is set on
# the visiting page, for protection against cross-site-request-forgery
# Updates location to the one at the moment in the database and returns appropriate message
def update_location(request):
    if request.method == 'POST' and request.is_ajax():
        info_object = Info.objects.get(id=request.user.id)
        info_object.latitude = request.POST['lat']
        info_object.save()
        info_object.longitude = request.POST['lng']
        info_object.save()
        return JsonResponse([{'message': 'Success!'}], safe=False)
    else:
        return JsonResponse([{'message': 'Failure!'}], safe=False)


# Login function that checks if the user with given username exists, it's password and logs it in
# returns appropriate message about success/failure
@ensure_csrf_cookie
def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        try:
            get_username = User.objects.get(username=username)
            if get_username.check_password(password):
                user = authenticate(username=username, password=password)
                if user is not None and user.is_active:
                    auth_login(request, user)
                    return HttpResponseRedirect('index')
            else:
                return render(request, 'nuh/index.html', {'response_message': 'Wrong password, please try again.'})
        except User.DoesNotExist:
            return render(request, 'nuh/index.html',
                          {'response_message': 'There is no user with that username, please, try again.'})
    else:
        return HttpResponseRedirect('index')


# Register function that will reformat the given input via POST method
# if username and email aren't in the database the user is being created
# with all it's instances of database models thereby enforcing user attributes not to be null/none
# authenticates the user and redirects to the index page
@ensure_csrf_cookie
def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        first_name = request.POST['first_name'][0].upper() + request.POST['first_name'][1:].lower()
        last_name = request.POST['last_name'][0].upper() + request.POST['last_name'][1:].lower()
        email = request.POST['email']
        password = request.POST['password']
        if User.objects.filter(username=username) or User.objects.filter(email=email):
            return render(request, 'nuh/index.html',
                          {'response_message': 'User with that username or email already exists, please try again.'})
        else:
            user = User.objects.create_user(username=username, email=email, password=password,
                                            first_name=first_name,
                                            last_name=last_name)
            user.save()
            gf = GiveFood(id=user.id)
            gf.save()

            ga = GiveAccommodation(id=user.id)
            ga.save()

            gc = GiveClothes(id=user.id)
            gc.save()

            gm = GiveMedicine(id=user.id)
            gm.save()

            nf = NeedFood(id=user.id)
            nf.save()

            na = NeedAccommodation(id=user.id)
            na.save()

            nc = NeedClothes(id=user.id)
            nc.save()

            nm = NeedMedicine(id=user.id)
            nm.save()

            gh = GiveHelp(id=user.id, food=gf, accommodation=ga, clothes=gc, medicine=gm, other=None)
            gh.save()
            gh.check_help()
            gh.save()

            nh = NeedHelp(id=user.id, food=nf, accommodation=na, clothes=nc, medicine=nm, other=None)
            nh.save()
            nh.check_help()
            nh.save()

            pointer_info = Info(id=user.id, need_help=nh, give_help=gh, latitude=0, longitude=0)
            pointer_info.save()

            user.pointer = pointer_info
            user.save()

            auth_user = authenticate(username=username, password=password)
            if auth_user is not None and user.is_active:
                auth_login(request, auth_user)
                return HttpResponseRedirect('index')
    else:
        return HttpResponseRedirect('index')


# Redirects to index
def start(request):
    return HttpResponseRedirect('index')


# Returns json response containing the coordinates and emails of users of the app, needing help
# Looks if there is anyone who needs help and returns their coordinates and email info
def get_all_need_help(request):
    array_coords = []
    array_info = []
    for giver in NeedHelp.objects.filter(does=True):
        array_coords += [Info.objects.get(id=giver.id).get_coordinates()]
        array_info += [User.objects.get(id=giver.id).get_email()]
    return JsonResponse([array_info, array_coords], safe=False)


# Returns json response containing the coordinates and emails of users of the app, offering help
def get_all_give_help(request):
    array_coords = []
    array_info = []
    for needs in GiveHelp.objects.filter(does=True):
        array_coords += [Info.objects.get(id=needs.id).get_coordinates()]
        array_info += [User.objects.get(id=needs.id).get_email()]
    return JsonResponse([array_coords, array_info], safe=False)


# Returns the coordinates, email and description of help that is needed, if there is any
def get_accommodation_need_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in NeedAccommodation.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_accommodation]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is needed, if there is any
def get_food_need_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in NeedFood.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_food]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is needed, if there is any
def get_clothes_need_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in NeedClothes.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_clothes]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is needed, if there is any
def get_medicine_need_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in NeedMedicine.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_medicine]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is needed, if there is any
def get_other_need_help(request):
    array_coords = []
    array_emails = []
    array_description = []
    for model_object in NeedHelp.objects.filter(does_other=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_emails += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.other]
    return JsonResponse([array_coords, array_emails, array_description], safe=False)


# Returns the coordinates, email and description of help that is being offered, if there is any
def get_accommodation_give_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in GiveAccommodation.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_accommodation]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is being offered, if there is any
def get_food_give_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in GiveFood.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_food]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is being offered, if there is any
def get_clothes_give_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in GiveClothes.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_clothes]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is being offered, if there is any
def get_medicine_give_help(request):
    array_coords = []
    array_info = []
    array_description = []
    for model_object in GiveMedicine.objects.filter(does=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_info += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.what_medicine]
    return JsonResponse([array_coords, array_info, array_description], safe=False)


# Returns the coordinates, email and description of help that is being offered, if there is any
def get_other_give_help(request):
    array_coords = []
    array_emails = []
    array_description = []
    for model_object in GiveHelp.objects.filter(does_other=True):
        array_coords += [Info.objects.get(id=model_object.id).get_coordinates()]
        array_emails += [User.objects.get(id=model_object.id).get_email()]
        array_description += [model_object.other]
    return JsonResponse([array_coords, array_emails, array_description], safe=False)


# Redirects to advices.html page
def advices(request):
    return render(request, 'nuh/advices.html')


# Redirects to index.html page
def index(request):
    return render(request, 'nuh/index.html')


# Redirects to user profile page if user is authenticated, redirected to index otherwise
@ensure_csrf_cookie
def user_profile(request):
    if request.user.is_authenticated:
        return render(request, 'nuh/myProfile.html')
    else:
        return HttpResponseRedirect('index')


# Saves changes made on the profile, overwrites the existing ones from the database
# Sets attributes does to true if the changes made on the myprofile page are '1' that is
# if the help is being offered/needed, the description of these help and
# saves the changes made to the objects in database
@ensure_csrf_cookie
def save_checkboxes(request):
    if request.is_ajax() and request.method == 'POST' and request.user.is_authenticated:
        r_id = request.user.id
        req = request.POST

        gf = GiveFood.objects.get(id=r_id)
        if req['does_gf'] is '1':
            gf.does = True
            gf.what_food = req['give_food']
        else:
            gf.does = False
        gf.save()

        ga = GiveAccommodation.objects.get(id=r_id)
        if req['does_ga'] is '1':
            ga.what_accommodation = req['give_accommodation']
            ga.does = True
        else:
            ga.does = False
        ga.save()

        gc = GiveClothes.objects.get(id=r_id)
        if req['does_gc'] is '1':
            gc.what_clothes = req['give_clothes']
            gc.does = True
        else:
            gc.does = False
        gc.save()

        gm = GiveMedicine.objects.get(id=r_id)
        if req['does_gm'] is '1':
            gm.what_medicine = req['give_medicine']
            gm.does = True
        else:
            gm.does = False
        gm.save()

        go = GiveHelp.objects.get(id=r_id)
        if req['does_go'] is '1':
            go.other = req['give_other']
            go.does_other = True
        else:
            go.does_other = False
        go.save()

        nf = NeedFood.objects.get(id=r_id)
        if req['does_nf'] is '1':
            nf.what_food = req['get_food']
            nf.does = True
        else:
            nf.does = False
        nf.save()

        na = NeedAccommodation.objects.get(id=r_id)
        if req['does_na'] is '1':
            na.what_accommodation = req['get_accommodation']
            na.does = True
        else:
            na.does = False
        na.save()

        nc = NeedClothes.objects.get(id=r_id)
        if req['does_nc'] is '1':
            nc.what_clothes = req['get_clothes']
            nc.does = True
        else:
            nc.does = False
        nc.save()

        nm = NeedMedicine.objects.get(id=r_id)
        if req['does_nm'] is '1':
            nm.what_medicine = req['get_medicine']
            nm.does = True
        else:
            nm.does = False
        nm.save()

        no = NeedHelp.objects.get(id=r_id)
        if req['does_no'] is '1':
            no.other = req['get_other']
            no.does_other = True
        else:
            no.does_other = False
        no.save()

        nh = NeedHelp.objects.get(id=r_id)
        nh.check_help()
        nh.save()

        gh = GiveHelp.objects.get(id=r_id)
        gh.check_help()
        gh.save()

        return JsonResponse([{'message': 'Success'}], safe=False)
    else:
        return JsonResponse([{'message': 'Failure'}], safe=False)


# Function that handles the password changing on the myprofile page and returning appropriate response
# Validates the password, sets the password and logs in the user with the new password
@ensure_csrf_cookie
def change_password(request):
    if request.user.is_authenticated and request.method == 'POST':
        n_user = User.objects.get(id=request.user.id)
        if n_user.check_password(request.POST['old_password']):
            try:
                if validate_password(request.POST['new_password']) is None:
                    n_user.set_password(request.POST['new_password'])
                    n_user.save()
                    auth_user = authenticate(username=request.user.username, password=request.POST['new_password'])
                    if auth_user and request.user.is_active:
                        auth_login(request, auth_user)
                        return JsonResponse([{'message': 'Successfully changed your password!'}], safe=False)
            except ValidationError:
                return JsonResponse(
                    [{'message': (str(password_validators_help_texts()).replace(",", "\n").rstrip("]")).strip("[")}],
                    safe=False)
    else:
        return JsonResponse([{'message': 'Your old password is wrong!'}], safe=False)


# Redirects authenticated user to status page, to the index otherwise
def status(request):
    if request.user.is_authenticated:
        return render(request, 'nuh/status.html')
    else:
        return HttpResponseRedirect('index')


# Redirects authenticated user to account settings page, to the index otherwise
def acc_settings(request):
    if request.user.is_authenticated:
        return render(request, 'nuh/account_settings.html')
    else:
        return HttpResponseRedirect('index')


# Function that returns the data of the user needed for the front-end operations in myprofile
# such as displaying username, first_name, returning info about the help user offered/needed
# with the description of them
def my_profile(request):
    if request.user.is_authenticated and request.is_ajax():
        help_info = UserHelpInfo(username=request.user.username).user_help_info()
        user_info = [{'username': request.user.username}, {'first_name': request.user.first_name},
                     {'last_name': request.user.last_name}, {'e_mail': request.user.email}]
        return JsonResponse(user_info + help_info, safe=False)
    else:
        return HttpResponseRedirect('login')
