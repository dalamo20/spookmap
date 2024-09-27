import db from "@/app/api/config/route";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Check if email already exists in db
        const [existingUsers]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user in db
        await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        return new Response(JSON.stringify({ success: "User created successfully" }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
