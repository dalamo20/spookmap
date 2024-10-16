import db from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { collectionId, placeId } = await request.json();

        if (!collectionId || !placeId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        console.log(`Adding place ${placeId} to collection ${collectionId}`);
        // Add location to collection
        await db.execute(
            'INSERT INTO collection_places (collection_id, place_id) VALUES (?, ?)',
            [parseInt(collectionId), parseInt(placeId)]
        );

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error: any) {
        console.error("Error saving place to collection:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
