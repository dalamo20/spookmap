import db from "@/app/api/config/route";

export async function GET(request: Request, { params }: { params: { collectionId: string } }) {
  try {
    const { collectionId } = params;
    console.log("Fetching places for collectionId:", collectionId);

    // Select places in collection
    const [places]: any = await db.execute(
      `SELECT locations.id, locations.name, locations.latitude, locations.longitude, locations.description, locations.city, locations.state_abbrev
       FROM collection_places
       JOIN locations ON collection_places.place_id = locations.id
       WHERE collection_places.collection_id = ?`,
      [collectionId]
    );
    console.log("Fetched places:", places);

    return new Response(JSON.stringify({ places }), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching places:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
