// Creates a dashboard admin, or resets the password of an existing one.
//
// Usage:  npm run create-admin -- <username> <password>
// (reads DB_* from .env; passwords are stored as bcrypt hashes, exactly as the sign-in flow expects)
//
// Credentials are passed on the command line on purpose, so no password ever lives in the repo or in seed.sql.
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: npm run create-admin -- <username> <password>");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
if (!DB_HOST || !DB_USER || !DB_DATABASE) {
  console.error("Missing DB_* settings. Run through `npm run create-admin` so .env is loaded.");
  process.exit(1);
}

const connection = await mysql.createConnection({ host: DB_HOST, port: Number(DB_PORT) || 3306, user: DB_USER, password: DB_PASSWORD, database: DB_DATABASE });

try {
  const passwordHash = await bcrypt.hash(password, 12);
  // Re-running for an existing user resets its password, re-enables it and bumps `version`,
  // which signs out every existing session of that user.
  const [result] = await connection.execute(
    "INSERT INTO users (username, passwordHash) VALUES (?, ?) ON DUPLICATE KEY UPDATE passwordHash = VALUES(passwordHash), isForbidden = 0, version = version + 1",
    [username, passwordHash],
  );
  console.log(result.affectedRows === 1 ? `Created admin "${username}".` : `Updated password for existing admin "${username}".`);
} finally {
  await connection.end();
}
