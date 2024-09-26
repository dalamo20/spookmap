import db from "../config/route";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, placeId, placeName, placeDescription } = req.body;

        const [result] = await db.execute(
            'INSERT INTO user_places (user_id, place_id, place_name, place_description) VALUES (?, ?, ?, ?)', 
            [userId, placeId, placeName, placeDescription]
        );

        res.status(200).json({ success: true, id: userId });
    } else {
        res.status(405).send({ message: 'Only POST requests are allowed' });
    }
}
