
'use client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { FeeStructure, Student } from '@/lib/types';
import { AddFeeDialog } from '@/components/dialogs/add-fee-dialog';
import { AssignFeeDialog } from '@/components/dialogs/assign-fee-dialog';
import { useUserRole } from '@/hooks/use-user-role';
import { Button } from '@/components/ui/button';

export default function FeesPage() {
  const firestore = useFirestore();
  const { role } = useUserRole();

  const feesCollection = useMemoFirebase(() => collection(firestore, 'feeStructures'), [firestore]);
  const { data: fees, isLoading: feesLoading } = useCollection<FeeStructure>(feesCollection);

  const studentsCollection = useMemoFirebase(() => collection(firestore, 'students'), [firestore]);
  const { data: students, isLoading: studentsLoading } = useCollection<Student>(studentsCollection);
  
  const isAdmin = role === 'admin';

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Fee Management">
        {isAdmin && (
          <div className="flex gap-2">
            <AssignFeeDialog students={students || []} feeStructures={fees || []} />
            <AddFeeDialog />
          </div>
        )}
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Fee Structures</CardTitle>
          <CardDescription>
            A list of all fee structures in the system. Admins can assign these to students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(feesLoading || studentsLoading) && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
              {fees?.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(fee.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
