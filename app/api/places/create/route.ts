import db from "@/app/api/config/route";

export async function POST(request: Request) {
    try {
        const { userEmail, placeName, placeDescription, latitude, longitude } = await request.json();
        
        // Needed to trim some descriptions in Marker card
        const trimmedDescription = placeDescription.substring(0, 1000);

        // Checking if email is in users table
        const [userExists]: any = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [userEmail]
        );

        if (userExists.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
        }

        // Check if location is already in the locations table
        const [existingLocation]: any = await db.execute(
            'SELECT * FROM locations WHERE latitude = ? AND longitude = ?',
            [latitude, longitude]
        );

        let locationId;
        if (existingLocation.length > 0) {
            locationId = existingLocation[0].id; 
        } else {
            // Insert new location
            const [result]: any = await db.execute(
                'INSERT INTO locations (name, description, latitude, longitude) VALUES (?, ?, ?, ?)',
                [placeName, placeDescription, latitude, longitude]
            );
            locationId = result.insertId; 
        }

        console.log('Saving user place:', { userEmail, locationId });

        // Reference to user_places table
        await db.execute(
            'INSERT INTO user_places (user_email, place_id) VALUES (?, ?)', 
            [userEmail, locationId]
        );
        return new Response(JSON.stringify({ success: "Place saved successfully", id: locationId }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
