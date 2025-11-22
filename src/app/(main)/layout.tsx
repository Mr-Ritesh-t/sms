'use client';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { MainNav } from './_components/main-nav';
import { UserNav } from './_components/user-nav';
import { FirebaseClientProvider, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { UserRoleProvider, useUserRole } from '@/hooks/use-user-role';

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
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">CampusFlow</span>
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
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}
