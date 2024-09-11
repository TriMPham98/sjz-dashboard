import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./sjz-dashboard.sqlite", // Updated database name
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        grade INTEGER NOT NULL,
        main_instrument TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        role TEXT NOT NULL DEFAULT 'Student'
      )
    `);

    // Check if the 'role' column exists, if not, add it
    const columns = await db.all("PRAGMA table_info(users)");
    const roleColumnExists = columns.some((column) => column.name === "role");
    if (!roleColumnExists) {
      await db.exec(
        "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'Student'"
      );
    }
  }
  return db;
}

export { openDb };
