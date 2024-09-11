import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id, score } = req.body;

  if (!id || !score) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await openDb();
    await db.run("UPDATE users SET score = ? WHERE id = ?", [score, id]);
    res.status(200).json({ message: "Score updated successfully" });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
