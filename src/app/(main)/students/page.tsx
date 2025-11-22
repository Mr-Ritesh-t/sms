'use client';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { AddStudentDialog } from './_components/add-student-dialog';

export default function StudentsPage() {
  const firestore = useFirestore();
  const studentsCollection = useMemoFirebase(() => collection(firestore, 'students'), [firestore]);
  const { data: students, isLoading } = useCollection<Omit<Student, 'id'>>(studentsCollection);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Students">
        <AddStudentDialog />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>
            A list of all students currently enrolled.
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
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Enrollment Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              )}
              {!isLoading && students?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://picsum.photos/seed/${student.id}/100/100`} alt={student.firstName} data-ai-hint="person" />
                      <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(student.enrollmentDate), 'MMMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/students/${student.id}`}>
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
