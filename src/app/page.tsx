import { redirect } from 'next/navigation';

// This is now a server component.
// It checks for the user on the server and redirects accordingly.
// For a fully server-side authentication check, you would use a library
// like next-auth or a server-side Firebase admin SDK setup.
// For now, we will just redirect to the dashboard as the main layout handles auth.

export default function Home() {
  // The root page's only job is to redirect to the correct starting point.
  // The /dashboard route is protected by the (main) layout, which will
  // handle the redirect to /login if the user is not authenticated.
  redirect('/dashboard');
}
