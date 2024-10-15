import db from "@/app/api/config/route";

export async function GET(request: Request, { params }: { params: { collectionId: string } }) {
  try {
    const { collectionId } = params;
    console.log("Fetching places for collectionId:", collectionId);

    // Get collection details for folder name
    const [collectionDetails]: any = await db.execute(
      `SELECT name FROM collections WHERE id = ?`,
      [collectionId]
    );

    if (collectionDetails.length === 0) {
      return new Response(JSON.stringify({ error: "Collection not found" }), { status: 404 });
    }

    // Select places in collection
    const [places]: any = await db.execute(
      `SELECT locations.id, locations.name, locations.latitude, locations.longitude, locations.description, locations.city, locations.state_abbrev
       FROM collection_places
       JOIN locations ON collection_places.place_id = locations.id
       WHERE collection_places.collection_id = ?`,
      [collectionId]
    );
    console.log("Fetched places and collectionDetails:", places, collectionDetails);

    return new Response(JSON.stringify({ places, collection: collectionDetails[0] }), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching places:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
