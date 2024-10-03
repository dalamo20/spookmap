import db from "@/app/api/config/route";

export async function POST(request: Request) {
    try {
        const { userId, placeName, placeDescription, latitude, longitude } = await request.json();
        // Check if location is in locations table
        const [existingLocation]: any = await db.execute(
            'SELECT * FROM locations WHERE latitude = ? AND longitude = ?',
            [latitude, longitude]
        );

        let locationId;
        if (existingLocation.length > 0) {
            locationId = existingLocation[0].id; // if exists, get id
        } else {
            // Insert new location
            const [result]: any = await db.execute(
                'INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)',
                [placeName, latitude, longitude]
            );
            locationId = result.insertId;
        }

        // Insert location into user_places table for reference
        await db.execute(
            'INSERT INTO user_places (user_id, place_id) VALUES (?, ?)', 
            [userId, locationId]
        );

        return new Response(JSON.stringify({ success: "Place saved successfully" }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}
