
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type UserProfile = {
  id: string; // This should match the Firebase Auth UID
  role: UserRole;
  studentId?: string; // Link to student profile if role is 'student' or 'parent'
  teacherId?: string; // Link to teacher profile if role is 'teacher'
};

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
  phone?: string;
  // No role property here, role is managed in UserProfile
};

export type Teacher = {
  id:string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  avatarUrl: string;
  office: string;
  phone: string;
  // No role property here, role is managed in UserProfile
};

export type Course = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  teacherId: string;
};

export type Enrollment = {
  id: string;
  studentId: string;
  courseId: string;
};

export type Grade = {
  id: string;
  studentId: string;
  courseId: string;
  grade: string;
  submissionDate: string;
};

export type FeeStructure = {
    id: string;
    name: string;
    description: string;
    amount: number;
};

export type StudentFee = {
    id: string;
    studentId: string;
    feeId: string;
    dueDate: string;
    status: 'Paid' | 'Unpaid' | 'Overdue';
};

export type Payment = {
    id: string;
    studentFeeId: string;
    amount: number;
    paymentDate: string;
    method: string;
};
