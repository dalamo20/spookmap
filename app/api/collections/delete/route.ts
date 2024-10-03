import db from "@/app/api/config/route";

export async function POST(request: Request) {
    try {
        const { collectionId } = await request.json();

        // Delete all locations in collection
        await db.execute('DELETE FROM collection_places WHERE collection_id = ?', [collectionId]);

        // Delete a single collection
        await db.execute('DELETE FROM collections WHERE id = ?', [collectionId]);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
