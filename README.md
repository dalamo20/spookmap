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


## The Flow
![Welcome](https://github.com/user-attachments/assets/32a69b62-d7f9-4dbb-9add-41241c9af705)
![Sign in](https://github.com/user-attachments/assets/75f681a1-ec53-4ef7-b2d9-903e19003c09)
![Home](https://github.com/user-attachments/assets/109379b9-6856-4cae-a116-308550b13f29)
![Create an account](https://github.com/user-attachments/assets/f4f6d040-4b9b-42b4-9ef4-a8dac6661f49)
