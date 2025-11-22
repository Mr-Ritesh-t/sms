'use client';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, User, Award, Users } from 'lucide-react';
import { GradeSubmissionForm } from './GradeSubmissionForm';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Course, Teacher, Student, Grade, Enrollment } from '@/lib/types';


export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const courseRef = useMemoFirebase(() => doc(firestore, 'courses', params.id), [firestore, params.id]);
  const { data: course, isLoading: courseLoading } = useDoc<Course>(courseRef);

  const teacherRef = useMemoFirebase(() => course ? doc(firestore, 'teachers', course.teacherId) : null, [firestore, course]);
  const { data: teacher, isLoading: teacherLoading } = useDoc<Teacher>(teacherRef);

  const enrollmentsQuery = useMemoFirebase(() => query(collection(firestore, 'enrollments'), where('courseId', '==', params.id)), [firestore, params.id]);
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);
  
  const studentIds = useMemoFirebase(() => enrollments?.map(e => e.studentId) || [], [enrollments]);
  
  const studentsQuery = useMemoFirebase(() => {
    if (studentIds.length > 0) {
      return query(collection(firestore, 'students'), where('id', 'in', studentIds));
    }
    return null;
  }, [firestore, studentIds]);
  const { data: enrolledStudents, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);

  const initialGradesQuery = useMemoFirebase(() => query(collection(firestore, 'grades'), where('courseId', '==', params.id)), [firestore, params.id]);
  const { data: initialGrades, isLoading: gradesLoading } = useCollection<Grade>(initialGradesQuery);


  if (courseLoading || teacherLoading || studentsLoading || enrollmentsLoading || gradesLoading) {
    return <div className="flex-1 space-y-4 p-4 sm:p-6">Loading...</div>;
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title={course.name}>
        <Button>Edit Course</Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                <span>Course Details</span>
              </CardTitle>
               <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <strong>Teacher:</strong>
                  <span>{teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <strong>Schedule:</strong>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <strong>Credits:</strong>
                  <span>N/A</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <strong>Enrolled:</strong>
                  <span>{enrolledStudents?.length || 0} students</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Grade Submission</CardTitle>
              <CardDescription>Enter and save grades for students enrolled in this course.</CardDescription>
            </CardHeader>
            <CardContent>
              <GradeSubmissionForm 
                students={enrolledStudents || []}
                initialGrades={initialGrades || []}
                courseId={course.id}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
