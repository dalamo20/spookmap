import db from "@/app/api/config/route";

export async function POST(request: Request) {
    try {
        const { collectionId, placeId } = await request.json();

        // Add location to collection
        await db.execute(
            'INSERT INTO collection_places (collection_id, place_id) VALUES (?, ?)',
            [collectionId, placeId]
        );

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
