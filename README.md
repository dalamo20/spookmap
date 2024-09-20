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
