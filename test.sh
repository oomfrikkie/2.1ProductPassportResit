#!/bin/bash

# Detect the actual MQTT container name no matter the project folder
MQTT_CONTAINER=$(docker ps --format "{{.Names}}" | grep "_mqtt_1\|mqtt-1\|mqtt_1\|mqtt" | head -n 1)

if [ -z "$MQTT_CONTAINER" ]; then
  echo "❌ Could not find MQTT container. Make sure Docker is running and 'docker compose up -d' was executed."
  exit 1
fi

echo "🐳 Using MQTT container: $MQTT_CONTAINER"

TOTAL_SCANS=${1:-5}
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

    docker exec -i "$MQTT_CONTAINER" mosquitto_pub \
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
