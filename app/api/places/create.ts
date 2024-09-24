import db from "../mysql/route";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, placeId } = req.body;
        const [result] = await db.execute(
            'INSERT INTO user_places (user_id, place_id) VALUES (?, ?)', [userId, placeId]
        );
        res.status(200).json({ success: true, id: result.insertId });
    } else {
        res.status(405).send({ message: 'Only POST requests are allowed' });
    }
}