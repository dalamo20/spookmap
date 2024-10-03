import db from "@/app/api/config/route";

export async function POST(request: Request) {
    try {
        const { name, userId } = await request.json();
        
        const [result] = await db.execute(
            'INSERT INTO collections (name, user_id) VALUES (?, ?)',
            [name, userId]
        );

        return new Response(JSON.stringify({ success: true, collectionId: result.insertId }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
