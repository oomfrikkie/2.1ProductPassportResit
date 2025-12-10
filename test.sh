#!/bin/bash

# Find the MQTT container name dynamically
MQTT_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i 'mqtt' | head -n 1)

if [ -z "$MQTT_CONTAINER" ]; then
    echo "❌ No MQTT container found. Make sure Docker is running and compose is up."
    exit 1
fi

echo "🐋 Using MQTT container: $MQTT_CONTAINER"

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

    docker exec "$MQTT_CONTAINER" mosquitto_pub \
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
