
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { School } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { UserRole } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isSigningUp, setIsSigningUp] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user profile document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        role: role,
      });

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

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2.5 font-semibold text-2xl">
            <div className="rounded-lg grid place-content-center size-9 text-primary bg-primary/10">
              <School className="h-6 w-6" />
            </div>
            <span>School Management System</span>
          </div>
          <p className="text-muted-foreground">Welcome! Please sign in or create an account.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{isSigningUp ? 'Create an Account' : 'Login'}</CardTitle>
            <CardDescription>
              {isSigningUp ? 'Enter your details to create a new account.' : 'Enter your email below to login to your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSigningUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSigningUp && (
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <RadioGroup defaultValue="student" onValueChange={(value) => setRole(value as UserRole)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="role-student" />
                      <Label htmlFor="role-student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="role-teacher" />
                      <Label htmlFor="role-teacher">Teacher</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                {isSigningUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => { setIsSigningUp(!isSigningUp); setError(null); }}>
                {isSigningUp ? 'Login' : 'Sign Up'}
              </Button>
            </div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleAnonymousLogin}>
              Sign in Anonymously
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
