import { db } from '@/app/firebaseConfig';
import { collection, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();
    // console.log('Registration attempt:', { email, username });

    // Check if user already exists
    const userDocRef = doc(db, "users", email);
    const existingUserDoc = await getDoc(userDocRef);

    if (existingUserDoc.exists()) {
      console.error(`User with email ${email} already exists.`);
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(`Password hashed successfully for user: ${email}`);

    // Save new user to Firestore
    await setDoc(userDocRef, {
      email,
      username,
      password: hashedPassword,
      createdAt: serverTimestamp(),
    });

    console.log(`User created successfully with email: ${email}`);
    return new Response(JSON.stringify({ success: "User created successfully" }), { status: 201 });
  } catch (error: any) {
    console.error('Error in registration route:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
