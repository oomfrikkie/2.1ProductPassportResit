import mqtt from "mqtt";
import mariadb from "mariadb";

const client = mqtt.connect(process.env.MQTT_URL || "mqtt://localhost:1883");

client.on("connect", () => {
  console.log("🟢 MQTT connected");
  client.subscribe("ssm/tracking/#");
});

const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST || "mariadb",
  user: process.env.MARIADB_USER || "root",
  password: process.env.MARIADB_PASSWORD || "admin",
  database: process.env.MARIADB_DB || "producttracking"
});

client.on("message", async (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());
    console.log("📥 Incoming:", topic, data);

    // save to db
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO events (product_id, type, raw_json) VALUES (?, ?, ?)",
      [data.id, data.type, JSON.stringify(data)]
    );
    conn.release();

    console.log("🟠 Event saved:", data.id);

    // UNS output
    const unsTopic = `uns/product/${data.id ?? "unknown"}`;
    client.publish(unsTopic, JSON.stringify({
      timestamp: Date.now(),
      ...data
    }));

    console.log("📤 UNS published:", unsTopic);

  } catch (err) {
    console.error("❌ JSON or DB error:", err);
  }
});
