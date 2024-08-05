from django.http import JsonResponse
from django.core import serializers
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from ..models import UserProfile 
from ..constants import TYPE_JSON, METHOD, MISSING_AUTH
from ..forms import UploadAvatarForm
from api.tokens import Tokens
import json
import os
import base64
import shutil
import hashlib 
import urllib.parse

TEMP_DIR = getattr(settings, 'UPLOAD_DIR', '/tmp/')
FINAL_DIR = getattr(settings, 'AVATAR_DIR', '/code/avatars/')

def get_avatars_for_username(request,username):
    """
    Endpoint for retrieving previously uploaded avatar images.
    """
    try:
        _u = username.replace("../","")
        _files = os.scandir(FINAL_DIR + _u)
        _file_list = [f.name for f in _files]

    except FileNotFoundError:
        _file_list = []    
    except NotADirectoryError:
        _file_list = []      

    return JsonResponse(status=200, data={'status':'ok','files':_file_list})


@csrf_exempt
def upload_avatar(request):
    """
    Endpoint for uploading user avatar images. 
    """
    if request.method == 'POST':
        if 'authtoken' in request.headers:
            _token = request.headers['authtoken']
            _profile = Tokens.validate_token(_token)

            if None != _profile:
                form = UploadAvatarForm(request.POST, request.FILES)
                if form.is_valid:
                    # handle stuff
                    _filename = urllib.parse.unquote(request.FILES['file'].name)

                    _tmp = base64.urlsafe_b64encode(_filename.encode('utf-8'))
                    handle_uploaded_file(file=request.FILES['file'], filename=_filename)
                    _link = '/profile/preview/%s' % _tmp.decode('utf-8')

                    return JsonResponse(status=201, data={'status':'ok', 'message':'file uploaded', 'link':_link, 'token': _tmp.decode('utf-8')})
                else:
                    return JsonResponse(status=403, data={'status':'error', 'message':'Invalid credentials'})

        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
    else:
        return JsonResponse(status=405, data={'status':'error','message':METHOD})

def preview_avatar(request, img):
    """
    Endpoint for previewing user avatar images. 
    """
    try:
        _filename = base64.urlsafe_b64decode(img).decode('utf-8')
        image_data = get_uploaded_file(img)
    except FileNotFoundError as fnfe:
        return JsonResponse(status=404, data={'status':'error','message':'File not found'})
    except:
        return JsonResponse(status=400, data={'status':'error','message':'Invalid format. Expected base64 encoded value.'})
    
    _type = _filename.rpartition('.')[-1]
    
    if _type == 'jpg':
        _type = 'jpeg'
    
    image = "data:image/%s;base64, %s" % (_type, image_data)
    
    return JsonResponse(status=200, data={'image':image})


@csrf_exempt
def approve_avatar(request, img):
    """
    Given an 'img' tag, move it to /var/www/html/images (or wherever we decide)
    and delete it from /tmp
    """
    if request.method != 'POST':
        return JsonResponse(status=405, data={'status':'error','message':METHOD})

    if 'authtoken' not in request.headers:
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH})
        
    _token = request.headers['authtoken']
    _profile = Tokens.validate_token(_token)
    
    if None != _profile:
        try:
            _filename = base64.urlsafe_b64decode(img).decode('utf-8')
            if os.path.isfile(TEMP_DIR+_filename):
                _ext = _filename.rpartition('.')[-1]
                _newname = hashlib.md5((str(_profile.id) + _filename).encode('utf-8')).hexdigest() + "." + _ext
                # make sure the user has a directory
                _dir = FINAL_DIR + _profile.username + "/"
                _dir = _dir.replace("../","")
                
                if not os.path.isdir(_dir):
                    os.mkdir(_dir)
                
                shutil.move(src=TEMP_DIR+_filename, dst=_dir+_newname)
                _profile.avatar = _profile.username + "/" + _newname
                _profile.save()
                return JsonResponse(status=200, data={'status':'ok', 'message':'avatar updated'})
            else:
                return JsonResponse(status=400, data={'status':'error','message':'invalid file'})
        except:
            return JsonResponse(status=400, data={'status':'error','message':'invalid file'})
    else:
        return JsonResponse(status=401, data={'status':'error','message':MISSING_AUTH}) 

def handle_uploaded_file(file, filename):
    """
    Given a file, write it to the temp directory
    """
    with open(TEMP_DIR+filename, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

def get_uploaded_file(filename):
    """
    Given a filename, retrieve it from the temp directory and return
    it b64 encoded
    """
    try:
        _filename = base64.urlsafe_b64decode(filename).decode('utf-8')
        with open(TEMP_DIR + _filename, 'rb') as image:
            image_data = image.read()
            base64_encoded_data = base64.b64encode(image_data)
            base64_message = base64_encoded_data.decode('utf-8')
            
        return base64_message
    except:
        return None
