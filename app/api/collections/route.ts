import db from "@/app/api/config/route";

// This API route is to fetch collections by userId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userId');

    console.log('Fetching collections for userEmail:', userEmail);
    if (!userEmail) {
      console.error('Missing userEmail in request');
      return new Response(JSON.stringify({ error: "Missing userID" }), { status: 400 });
    }
    // Fetch collection by userID
    const [collections]: any = await db.execute(
      `SELECT id, name FROM collections WHERE user_email = ?`,
      [userEmail]
    );
    console.log('Fetched collections:', collections);
    return new Response(JSON.stringify({ collections }), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching collections:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
