
'use client';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { FeeStructure } from '@/lib/types';
import { AddFeeDialog } from '@/components/dialogs/add-fee-dialog';

export default function FeesPage() {
  const firestore = useFirestore();
  const feesCollection = useMemoFirebase(() => collection(firestore, 'feeStructures'), [firestore]);
  const { data: fees, isLoading } = useCollection<FeeStructure>(feesCollection);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <PageHeader title="Fee Management">
        <AddFeeDialog />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Fee Structures</CardTitle>
          <CardDescription>
            A list of all fee structures in the system.
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
              {isLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
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
