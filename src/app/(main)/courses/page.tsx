'use client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Course, Teacher } from '@/lib/types';
import { AddCourseDialog } from './_components/add-course-dialog';

export default function CoursesPage() {
  const firestore = useFirestore();
  const coursesCollection = useMemoFirebase(() => collection(firestore, 'courses'), [firestore]);
  const { data: courses, isLoading: coursesLoading } = useCollection<Course>(coursesCollection);
  
  const teachersCollection = useMemoFirebase(() => collection(firestore, 'teachers'), [firestore]);
  const { data: teachers, isLoading: teachersLoading } = useCollection<Teacher>(teachersCollection);
  
  const teacherMap = useMemoFirebase(() => {
    if (!teachers) return {};
    return teachers.reduce((acc, teacher) => {
        acc[teacher.id] = `${teacher.firstName} ${teacher.lastName}`;
        return acc;
    }, {} as Record<string, string>);
  }, [teachers]);


  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Courses">
        <AddCourseDialog teachers={teachers || []} />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
          <CardDescription>
            A list of all available courses for the current semester.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Schedule</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {(coursesLoading || teachersLoading) && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
              {courses?.map((course) => {
                const teacherName = teacherMap[course.teacherId] || 'N/A';
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{course.description}</Badge>
                    </TableCell>
                    <TableCell>{teacherName}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.schedule}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/courses/${course.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View Course</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
