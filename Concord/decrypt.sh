curl http://concord:8001/api/v1/org/OffSec/project/ -H "Authorization: O+JMYwBsU797EKtlRQYu+Q"

curl -X POST http://concord:8001/api/v1/org/OffSec/project/ -H "Authorization: O+JMYwBsU797EKtlRQYu+Q" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"a5c43c58-a474-11eb-b4ab-0242ac120003\", \"acceptsRawPayload\": \"true\", \"rawPayloadMode\":\"EVERYONE\"}"

curl -X POST -F concord.yml=@test.yml -F org=OffSec -F project=AWAE http://concord:8001/api/v1/process -H "Authorization: O+JMYwBsU797EKtlRQYu+Q"
