"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostgresClient = createPostgresClient;
exports.createMariaClient = createMariaClient;
const pg_1 = require("pg");
const mariadb_1 = __importDefault(require("mariadb"));
async function createPostgresClient(url) {
    const client = new pg_1.Client({ connectionString: url });
    await client.connect();
    console.log("🐻 Postgres connected");
    return client;
}
async function createMariaClient(config) {
    const pool = mariadb_1.default.createPool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db
    });
    const conn = await pool.getConnection();
    console.log("🐻 MariaDB connected");
    return conn;
}
