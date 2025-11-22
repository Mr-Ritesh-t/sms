
'use client';

import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Student, Course, Grade, Enrollment, StudentFee, FeeStructure } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { EditStudentDialog } from '@/components/dialogs/edit-student-dialog';
import { useMemo } from 'react';

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const firestore = useFirestore();

  const studentRef = useMemoFirebase(() => doc(firestore, 'students', id), [firestore, id]);
  const { data: student, isLoading: isStudentLoading } = useDoc<Student>(studentRef);

  const enrollmentsQuery = useMemoFirebase(() => query(collection(firestore, 'enrollments'), where('studentId', '==', id)), [firestore, id]);
  const { data: enrollments, isLoading: areEnrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);

  const gradesQuery = useMemoFirebase(() => query(collection(firestore, 'grades'), where('studentId', '==', id)), [firestore, id]);
  const { data: grades, isLoading: areGradesLoading } = useCollection<Grade>(gradesQuery);
  
  const courseIds = useMemo(() => enrollments?.map(e => e.courseId) || [], [enrollments]);
  
  const coursesQuery = useMemoFirebase(() => {
    if (courseIds.length > 0) {
      return query(collection(firestore, 'courses'), where('id', 'in', courseIds));
    }
    return null;
  }, [firestore, courseIds]);
  const { data: courses, isLoading: areCoursesLoading } = useCollection<Course>(coursesQuery);

  const studentFeesQuery = useMemoFirebase(() => query(collection(firestore, 'studentFees'), where('studentId', '==', id)), [firestore, id]);
  const { data: studentFees, isLoading: areStudentFeesLoading } = useCollection<StudentFee>(studentFeesQuery);

  const feeStructureIds = useMemo(() => studentFees?.map(sf => sf.feeId) || [], [studentFees]);
  
  const feeStructuresQuery = useMemoFirebase(() => {
    if (feeStructureIds.length > 0) {
      return query(collection(firestore, 'feeStructures'), where('id', 'in', feeStructureIds));
    }
    return null;
  }, [firestore, feeStructureIds]);
  const { data: feeStructures, isLoading: areFeeStructuresLoading } = useCollection<FeeStructure>(feeStructuresQuery);

  const feeStructureMap = useMemo(() => {
    return feeStructures?.reduce((acc, fs) => {
      acc[fs.id] = fs;
      return acc;
    }, {} as Record<string, FeeStructure>) || {};
  }, [feeStructures]);


  if (isStudentLoading || areEnrollmentsLoading || areGradesLoading || areCoursesLoading || areStudentFeesLoading || areFeeStructuresLoading) {
    return <div className="flex-1 space-y-4 p-4 sm:p-6">Loading...</div>;
  }

  if (!student) {
    notFound();
  }
  
  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Student Profile">
        <Button asChild variant="outline">
          <Link href={`/students/${id}/id-card`}>
            <CreditCard className="mr-2 h-4 w-4" />
            Generate ID Card
          </Link>
        </Button>
        {student && <EditStudentDialog student={student} />}
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://picsum.photos/seed/${student.id}/200/200`} alt={studentName} data-ai-hint="person" />
                <AvatarFallback className="text-3xl">
                  {student.firstName[0]}{student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{studentName}</CardTitle>
              <CardDescription>Student ID: {student.id}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{student.email}</span>
                    </div>
                    {student.phone && <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{student.phone}</span>
                    </div>}
                     <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Enrolled: {format(new Date(student.enrollmentDate), 'MMMM d, yyyy')}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Fee Status</CardTitle>
                <CardDescription>All assigned fees and their status.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fee</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentFees?.map(fee => {
                           const feeInfo = feeStructureMap[fee.feeId];
                           if (!feeInfo) return null;

                           const statusVariant = fee.status === 'Paid' ? 'default' : fee.status === 'Overdue' ? 'destructive' : 'secondary';

                           return (
                             <TableRow key={fee.id}>
                                <TableCell className="font-medium">{feeInfo.name}</TableCell>
                                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(feeInfo.amount)}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant}>{fee.status}</Badge>
                                </TableCell>
                            </TableRow>
                           );
                        })}
                         {studentFees?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No fees assigned.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
               </Table>
            </CardContent>
           </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Academic History</CardTitle>
                    <CardDescription>Courses taken and grades received.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {enrollments?.map((enrollment) => {
                        const course = courses?.find(c => c.id === enrollment.courseId);
                        const gradeInfo = grades?.find(g => g.courseId === enrollment.courseId);
                        if (!course) return null;
                        return (
                        <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>{course.description}</TableCell>
                            <TableCell className="text-right font-semibold">{gradeInfo?.grade || 'In Progress'}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
