'use client';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, Building } from 'lucide-react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Teacher, Course } from '@/lib/types';


export default function TeacherProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const teacherRef = useMemoFirebase(() => doc(firestore, 'teachers', params.id), [firestore, params.id]);
  const { data: teacher, isLoading: teacherLoading } = useDoc<Omit<Teacher, 'id'>>(teacherRef);

  const coursesQuery = useMemoFirebase(() => query(collection(firestore, 'courses'), where('teacherId', '==', params.id)), [firestore, params.id]);
  const { data: assignedCourses, isLoading: coursesLoading } = useCollection<Course>(coursesQuery);

  if (teacherLoading || coursesLoading) {
    return <div className="flex-1 space-y-4 p-4 sm:p-6">Loading...</div>;
  }

  if (!teacher) {
    notFound();
  }
  
  const teacherName = `${teacher.firstName} ${teacher.lastName}`;

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Teacher Profile">
        <Button>Edit Profile</Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={teacher.avatarUrl} alt={teacherName} data-ai-hint="person" />
                <AvatarFallback className="text-3xl">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{teacherName}</CardTitle>
              <CardDescription>{teacher.department} Department</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>Office: {teacher.office}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Courses</CardTitle>
                    <CardDescription>Courses taught by {teacherName}.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Schedule</TableHead>
                         <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {assignedCourses?.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>{course.description}</TableCell>
                            <TableCell className="text-right">{course.schedule}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="ghost" size="icon">
                                <Link href={`/courses/${course.id}`}>
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span className="sr-only">View Course</span>
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
      </div>
    </div>
  );
}
