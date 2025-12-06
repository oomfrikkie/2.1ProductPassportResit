import mqtt from "mqtt";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";

const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("🟢 MQTT connected");
  client.subscribe("ssm/tracking/#");
});

client.on("message", (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());
    console.log("📥 Incoming:", topic, data);

    const unsPayload = {
      timestamp: Date.now(),
      event: topic,
      ...data,
    };

    const unsTopic = `uns/product/${data.id ?? "unknown"}`;
    client.publish(unsTopic, JSON.stringify(unsPayload));
    console.log("📤 Published UNS:", unsTopic);

  } catch (err) {
    console.error("❌ Invalid JSON:", err);
  }
});
