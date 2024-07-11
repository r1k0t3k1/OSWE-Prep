import jaydebeapi

username = "sa"
password = "manager99"
java_class = "org.hsqldb.jdbcDriver"
driver_path = "./hsqldb/hsqldb-2.7.3/hsqldb/lib/hsqldb.jar"
database = "jdbc:hsqldb:hsql://opencrx:9001/CRX"

conn = jaydebeapi.connect(java_class,database, [username, password], jars=driver_path)

cursor = conn.cursor()

cursor.execute("SELECT * FROM INFORMATION_SCHEMA.SYSTEM_USERS")
print(cursor.fetchall())

cursor.close()
conn.close()
