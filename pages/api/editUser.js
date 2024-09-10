import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const db = await openDb();
    const { id, firstName, lastName, grade, mainInstrument, role } = req.body;
    try {
      await db.run(
        "UPDATE users SET first_name = ?, last_name = ?, grade = ?, main_instrument = ?, role = ? WHERE id = ?",
        [firstName, lastName, grade, mainInstrument, role, id]
      );
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
