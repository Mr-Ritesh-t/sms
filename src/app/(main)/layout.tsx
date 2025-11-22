'use client';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { MainNav } from './_components/main-nav';
import { UserNav } from './_components/user-nav';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
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
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}
