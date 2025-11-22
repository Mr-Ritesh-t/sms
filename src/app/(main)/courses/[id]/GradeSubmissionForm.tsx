'use client';

import { useState } from 'react';
import type { Student, Grade } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface GradeSubmissionFormProps {
  students: Student[];
  initialGrades: Grade[];
  courseId: string;
}

export function GradeSubmissionForm({ students, initialGrades, courseId }: GradeSubmissionFormProps) {
  const { toast } = useToast();
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    return initialGrades.reduce((acc, grade) => {
      acc[grade.studentId] = grade.grade;
      return acc;
    }, {} as Record<string, string>);
  });

  const handleGradeChange = (studentId: string, value: string) => {
    setGrades(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitting grades:', { courseId, grades });
    toast({
      title: "Grades Saved",
      description: "The new grades have been successfully saved.",
    });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead className="w-[120px]">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="person" />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="text-muted-foreground">{student.id}</TableCell>
              <TableCell>
                <Input
                  value={grades[student.id] || ''}
                  onChange={(e) => handleGradeChange(student.id, e.target.value.toUpperCase())}
                  placeholder="e.g. A+"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Save Grades</Button>
      </div>
    </div>
  );
}
