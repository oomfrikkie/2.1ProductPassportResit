import { Client as PgClient } from "pg";
import mariadb from "mariadb";

export async function createPostgresClient(url: string) {
  const client = new PgClient({ connectionString: url });
  await client.connect();
  console.log("🐻 Postgres connected");
  return client;
}

export async function createMariaClient(config: any) {
  const pool = mariadb.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db
  });

  const conn = await pool.getConnection();
  console.log("🐻 MariaDB connected");
  return conn;
}
