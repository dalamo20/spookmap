import db from "../mysql/route";

export default async function handler(req, res) {
    const { userId } = req.query;
    const [rows] = await db.execute(
        'SELECT * FROM user_places WHERE user_id = ?', [userId]
    );
    res.status(200).json(rows);
}