"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMqttClient = createMqttClient;
const mqtt_1 = __importDefault(require("mqtt"));
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
function createMqttClient(brokerUrl) {
    const client = mqtt_1.default.connect(brokerUrl);
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
    client.on("message", (topic, msg) => {
        console.log(`📩 MQTT message <${topic}>: ${msg.toString()}`);
    });
    return client;
}
