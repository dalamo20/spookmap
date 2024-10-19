# SpookMap
SpookMap is a web application designed for ghost hunters, paranormal enthusiasts, and curious travelers who want to explore haunted places across the United States. Users can browse through various haunted locations, save collections of places, and plan their spooky adventures with ease. The dataset powering SpookMap was compiled by Tim Renner using the Shadowlands Haunted Places Index and is shared on data.world.

## About
SpookMap allows users to:
- Browse Haunted Places: Discover haunted locations across the United States using Google Maps API integration.
- Create Collections: Organize favorite haunted places into custom collections for easy reference.
- Save and Remove Locations: Users can add haunted locations to their collections or remove them as needed.
- Google Authentication: Users can sign in with their Google account or manually create an account to manage their collections.
- Custom Authentication: In addition to Google sign-in, users can also log in via email and password.
SpookMap is ideal for those looking to explore the paranormal or simply for those intrigued by haunted locations, helping them create customized itineraries of haunted places to visit.

## Key Features
- Interactive Map: Use Google Maps API to explore and visually locate haunted places across the U.S.
- User Collections: Save favorite haunted places in a personalized collections to revisit later.
- Google Sign-In: Convenient login with Google, with automatic account creation for new users (https://authjs.dev/).
- Email Authentication: Allows users to register and log in using a custom email and password.
- Data-Driven: The haunted places dataset is sourced from Tim Renner using the Shadowlands Haunted Places Index, a publicly available and curated dataset from data.world.

## Technologies Used
- Next.js (v14.2.7)
- TypeScript
- React Hook Form
- SCSS for styling
- Google Maps API (via @googlemaps/js-api-loader and @react-google-maps/api)
- MySQL2 for the database layer
- Auth.js for authentication (with Google and custom credentials)
- JSON Web Tokens (JWT) for session management

## Setup Instructions
To set up SpookMap locally, follow the instructions below.

Prerequisites:
- Node.js (v16 or higher)
- MySQL (Ensure you have a MySQL database set up)
- Google Cloud Project (For Google authentication)

Installation:
- git clone https://github.com/dalamo20/spookmap.git
- cd spookmap
- npm install
- npm run dev

Set up the .env.local file at the root of your project

MySQL Database Config:
- MYSQL_HOST=your_mysql_host
- MYSQL_USER=your_mysql_user
- MYSQL_PASSWORD=your_mysql_password
- MYSQL_DATABASE=your_database_name

Google OAuth for NextAuth:
- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret

NextAuth:
- NEXTAUTH_SECRET=your_random_secret_key
- NEXTAUTH_URL=localhost_url

## DB Schema
<img width="585" alt="db1" src="https://github.com/user-attachments/assets/f6137c1a-6284-4d62-af71-8bcfad11fcf0">
<img width="629" alt="db2" src="https://github.com/user-attachments/assets/70084d0c-370c-46a9-9e0a-0f7feac013f0">



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## OAuth Google

<img width="693" alt="Screenshot 2024-09-05 at 11 02 46 PM" src="https://github.com/user-attachments/assets/2b4f23ad-882e-4c7f-aa95-493ab00cb323">

- Google OAuth Authentication: The user can sign in via Google using NextAuth's signIn() function with Google as the authentication provider configured in authOptions.ts.
- Session Management: The useSession() hook from NextAuth checks if a user is logged in and provides session data (e.g., name, image) to the Dashboard component.
- Conditional UI Rendering: If a user is authenticated, their details and a "Sign Out" button are displayed; otherwise, a "Sign in with Google" button is shown.

## Google Maps API

<img width="811" alt="Screenshot 2024-09-19 at 10 15 16 PM" src="https://github.com/user-attachments/assets/a01f1ea3-d7d3-47b0-bee0-777226c48ccb">

- Initialization of Google Maps: I'm using the @googlemaps/js-api-loader library to load the Google Maps API.
- A new Map object is created using the loaded API and attaches it to a div element which is centered in downtown Chicago.

- Google Places: Added this feature so that users can search locations.
- Marker: Searching a location causes the marker change places. It is restricted to the US only at the moment.
- InfoCard: The info card will serve as a content holder for more features such as location name, image, etc.

## MySQL Connection

<img width="748" alt="dbConnection" src="https://github.com/user-attachments/assets/17e29529-9fe3-438f-96a6-b5f885c38eba">
<img width="754" alt="dbSchemas" src="https://github.com/user-attachments/assets/a65d5527-3133-4703-bf64-fedc336f5f23">

- DB Config: Created a connection pool in the configv file and stored credentials securely in .env.local.
- Custom API Route: Custom route created for user registration and authentication using bcrypt to hash passwords.
- Schema: Schema for users (only for customized registrations & NOT GOOGLE oauth) & user_places (this will be used for map data).
