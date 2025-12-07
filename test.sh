#!/bin/bash

TOTAL_SCANS=${1:-5}   # default = 5 scans

TOPIC="ssm/tracking/test"

echo "🔧 Starting scanner simulator..."
echo "📡 Topic: $TOPIC"
echo "⏱ Scan count: $TOTAL_SCANS"
echo

for ((i=1; i<=TOTAL_SCANS; i++))
do
    MESSAGE="{\"scanner_id\":1,\"product_id\":1,\"material_id\":$i}"

    echo "🔍 scan $i started"
    echo "📦 sending payload: $MESSAGE"

    docker exec -it productpassportresit-mqtt-1 mosquitto_pub \
        -t "$TOPIC" \
        -m "$MESSAGE"

    echo "✅ scan $i completed"
    
    if [ $i -lt $TOTAL_SCANS ]; then
        echo "⏳ waiting for next scan..."
        sleep 1
        echo
    fi
done

echo "🎉 All scans completed!"
