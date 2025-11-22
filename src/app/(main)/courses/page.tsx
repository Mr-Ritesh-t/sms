import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { courses, getTeacherById } from '@/lib/data';

export default function CoursesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Courses">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
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
                <TableHead className="hidden sm:table-cell">Code</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Schedule</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const teacher = getTeacherById(course.teacherId);
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{course.code}</Badge>
                    </TableCell>
                    <TableCell>{teacher?.name || 'N/A'}</TableCell>
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
