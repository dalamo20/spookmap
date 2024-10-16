import db from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { name, userEmail } = await request.json();
        console.log('Creating new collection:', { name, userEmail });

        if (!name || !userEmail) {
            console.error('Missing name or userEmail');
            return new Response(JSON.stringify({ error: 'Missing name or userEmail' }), { status: 400 });
        }

        // This is a test query to test db connection
        const [testConnection] = await db.execute('SELECT 1');
        console.log('Database connection successful:', testConnection);
        
        const [result]: any = await db.execute(
            'INSERT INTO collections (name, user_email) VALUES (?, ?)',
            [name, userEmail]
        );
        console.log('Insert result:', result);
        return new Response(JSON.stringify({ success: true, collectionId: result.insertId }), { status: 201 });
    } catch (error: any) {
        console.error('Error creating collection:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
