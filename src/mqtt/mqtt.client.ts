import mqtt from "mqtt";

/**
 * Creates and configures an MQTT client that:
 * - connects to the broker
 * - logs connection status
 * - logs errors
 * - logs ALL messages received (acts as a UNS listener if subscribed)
 *
 * @param brokerUrl Example: "mqtt://localhost:1883"
 * @returns configured mqtt.Client instance
 */
export function createMqttClient(brokerUrl: string) {
  const client = mqtt.connect(brokerUrl);

  client.on("connect", () => {
    console.log("🐻 MQTT connected:", brokerUrl);
  });

  client.on("error", (err) => {
    console.error("❌ MQTT error:", err.message);
  });

  client.on("reconnect", () => {
    console.log("🔄 MQTT reconnecting...");
  });

  client.on("close", () => {
    console.log("🔌 MQTT connection closed");
  });

  client.on("message", (topic: string, msg: Buffer) => {
    console.log(`📩 MQTT message <${topic}>: ${msg.toString()}`);
  });

  return client;
}
