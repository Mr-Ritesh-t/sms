
'use client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Teacher } from '@/lib/types';
import { AddTeacherDialog } from '@/components/dialogs/add-teacher-dialog';

export default function TeachersPage() {
  const firestore = useFirestore();
  const teachersCollection = useMemoFirebase(() => collection(firestore, 'teachers'), [firestore]);
  const { data: teachers, isLoading } = useCollection<Teacher>(teachersCollection);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Teachers">
        <AddTeacherDialog />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>
            A list of all teachers in the institution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
              {teachers?.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.avatarUrl} alt={`${teacher.firstName} ${teacher.lastName}`} data-ai-hint="person" />
                      <AvatarFallback>{teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell className="hidden md:table-cell">{teacher.email}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/teachers/${teacher.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">View Profile</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
