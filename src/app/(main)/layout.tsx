
'use client';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { School } from 'lucide-react';
import { MainNav } from '@/components/navigation/main-nav';
import { UserNav } from '@/components/navigation/user-nav';
import { FirebaseClientProvider, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { UserRoleProvider } from '@/hooks/use-user-role';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

// This is a server component wrapper to handle initial auth check
export default function AppLayout({ children }: { children: React.ReactNode }) {
  // The FirebaseClientProvider is crucial here to provide Firebase context
  // to all child components, including the auth-aware AppLayoutContent.
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}

// This is the main client component for the layout.
function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  // This effect handles the case where a user logs out.
  // If the user object becomes null after the initial load, it means they logged out.
  // We then redirect them to the login page.
  useEffect(() => {
    if (!isUserLoading && !user) {
      // Using window.location.href forces a full page reload, which is a robust
      // way to clear all state and ensure the user lands cleanly on the login page.
      window.location.href = '/login';
    }
  }, [user, isUserLoading]);


  const isLoading = isUserLoading || isProfileLoading;

  // While we are verifying the user and their profile, show a loading screen.
  // If the user logs out, the useEffect above will trigger the redirect.
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Once the user and profile are loaded, render the full app layout.
  return (
    <UserRoleProvider role={userProfile?.role || null}>
      <SidebarProvider>
        <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-lg">
              <div className="rounded-lg grid place-content-center size-8 text-primary bg-primary/10 hover:bg-primary/20">
                <School className="h-5 w-5" />
              </div>
              <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">School Management</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2 pt-0">
            <MainNav />
          </SidebarContent>
          <SidebarFooter className="p-2 border-t">
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserRoleProvider>
  );
}
