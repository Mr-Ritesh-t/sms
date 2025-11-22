'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, User, Library, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import type { Student, Teacher, Course } from '@/lib/types';

export default function DashboardPage() {
  const firestore = useFirestore();

  const studentsCollection = useMemoFirebase(() => collection(firestore, 'students'), [firestore]);
  const { data: students } = useCollection<Student>(studentsCollection);

  const teachersCollection = useMemoFirebase(() => collection(firestore, 'teachers'), [firestore]);
  const { data: teachers } = useCollection<Teacher>(teachersCollection);

  const coursesCollection = useMemoFirebase(() => collection(firestore, 'courses'), [firestore]);
  const { data: courses } = useCollection<Course>(coursesCollection);
  
  const recentCoursesQuery = useMemoFirebase(() => query(coursesCollection, limit(5)), [coursesCollection]);
  const { data: recentCourses } = useCollection<Course>(recentCoursesQuery);
  
  const teachersMap = useMemoFirebase(() => teachers?.reduce((acc, teacher) => {
    acc[teacher.id] = teacher;
    return acc;
  }, {} as Record<string, Teacher>) || {}, [teachers]);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students?.length || 0}</div>
            <p className="text-xs text-muted-foreground">in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers?.length || 0}</div>
             <p className="text-xs text-muted-foreground">in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">available</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Courses</CardTitle>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/courses">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="hidden sm:table-cell">Teacher</TableHead>
                  <TableHead className="hidden md:table-cell">Schedule</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCourses?.map((course) => {
                  const teacher = teachersMap[course.teacherId];
                  return (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="font-medium">{course.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {course.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{teacher ? `${teacher.firstName} ${teacher.lastName}`: 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{course.schedule}</TableCell>
                      <TableCell className="text-right">N/A</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
