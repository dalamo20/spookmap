import db from "@/app/api/config/route";

export async function POST(request: Request) {
    try {
        const { collectionId, placeId } = await request.json();

        // Remove location from collection
        await db.execute(
            'DELETE FROM collection_places WHERE collection_id = ? AND place_id = ?',
            [collectionId, placeId]
        );

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
