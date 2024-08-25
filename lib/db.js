import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./groove_gamer.sqlite",
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        grade INTEGER NOT NULL,
        main_instrument TEXT NOT NULL,
        score INTEGER DEFAULT 0
      )
    `);
  }
  return db;
}

export { openDb };
