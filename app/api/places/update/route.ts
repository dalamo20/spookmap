import db from "../../config/route";

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { placeId, newDetails } = req.body;
        await db.execute(
            'UPDATE user_places SET details = ? WHERE id = ?', [newDetails, placeId]
        );
        res.status(200).json({ success: true });
    } else {
        res.status(405).send({ message: 'Only PUT requests are allowed' });
    }
}