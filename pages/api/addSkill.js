import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, skillName, dateLearnedStr } = req.body;

    if (!userId || !skillName || !dateLearnedStr) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = await openDb();

    await db.run(
      "INSERT INTO skills (user_id, skill_name, date_learned) VALUES (?, ?, ?)",
      [userId, skillName, dateLearnedStr]
    );

    return res.status(200).json({ message: "Skill added successfully" });
  } catch (error) {
    console.error("Error adding skill:", error);
    return res.status(500).json({ error: "Failed to add skill" });
  }
}
