export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
  phone?: string;
};

export type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  avatarUrl: string;
  office: string;
  phone: string;
};

export type Course = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  teacherId: string;
};

export type Enrollment = {
  studentId: string;
  courseId: string;
};

export type Grade = {
  studentId: string;
  courseId: string;
  grade: string;
};
