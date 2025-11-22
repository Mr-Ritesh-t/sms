export type Student = {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  avatarUrl: string;
  address: string;
  phone: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl: string;
  office: string;
  phone: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  schedule: string;
  credits: number;
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
