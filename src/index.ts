import mqtt from "mqtt";
import mariadb from "mariadb";

// --------------------
// MQTT CLIENT
// --------------------
const client = mqtt.connect(process.env.MQTT_URL || "mqtt://localhost:1883");

client.on("connect", () => {
  console.log("🟢 MQTT connected");
  client.subscribe("ssm/tracking/#");
});

// --------------------
// MARIADB POOL
// --------------------
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST || "mariadb",
  user: process.env.MARIADB_USER || "root",
  password: process.env.MARIADB_PASSWORD || "admin",
  database: process.env.MARIADB_DB || "producttracking",
  connectionLimit: 10
});

// --------------------
// MESSAGE HANDLER
// --------------------
client.on("message", async (topic: string, payload: Buffer) => {
  try {
    const data = JSON.parse(payload.toString());
    console.log("📥 Incoming:", topic, data);

    // save to db
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO material_event (scanner_id, product_id, material_id, event_type)
       VALUES (?, ?, ?, 'Material Added')`,
      [
        data.scanner_id,
        data.product_id,
        data.material_id
      ]
    );
    conn.release();

    console.log("🟠 Event saved!");

    // UNS output
    const unsTopic = `uns/product/${data.product_id ?? "unknown"}`;
    client.publish(unsTopic, JSON.stringify({
      timestamp: Date.now(),
      ...data
    }));

    console.log("📤 UNS published:", unsTopic);

  } catch (err) {
    console.error("❌ JSON or DB error:", err);
  }
});
