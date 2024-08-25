import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await openDb();
    try {
      const users = await db.all("SELECT * FROM users");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
