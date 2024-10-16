import db from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { collectionId } = await request.json();

        // Delete a single collection
        await db.execute('DELETE FROM collections WHERE id = ?', [collectionId]);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
