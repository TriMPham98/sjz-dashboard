import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const db = await openDb();

    const skills = await db.all(
      "SELECT * FROM skills WHERE user_id = ? ORDER BY date_learned DESC",
      [userId]
    );

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error retrieving skills:", error);
    return res.status(500).json({ error: "Failed to retrieve skills" });
  }
}
