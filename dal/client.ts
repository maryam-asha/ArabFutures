import env from "@lib/env";
import { DatabaseClient, createDatabaseClient } from "@waelhabbaldev/mysql2-dx";

declare global {
  var dbClient: DatabaseClient | undefined;
}

const createDbClient = () => {
  const client = createDatabaseClient({
    config: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    },
    verbose: process.env.NODE_ENV === "development",
  });
  console.log("[INFO] Database connection pool created successfully.");
  return client;
};

export const dbClient: DatabaseClient = globalThis.dbClient ?? (globalThis.dbClient = createDbClient());
