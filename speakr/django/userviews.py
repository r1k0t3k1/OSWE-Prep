from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.http import FileResponse
from django.core import serializers
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from ..models import UserProfile 
from ..forms import UploadAvatarForm
from ..constants import TYPE_JSON, METHOD, MISSING_AUTH, SPECIAL_CHARS
from api.tokens import Tokens
import json
import pickle
import base64


TEMP_DIR = getattr(settings, 'UPLOAD_DIR', '/tmp/')
FINAL_DIR = getattr(settings, 'AVATAR_DIR', '/code/avatars/')
 #'/var/www/html/images/'

REGISTRATION_KEY = getattr(settings, 'REGISTRATION_KEY', 'supersecretvalue')

@csrf_exempt
def login(request):
    """
    Endpoint for login requests.
    """
    if request.method == 'POST':
        _username = ""
        _password = ""
        
        if request.content_type == TYPE_JSON:
            data = json.loads(request.body.decode('utf-8'))
            if 'username' in data.keys():
                _username = data['username']
            if 'password' in data.keys():
                _password = data['password']
        else:
            _username = request.POST.get('username')
            _password = request.POST.get('password')
        
        try:
            _profile = UserProfile.objects.get(username=_username, password=_password)
            _token = Tokens.create_token(userProfile=_profile)
            _response = JsonResponse({'status':'ok','username':_profile.username,'authtoken':_token})
            return _response
        except ObjectDoesNotExist:
            return JsonResponse(status=401, data={'status':'error','message':'Invalid username or password','authtoken':Tokens.create_guest_token()})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD,'authtoken':Tokens.create_guest_token()})


def profile(request):
    """  
    This endpoint retrieves profile information based on the 
    authtoken present on the request.
    """
    if 'authtoken' in request.headers:
        _token = request.headers['authtoken']
        _profile = Tokens.validate_token(_token)

        if None != _profile:
            return JsonResponse(_profile.json())
        else:
            if Tokens.is_guest_token(_token):
                return JsonResponse({'id':'','username':'guest',
                    'userid':'','firstname':'Guest','lastname':'Guest',
                    'bio':'just passing through', 'email':'',
                    'location':'parts unknown', 'avatar':'logo-team.jpg'
                })   
    
    return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})

def get_user_profile(request, username):
    """
    Endpoint for retrieving a given user profile based on a supplied
    user name.
    """
    if 'authtoken' in request.headers:
        _token = request.headers['authtoken']
        _profile = Tokens.validate_token(_token)

        if None != _profile or Tokens.is_guest_token(_token):
            try:
                _userprofile = UserProfile.objects.get(username=username)
                return JsonResponse(_userprofile.json())
            except ObjectDoesNotExist:
                return JsonResponse(status=404, data={'status':'error','message':'Invalid userid'})
    
    return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})


@csrf_exempt
def update_user_profile(request):
    """
    Endpoint for general purpose user profile updates. Does not handle
    password updates.
    """
    if request.method == 'PUT':
        if 'authtoken' in request.headers:
            _token = request.headers['authtoken']
            _profile = Tokens.validate_token(_token)

            if None != _profile:
                # check fields 
                dirty = False
                if request.content_type == TYPE_JSON:
                    data = json.loads(request.body.decode('utf-8'))
                    if 'firstname' in data.keys():
                        if _profile.firstname != data['firstname'].strip():
                            _profile.firstname  = data['firstname'].strip()
                            dirty = True
                    if 'lastname' in data.keys():
                        if _profile.lastname != data['lastname'].strip():
                            _profile.lastname = data['lastname'].strip()
                            dirty = True
                    if 'bio' in data.keys():
                        if _profile.bio != data['bio'].strip():
                            _profile.bio = data['bio'].strip()
                            dirty = True
                    if 'location' in data.keys():
                        if _profile.location != data['location'].strip():
                            _profile.location = data['location'].strip()
                            dirty = True
                    if 'email' in data.keys():
                        if _profile.email != data['email'].strip():
                            _profile.email = data['email'].strip()
                            dirty = True
                    if 'avatar' in data.keys():
                        if _profile.avatar != data['avatar'].strip():
                            _profile.avatar = data['avatar'].strip()
                            dirty = True
                else:
                    if 'firstname' in request.POST:
                        if _profile.firstname != request.POST.get('firstname').strip():
                            _profile.firstname  = request.POST.get('firstname').strip()
                            dirty = True
                    if 'lastname' in request.POST:
                        if _profile.lastname != request.POST.get('lastname').strip():
                            _profile.lastname = request.POST.get('lastname').strip()
                            dirty = True
                    if 'bio' in request.POST:
                        if _profile.bio != request.POST.get('bio').strip():
                            _profile.bio = request.POST.get('bio').strip()
                            dirty = True
                    if 'location' in request.POST:
                        if _profile.location != request.POST.get('location').strip():
                            _profile.location = request.POST.get('location').strip()
                            dirty = True
                    if 'email' in request.POST:
                        if _profile.email != request.POST.get('email').strip():
                            _profile.email = request.POST.get('email').strip()
                            dirty = True
                    if 'avatar' in request.POST:
                        if _profile.avatar != request.POST.get('avatar').strip():
                            _profile.avatar = request.POST.get('avatar').strip()
                            dirty = True

                if dirty:
                    _profile.save()
                    return JsonResponse(_profile.json())
                else:
                    return JsonResponse(status=204, data={'status':'ok','message':'No changes'})
        
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})

@csrf_exempt
def update_password(request):
    """
    Endpoint for updating a user's password. Password is omitted 
    from the general update_user_profile() function for security 
    purposes. We want to make sure the old password supplied matches 
    what's in the DB before making any update to it.
    """

    if request.method == 'POST':
        if 'authtoken' in request.headers:
            _token = request.headers['authtoken']
            _profile = Tokens.validate_token(_token)

            if None != _profile:
                _oldpass = ''
                _newpass = ''
                
                if request.content_type == TYPE_JSON:
                    data = json.loads(request.body.decode('utf-8'))

                    if 'old_password' in data.keys():
                        _oldpass = data['old_password'].strip()
                    if 'new_password' in data.keys():
                        _newpass = data['new_password'].strip()
                else:
                    if 'old_password' in request.POST:
                        _oldpass  = request.POST.get('old_password').strip()
                            
                    if 'new_password' in request.POST:
                        _newpass = request.POST.get('new_password').strip()
                    
                if '' != _oldpass and '' != _newpass and _profile.password == _oldpass:
                    _profile.password = _newpass
                    _profile.save()
                    return JsonResponse(_profile.json())
                else: 
                    return JsonResponse(status=403, data={'status':'error', 'message':'Invalid credentials'})
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})


@csrf_exempt
def profile_new(request):
    """
    Endpoint for user registration. Checks that the proper registration key
    is provided on the request before processing.
    """
    if request.method != 'POST':
        return JsonResponse(status=405, data={'status':'error','message':METHOD})

    # check for invite code
    _code = request.GET.get('registrationKey')

    if _code != REGISTRATION_KEY:
        return JsonResponse(status=401, data={'status':'error','message':'Invalid registration key value.'})

    # check fields 
    _fields = 0
    _user = UserProfile()
    if request.content_type == TYPE_JSON:
        data = json.loads(request.body.decode('utf-8'))
        if 'username' in data.keys():
            _user.username = data['username'].strip()
            _fields += 1
        if 'firstname' in data.keys():
            _user.firstname = data['firstname'].strip()
            _fields += 1
        if 'lastname' in data.keys():
            _user.lastname = data['lastname'].strip()
            _fields += 1
        if 'email' in data.keys():
            _user.email = data['email'].strip()
            _fields += 1
        if 'password' in data.keys():
            _user.password = data['password'].strip()
            _fields += 1
    else:
        if 'username' in request.POST:
            _user.username  = request.POST.get('username').strip()
            _fields += 1
        if 'firstname' in request.POST:
            _user.firstname  = request.POST.get('firstname').strip()
            _fields += 1
        if 'lastname' in request.POST:
            _user.lastname = request.POST.get('lastname').strip()
            _fields += 1
        if 'email' in request.POST:
            _user.email = request.POST.get('email').strip()
            _fields += 1
        if 'password' in request.POST:
            _user.password = request.POST.get('password').strip() 
            _fields += 1
       
    if _fields != 5 or _user.username == "" or _user.password == "" or _user.email == "":
        return JsonResponse(status=400, data={'status':'error','message':'Missing one or more required fields.'})

    if any(sc in _user.username for sc in SPECIAL_CHARS):
        return JsonResponse(status=400, data={'status':'error','message':'Illegal special character in username. No symbols allowed.'})
 
    _user.bio = 'New sqeakr'
    _user.location='parts unknown'
    _user.avatar='default.jpg'
    try:
        _user.save()
        return JsonResponse(status=204, data={'status':'ok','message':'user created'})
    except IntegrityError:
        return JsonResponse(status=400, data={'status':'error','message':'That username is taken. Please submit a different one.'})

