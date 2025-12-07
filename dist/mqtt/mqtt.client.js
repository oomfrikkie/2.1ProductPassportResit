"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMqttClient = createMqttClient;
const mqtt_1 = __importDefault(require("mqtt"));
function createMqttClient(brokerUrl) {
    const client = mqtt_1.default.connect(brokerUrl);
    client.on("connect", () => {
        console.log("🐻 MQTT connected:", brokerUrl);
    });
    client.on("error", (err) => {
        console.error("❌ MQTT error:", err);
    });
    client.on("message", (topic, msg) => {
        console.log(`📩 MQTT message <${topic}>: ${msg.toString()}`);
    });
    return client;
}
