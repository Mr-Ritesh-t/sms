'use client';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { School } from 'lucide-react';
import { MainNav } from './_components/main-nav';
import { UserNav } from './_components/user-nav';
import { FirebaseClientProvider, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { UserRoleProvider } from '@/hooks/use-user-role';

// NOTE: The server-side redirect logic has been moved to a higher-level layout
// or middleware. This component now assumes it will only be rendered for
// authenticated users. The client-side check remains as a fallback.

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    // Fallback client-side check
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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


export default function AppLayout({ children }: { children: React.ReactNode }) {
  // This layout now primarily provides the Firebase context to its children.
  // The client-side Firebase initialization happens here.
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}
