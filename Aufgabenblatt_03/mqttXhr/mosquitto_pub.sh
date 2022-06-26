mosquitto_pub -h 141.22.102.163 -t 'cloud_datastream/0' -m '{
"ShipmentId":"500111111",
"Date":"2020-04-28T00:00:00.000Z",
"PLZ_From":"20000",
"PLZ_To":"30000",
"Weight":2000,
"Status":0,
"Last_Update":"2021-04-28T00:00:00.000Z"
}'