import sqlite3
import argparse
import os

def create_connection(db_file_name):
    conn = None
    try:
        conn = sqlite3.connect(db_file_name)
    except Exception as e:
        print(e)
    return conn

def create_db(conn):
    create_content_table = """CREATE TABLE IF NOT EXISTS content(
        id integer PRIMARY KEY AUTOINCREMENT,
        location text NOT NULL,
        content blob
    );"""

    try:
        c = conn.cursor()
        c.execute(create_content_table)
    except Exception as e:
        print(e)

def insert_content(conn, location, content):
    insert_content = "INSERT INTO content VALUES (?,?,?);"

    try:
        c = conn.cursor()
        c.execute(insert_content, (None, location, content))
        conn.commit()
    except Exception as e:
        print(e)

def get_content(conn, location):
    get_content = "SELECT * FROM content WHERE location = ?;"

    try:
        c = conn.cursor()
        rows = []
        for row in c.execute(get_content, (location,)):
            rows.append(row[2])
        return rows
    except Exception as e:
        print(e)

def get_locations(conn):
    get_locations = "SELECT DISTINCT location FROM content;"
    
    try:
        c = conn.cursor()
        rows = []
        for row in c.execute(get_locations):
            rows.append(row)
        return rows
    except Exception as e:
        print(e)

if __name__ == "__main__":
    database = r"sqlite.db"

    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)

    group.add_argument("--create", "-c", help="Create database", action="store_true")
    group.add_argument("--insert", "-i", help="Insert content", action="store_true")
    group.add_argument("--get", "-g", help="Get content", action="store_true")
    group.add_argument("--getLocations", "-l", help="Get all locations", action="store_true")

    parser.add_argument("--location", "-L")
    parser.add_argument("--content", "-C")

    args = parser.parse_args()

    conn = create_connection(database)

    if (args.create):
        print("[+] Creating database.")
        create_db(conn)
    elif (args.insert):
        if (args.location is None and args.content is None):
            parser.error("--insert requires --location, --content.")
        else:
            print("[+] Inserting data.")
            insert_content(conn, args.location, args.content)
            conn.commit()
    elif (args.get):
        if (args.location is None):
            parser.error("--get requires --location.")
        else:
            print("[+] Getting content.")
            print(get_content(conn, args.location))
    elif (args.getLocations):
        print("[+] Getting all locations.")
        print(get_locations(conn))
