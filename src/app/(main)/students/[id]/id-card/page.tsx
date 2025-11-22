
'use client';

import { notFound } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { School } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentIdCardPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const studentRef = useMemoFirebase(() => doc(firestore, 'students', params.id), [firestore, params.id]);
  const { data: student, isLoading: isStudentLoading } = useDoc<Student>(studentRef);

  if (isStudentLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading ID Card...</p>
      </div>
    );
  }

  if (!student) {
    notFound();
  }
  
  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 print:bg-white print:h-auto">
        <style jsx global>{`
            @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .no-print {
                display: none;
            }
            }
        `}</style>

        <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden font-sans border-4 border-primary">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <School className="h-8 w-8" />
                    <h1 className="text-xl font-bold">School Management System</h1>
                </div>
                <p className="text-sm font-medium mt-1">Student Identification Card</p>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-gray-200 dark:border-gray-700">
                    <AvatarImage src={`https://picsum.photos/seed/${student.id}/200/200`} alt={studentName} data-ai-hint="person" />
                    <AvatarFallback className="text-5xl">
                    {student.firstName[0]}{student.lastName[0]}
                    </AvatarFallback>
                </Avatar>

                <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">{studentName}</h2>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Student</p>

                <div className="w-full mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-left space-y-3">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">ID Number</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">{student.id.substring(0, 10).toUpperCase()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Email</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">{student.email}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Issued</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

             {/* Footer */}
            <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3">
               <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    If found, please return to school office.
                </p>
            </div>
        </div>

        <div className="mt-6 no-print">
            <Button onClick={() => window.print()}>Print ID Card</Button>
        </div>
    </div>
  );
}

    