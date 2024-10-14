import db from "@/app/api/config/route";

export async function POST(request: Request) {
  try {
    const { collectionId, newName } = await request.json();

    if (!collectionId || !newName) {
      return new Response(JSON.stringify({ error: 'Missing collectionId or newName' }), { status: 400 });
    }

    const [result]: any = await db.execute(
      'UPDATE collections SET name = ? WHERE id = ?',
      [newName, collectionId]
    );

    if (result.affectedRows === 1) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      throw new Error('Failed to update collection');
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
