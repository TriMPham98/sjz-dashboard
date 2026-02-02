import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./sjz-dashboard.sqlite",
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
        role TEXT NOT NULL DEFAULT 'Student',
        currently_practicing TEXT
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

    // Check if the 'currently_practicing' column exists, if not, add it
    const practicingColumnExists = columns.some(
      (column) => column.name === "currently_practicing"
    );
    if (!practicingColumnExists) {
      await db.exec("ALTER TABLE users ADD COLUMN currently_practicing TEXT");
    }

    // Check if the 'keysig_score' column exists, if not, add it
    const keysigColumnExists = columns.some(
      (column) => column.name === "keysig_score"
    );
    if (!keysigColumnExists) {
      await db.exec(
        "ALTER TABLE users ADD COLUMN keysig_score INTEGER DEFAULT 0"
      );
    }

    // Create skills table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        date_learned TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  }
  return db;
}

export { openDb };
