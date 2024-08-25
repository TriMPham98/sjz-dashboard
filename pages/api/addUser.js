import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await openDb();
    const { username } = req.body;
    try {
      await db.run("INSERT INTO users (username) VALUES (?)", username);
      res.status(200).json({ message: "User added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
