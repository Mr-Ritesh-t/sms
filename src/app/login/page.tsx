
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { School } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the user is authenticated, redirect them to the dashboard.
    // This handles the case where a logged-in user tries to access the login page.
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnonymousLogin = async () => {
    setError(null);
    try {
      await signInAnonymously(auth);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // This loading check can cause issues during logout.
  // The useEffect above is sufficient to handle redirects for authenticated users.
  // if (isUserLoading || user) {
  //   return <div className="flex h-screen w-screen items-center justify-center"><p>Loading...</p></div>;
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
             <div className="text-center space-y-2">
                <div className="flex justify-center items-center gap-2.5 font-semibold text-2xl">
                    <div className="rounded-lg grid place-content-center size-9 text-primary bg-primary/10">
                        <School className="h-6 w-6" />
                    </div>
                    <span className="transition-opacity duration-200">School Management System</span>
                </div>
                <p className="text-muted-foreground">Welcome! Please sign in to continue.</p>
            </div>
            <Card>
                <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="secondary" onClick={handleSignUp} className="w-full">
                            Sign Up
                        </Button>
                    </div>
                </form>
                 <div className="mt-4 text-center text-sm">
                    Or continue with
                 </div>
                 <Button variant="outline" className="w-full mt-2" onClick={handleAnonymousLogin}>
                    Sign in Anonymously
                </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
