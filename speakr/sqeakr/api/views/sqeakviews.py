from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from ..models import Sqeak, UserProfile, Like 
from ..constants import NOSQEAK, METHOD, MISSING_AUTH
from api.tokens import Tokens
import pickle
import base64
import json


def get_sqeaks(request):
    """
    Endpoint for retrieving all sqeaks. Supports pagination via 'page'
    and 'count' parameters.
    """
    all_sqeaks = Sqeak.objects.all().order_by('-created_date')

    page = 0
    per_page = 25
    try:
        page = int(request.GET.get('page','0'))
        per_page = int(request.GET.get('count','25'))
    except:
        pass

    if None == all_sqeaks:
        return JsonResponse(status=404, data={'status':'error','message':NOSQEAK})
    else:
        start = page * per_page
        end = start + per_page

        if len(all_sqeaks) > end :
            sqlist = all_sqeaks[start:end]
        else:
            sqlist = all_sqeaks[start:len(all_sqeaks)]

        _userid = get_userprofile_id(request=request)

        data = [sqeak.json() for sqeak in sqlist]
        data = process_likes(data=data, userid=_userid)

        return JsonResponse(data, safe=False)
    

def get_sqeak(request, sqeak_id):
    """
    Endpoint for getting a single sqeak based on id value.
    """
    if request.method == 'GET':
        # do stuff
        try:
            _userid = get_userprofile_id(request=request)
            sqeak = Sqeak.objects.get(pk=sqeak_id)
            data = sqeak.json()
            
            if None != _userid:
                for l in data['likes']:
                    if l['id'] == _userid:
                        data['is_liked'] = True
            
            return JsonResponse(data, safe=False)
        except ObjectDoesNotExist:
            return JsonResponse(status=404, data={'status':'error','message':NOSQEAK})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})

def get_sqeaks_by_username(request, username):
    """
    Endpoint for retrieving all sqeaks for a given user. Supports
    pagination via 'page' and 'count' parameters.
    """
    if request.method == 'GET':
        # do stuff
        try:
            sqeaks = Sqeak.objects.filter(owner__username=username)
            sqeaks = sqeaks.order_by('-created_date')

            page = 0
            per_page = 25
            try:
                page = int(request.GET.get('page','0'))
                per_page = int(request.GET.get('count','25'))
            except:
                pass

            start = page * per_page
            end = start + per_page

            if len(sqeaks) > end :
                sqlist = sqeaks[start:end]
            else:
                sqlist = sqeaks[start:len(sqeaks)]

            data = [sqeak.json() for sqeak in sqlist]

            _userid = get_userprofile_id(request=request)
            data = process_likes(data=data, userid=_userid)

            return JsonResponse(data, safe=False)
        except ObjectDoesNotExist:
            return JsonResponse(status=404, data={'status':'error','message':NOSQEAK})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})
 


@csrf_exempt
def compose(request):
    """
    Endpoint for creating a new sqeak.
    """
    if request.method == 'POST':
        if 'authtoken' in request.headers:
            _token = request.headers['authtoken']
            _profile = Tokens.validate_token(_token)
            # make sure we have a real user and not a guest
            if None != _profile:
                _txt = ''
                # get the necessary data
                if request.content_type == 'application/json':
                    data = json.loads(request.body.decode('utf-8'))
                    if 'sqeak' in data.keys():
                        _txt = data['sqeak'].strip()
                else:
                    _txt = request.POST.get('sqeak').strip()

                if '' != _txt:
                    if len(_txt) > 256:
                        _txt = _txt[0:256]

                    s = Sqeak(sqeak_text=_txt,owner=_profile,created_date=timezone.now())
                    s.save()
                    res = JsonResponse(status=201, data={'status':'ok','message':'Sqeak created'})
                    # delete the draft cookie if it exists
                    res.delete_cookie('draft')

                    return res
        
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})

@csrf_exempt
def draft(request):
    """
    Endpoint for saving a draft sqeak. Sqeak is saved as a cookie.
    """
    if 'authtoken' in request.headers:
        _token = request.headers['authtoken']
        _profile = Tokens.validate_token(_token)
        # make sure we have a real user and not a guest
        if None != _profile:
            if request.method == 'GET':
                # convert draft pickle and return back the contents
                _c = request.COOKIES.get('draft')
                if None == _c:
                    return JsonResponse({})
                try:
                    _txt = pickle.loads(base64.b64decode(_c))
                    return JsonResponse({'status':'ok','sqeak':_txt})
                except:
                    return JsonResponse({})
            elif request.method == 'POST':
                # create draft pickle and return it 
                _txt = ''
                # get the necessary data
                if request.content_type == 'application/json':
                    data = json.loads(request.body.decode('utf-8'))
                    if 'sqeak' in data.keys():
                        _txt = data['sqeak'].strip()
                    else:
                        _txt = request.POST.get('sqeak').strip()
                    if '' != _txt:
                        _p = pickle.dumps({'draft':_txt.strip()})
                        _c = base64.b64encode(_p).decode('utf-8')
                        _res = JsonResponse(status=201, data={'status':'ok','message':'Draft sqeak created'})
                        _res.set_cookie('draft', _c, httponly=True)
                    return _res 
                else:
                    return JsonResponse(status=405, data={'status':'error','message':METHOD})
            else:
                return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
    else:
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})

@csrf_exempt
def like_sqeak(request, sqeak_id):
    """
    This function takes a sqeak_id and a userprofile_id. If a Like matching
    those values already exists, the active flag on it is flipped.
    If no matching Like is found, one is created and set as active.
    """
    if request.method == 'POST':
        # first, get the user
        if 'authtoken' in request.headers:
            _token = request.headers['authtoken']
            _profile = Tokens.validate_token(_token)
            # make sure we have a real user and not a guest
            if None != _profile:
               # if we have a valid user token, get the sqeak
                try:
                    sqeak = Sqeak.objects.get(pk=sqeak_id)
                    if None != sqeak:
                        # see if we have a like
                        try:
                            like = Like.objects.get(owner__id=_profile.id, sqeak__id=sqeak.id)
                            # if we do, togle active it
                            active = not like.active 
                            like.active = active
                            like.save()
                            message = 'Sqeak liked'
                            if active == False:
                                message = 'Sqeak unliked'
                            return JsonResponse(status=200, data={'status':'ok','message':message})
                        except ObjectDoesNotExist:
                            # if we don't have a Like, make one
                            like = Like()
                            like.owner = _profile
                            like.sqeak = sqeak
                            like.active = True
                            like.save()      
                            return JsonResponse(status=200, data={'status':'ok','message':'Sqeak liked'})
                    else:
                        return JsonResponse(status=404, data={'status':'error','message':NOSQEAK})
                except ObjectDoesNotExist:
                    return JsonResponse(status=404, data={'status':'error','message':NOSQEAK})
        
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})


def get_userprofile_id(request):
    """
    This function takes a request, checks it for an auth token,
    and returns the userProfile associated with the token (if any).
    """
    if 'authtoken' in request.headers:
        _token = request.headers['authtoken']
        _profile = Tokens.validate_token(_token)
        
        if None != _profile:
            return _profile.id
    
    return None

def process_likes(data, userid):
    """
    Given an array of json data (data), loop through it and mark 
    sqeaks as liked based on the provided userid
    """
    if None != userid:
        for d in data:
            for l in d['likes']:
                if l['id'] == userid:
                    d['is_liked'] = True
    
    return data