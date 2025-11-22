
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/db/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Teacher } from '@/lib/types';

const courseFormSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().min(1, 'Course description is required'),
  schedule: z.string().min(1, 'Schedule is required'),
  teacherId: z.string().min(1, 'A teacher must be selected'),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface AddCourseDialogProps {
  teachers: Teacher[];
}

export function AddCourseDialog({ teachers }: AddCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      description: '',
      schedule: '',
      teacherId: '',
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    const coursesCollection = collection(firestore, 'courses');
    addDocumentNonBlocking(coursesCollection, data);
    
    toast({
      title: 'Course Added',
      description: `${data.name} has been added to the catalog.`,
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Enter the details for the new course. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Introduction to History" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code / Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. HIST-101" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Mon/Wed/Fri 10:00-11:00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Course</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
