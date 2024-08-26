import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const db = await openDb();
    const { id } = req.query;
    try {
      await db.run("DELETE FROM users WHERE id = ?", id);
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
