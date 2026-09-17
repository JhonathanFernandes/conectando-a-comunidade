import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required to run migrations");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1, connect_timeout: 10 });

try {
  await migrate(drizzle(client), { migrationsFolder: "./drizzle/pg" });
  console.log("PostgreSQL migrations completed");
} catch (error) {
  const secrets = [connectionString];
  try {
    const url = new URL(connectionString);
    secrets.push(decodeURIComponent(url.password));
  } catch {
    // The driver reports malformed connection strings below.
  }

  for (let current = error; current; current = current.cause) {
    const message = `${current.name || "Error"}${current.code ? ` (${current.code})` : ""}: ${current.message || String(current)}`;
    console.error(secrets.filter(Boolean).reduce((safe, secret) => safe.replaceAll(secret, "[redacted]"), message));
  }
  process.exitCode = 1;
} finally {
  await client.end();
}
