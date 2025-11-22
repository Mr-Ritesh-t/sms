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
import { useUserRole } from '@/hooks/use-user-role';


export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { role } = useUserRole();
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

  const isTeacher = role === 'teacher';

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title={course.name}>
        {isTeacher && <Button>Edit Course</Button>}
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
          {isTeacher ? (
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
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>List of students taking this course.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  {enrolledStudents?.map(student => (
                    <li key={student.id} className="flex items-center gap-3 py-2">
                      <Avatar>
                         <AvatarImage src={`https://picsum.photos/seed/${student.id}/100/100`} alt={`${student.firstName} ${student.lastName}`} data-ai-hint="person" />
                         <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{student.firstName} {student.lastName}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
