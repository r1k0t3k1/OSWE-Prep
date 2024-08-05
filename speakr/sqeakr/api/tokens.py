import pickle
import pickletools
import base64
import json
from uuid import UUID

from .models import UserProfile
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist

EXPECTED_LENGTH = getattr(settings, 'PICKLE_EXPECTED_LENGTH', 100)
class Tokens():
    
    allowedOps = [3, None, 0, 'auth', 1, 'userid', 2, 4, 62]
    expected_length = EXPECTED_LENGTH
    guest_uuid = '00000000-0000-4000-8000-000000000000'

    @staticmethod
    def create_token(userProfile):
        data = {'auth':1,'userid':str(userProfile.userid) }
        p = pickle.dumps(data)
        return base64.b64encode(p).decode('utf-8')

    @staticmethod
    def create_guest_token():
        data = {'auth':0,'userid':Tokens.guest_uuid}
        p = pickle.dumps(data)
        return base64.b64encode(p).decode('utf-8')
    
    @staticmethod
    def is_guest_token(token):
        if Tokens.is_safe(token):
            _data = pickle.loads(base64.b64decode(token))
            if _data['userid'] == Tokens.guest_uuid:
                return True
        
        return False

    @staticmethod
    def validate_token(token):
        if Tokens.is_safe(token):
            data = pickle.loads(base64.b64decode(token))
            if 'userid' in data.keys():
                _userid = data['userid']
                try: 
                    _profile = UserProfile.objects.get(userid=_userid)
                    return _profile
                except ObjectDoesNotExist:
                    return None
            else:
                return None
        else:
            # log it?
            return None

    @staticmethod
    def is_safe(token):
        try:
            for p in pickletools.genops(base64.b64decode(token)):
                if not any(p[1] == op for op in Tokens.allowedOps):
                    if not Tokens.validate_uuid4(p[1]):
                        return False

            if ((Tokens.expected_length - 5) <=len(token) <= (Tokens.expected_length + 5)):
                return True
            else:
                return False
        except:
            # bad padding
            return False
            
    @staticmethod
    def validate_uuid4(uuid_string):
        try:
            val = UUID(uuid_string, version=4)
        except ValueError:
            return False
        return val.hex == uuid_string.replace('-', '')