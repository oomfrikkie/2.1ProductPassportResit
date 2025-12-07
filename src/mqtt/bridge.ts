import { MqttClient } from "mqtt";
import { Client as PgClient } from "pg";
import mariadb from "mariadb";

export function startBridge(
  mqttClient: MqttClient,
  pg: PgClient,
  maria: mariadb.Connection
) {
  const TRACKING_TOPIC = "tracking/product";

  mqttClient.subscribe(TRACKING_TOPIC, () => {
    console.log(`📡 Subscribed to ${TRACKING_TOPIC}`);
  });

  mqttClient.on("message", async (topic, msgBuffer) => {
    const msg = msgBuffer.toString();

    console.log("➡ Received:", msg);

    // Insert into Postgres
    try {
      await pg.query(
        "INSERT INTO product_events (event_data) VALUES ($1)",
        [msg]
      );
      console.log("🟦 Logged to Postgres");
    } catch (err) {
      console.error("❌ Postgres insert error:", err);
    }

    // Insert into MariaDB
    try {
      await maria.query(
        "INSERT INTO events (payload) VALUES (?)",
        [msg]
      );
      console.log("🟨 Logged to MariaDB");
    } catch (err) {
      console.error("❌ MariaDB insert error:", err);
    }
  });
}
