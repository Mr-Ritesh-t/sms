'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  // Create a user profile document in Firestore
  const createUserProfile = async (user: User, role: UserProfile['role']) => {
    const userProfileRef = doc(firestore, 'users', user.uid);
    const profile: UserProfile = {
      id: user.uid,
      role: role,
    };
    // We are assuming the first user to sign up is a teacher for demo purposes
    // In a real app, this would be handled by an admin panel
    if (role === 'teacher') {
        const teacherRef = doc(firestore, 'teachers', user.uid);
        await setDoc(teacherRef, { 
            id: user.uid,
            email: user.email,
            firstName: 'Demo',
            lastName: 'Teacher',
            department: 'General',
            office: 'N/A',
            phone: 'N/A',
            avatarUrl: `https://picsum.photos/seed/${user.uid}/100/100`
        });
        profile.teacherId = user.uid;
    }
    await setDoc(userProfileRef, profile);
  };

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
      // For this demo, we'll make the first user a 'teacher'
      // and subsequent users 'students'
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user, 'teacher'); // Make first user a teacher
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnonymousLogin = async () => {
    setError(null);
    try {
      const userCredential = await signInAnonymously(auth);
      // Anonymous users will have the 'student' role for this demo
      await createUserProfile(userCredential.user, 'student');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  if (isUserLoading || user) {
    return <div className="flex h-screen w-screen items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
             <div className="text-center space-y-2">
                <div className="flex justify-center items-center gap-2.5 font-semibold text-2xl">
                    <div className="rounded-lg grid place-content-center size-9 text-primary bg-primary/10">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="transition-opacity duration-200">CampusFlow</span>
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
