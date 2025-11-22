import { notFound } from 'next/navigation';
import { getCourseById, getTeacherById, getStudentsByCourse, grades as allGrades } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, User, Award, Users } from 'lucide-react';
import { GradeSubmissionForm } from './GradeSubmissionForm';

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const course = getCourseById(params.id);

  if (!course) {
    notFound();
  }

  const teacher = getTeacherById(course.teacherId);
  const enrolledStudents = getStudentsByCourse(course.id);
  const initialGrades = allGrades.filter(g => g.courseId === course.id);

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
               <CardDescription>{course.code}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{course.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <strong>Teacher:</strong>
                  <span>{teacher?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <strong>Schedule:</strong>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <strong>Credits:</strong>
                  <span>{course.credits}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <strong>Enrolled:</strong>
                  <span>{enrolledStudents.length} students</span>
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
                students={enrolledStudents}
                initialGrades={initialGrades}
                courseId={course.id}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
