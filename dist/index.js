"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const mariadb_1 = __importDefault(require("mariadb"));
// --------------------
// MQTT CLIENT
// --------------------
const client = mqtt_1.default.connect(process.env.MQTT_URL || "mqtt://localhost:1883");
client.on("connect", () => {
    console.log("🟢 MQTT connected");
    client.subscribe("ssm/tracking/#"); // listens to all scanner events
});
// --------------------
// MARIADB POOL
// --------------------
const pool = mariadb_1.default.createPool({
    host: process.env.MARIADB_HOST || "mariadb",
    user: process.env.MARIADB_USER || "root",
    password: process.env.MARIADB_PASSWORD || "admin",
    database: process.env.MARIADB_DB || "producttracking",
    connectionLimit: 10
});
// --------------------
// MESSAGE HANDLER
// --------------------
client.on("message", async (topic, payload) => {
    try {
        const data = JSON.parse(payload.toString());
        console.log("📥 Incoming:", topic, data);
        // INSERT event into material_event table
        const conn = await pool.getConnection();
        await conn.query(`INSERT INTO material_event (scanner_id, product_id, material_id, event_type)
       VALUES (?, ?, ?, 'Material Added')`, [
            data.scanner_id,
            data.product_id,
            data.material_id
        ]);
        conn.release();
        console.log("🟠 Event saved!");
        // Publish UNS event
        const unsTopic = `uns/product/${data.product_id ?? "unknown"}`;
        client.publish(unsTopic, JSON.stringify({
            timestamp: Date.now(),
            ...data
        }));
        console.log("📤 UNS published:", unsTopic);
    }
    catch (err) {
        console.error("❌ JSON or DB error:", err);
    }
});
