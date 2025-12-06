"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
const client = mqtt_1.default.connect(MQTT_URL);
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
    }
    catch (err) {
        console.error("❌ Invalid JSON:", err);
    }
});
