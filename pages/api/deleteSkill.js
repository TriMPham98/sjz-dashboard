import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Skill ID is required" });
    }

    const db = await openDb();

    await db.run("DELETE FROM skills WHERE id = ?", [id]);

    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({ error: "Failed to delete skill" });
  }
}
