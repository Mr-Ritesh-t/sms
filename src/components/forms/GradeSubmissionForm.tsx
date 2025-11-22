
'use client';

import { useState } from 'react';
import type { Student, Grade } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

interface GradeSubmissionFormProps {
  students: Student[];
  initialGrades: Grade[];
  courseId: string;
}

export function GradeSubmissionForm({ students, initialGrades, courseId }: GradeSubmissionFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  // Create a map of studentId -> existing grade object
  const initialGradesMap = initialGrades.reduce((acc, grade) => {
    acc[grade.studentId] = grade;
    return acc;
  }, {} as Record<string, Grade>);

  const [grades, setGrades] = useState<Record<string, string>>(() => {
    return students.reduce((acc, student) => {
      acc[student.id] = initialGradesMap[student.id]?.grade || '';
      return acc;
    }, {} as Record<string, string>);
  });

  const handleGradeChange = (studentId: string, value: string) => {
    setGrades(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    const batch = writeBatch(firestore);
    const gradesCollection = collection(firestore, 'grades');

    for (const student of students) {
      const studentId = student.id;
      const newGradeValue = grades[studentId];

      if (newGradeValue !== undefined) { // Only process students who have a grade input
        const existingGrade = initialGradesMap[studentId];

        if (existingGrade) {
          // Update existing grade document if the grade has changed
          if (existingGrade.grade !== newGradeValue) {
            const gradeRef = doc(firestore, 'grades', existingGrade.id);
            batch.update(gradeRef, { grade: newGradeValue });
          }
        } else if (newGradeValue) {
           // Create a new grade document if one doesn't exist and a grade was entered
            const newGradeRef = doc(gradesCollection); // Auto-generates ID
            batch.set(newGradeRef, {
                id: newGradeRef.id,
                studentId: studentId,
                courseId: courseId,
                grade: newGradeValue,
                submissionDate: new Date().toISOString(),
            });
        }
      }
    }

    try {
        await batch.commit();
        toast({
            title: "Grades Saved",
            description: "The new grades have been successfully saved.",
        });
    } catch (error) {
        console.error("Error saving grades:", error);
        toast({
            title: "Error",
            description: "There was an error saving the grades. Please check permissions.",
            variant: "destructive",
        });
    }
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
                  <AvatarImage src={`https://picsum.photos/seed/${student.id}/100/100`} alt={`${student.firstName} ${student.lastName}`} data-ai-hint="person" />
                  <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
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
