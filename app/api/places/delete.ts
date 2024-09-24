import db from "../mysql/route";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { placeId } = req.body;
        await db.execute('DELETE FROM user_places WHERE id = ?', [placeId]);
        res.status(200).json({ success: true });
    } else {
        res.status(405).send({ message: 'Only DELETE requests are allowed' });
    }
}