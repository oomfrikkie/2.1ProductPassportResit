"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const mariadb_1 = __importDefault(require("mariadb"));
const client = mqtt_1.default.connect(process.env.MQTT_URL || "mqtt://localhost:1883");
client.on("connect", () => {
    console.log("🟢 MQTT connected");
    client.subscribe("ssm/tracking/#");
});
const pool = mariadb_1.default.createPool({
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
        await conn.query("INSERT INTO events (product_id, type, raw_json) VALUES (?, ?, ?)", [data.id, data.type, JSON.stringify(data)]);
        conn.release();
        console.log("🟠 Event saved:", data.id);
        // UNS output
        const unsTopic = `uns/product/${data.id ?? "unknown"}`;
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
