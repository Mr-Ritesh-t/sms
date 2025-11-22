import type { Student, Teacher, Course, Enrollment, Grade } from './types';

export const students: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@university.edu', enrollmentDate: '2022-09-01', avatarUrl: 'https://picsum.photos/seed/student-1/200/200', address: '123 Maple St, Springfield', phone: '555-0101' },
  { id: '2', name: 'Bob Williams', email: 'bob.w@university.edu', enrollmentDate: '2021-09-01', avatarUrl: 'https://picsum.photos/seed/student-2/200/200', address: '456 Oak Ave, Springfield', phone: '555-0102' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@university.edu', enrollmentDate: '2023-01-15', avatarUrl: 'https://picsum.photos/seed/student-3/200/200', address: '789 Pine Ln, Springfield', phone: '555-0103' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@university.edu', enrollmentDate: '2022-09-01', avatarUrl: 'https://picsum.photos/seed/student-4/200/200', address: '101 Birch Rd, Springfield', phone: '555-0104' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.h@university.edu', enrollmentDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/student-5/200/200', address: '212 Cedar Blvd, Springfield', phone: '555-0105' },
];

export const teachers: Teacher[] = [
  { id: '1', name: 'Dr. Alan Grant', email: 'alan.g@university.edu', department: 'Paleontology', avatarUrl: 'https://picsum.photos/seed/teacher-1/200/200', office: 'Science Bldg 101', phone: '555-0201' },
  { id: '2', name: 'Dr. Ellie Sattler', email: 'ellie.s@university.edu', department: 'Paleobotany', avatarUrl: 'https://picsum.photos/seed/teacher-2/200/200', office: 'Science Bldg 102', phone: '555-0202' },
  { id: '3', name: 'Dr. Ian Malcolm', email: 'ian.m@university.edu', department: 'Mathematics', avatarUrl: 'https://picsum.photos/seed/teacher-3/200/200', office: 'Math Bldg 205', phone: '555-0203' },
];

export const courses: Course[] = [
  { id: '1', name: 'Introduction to Paleontology', code: 'PALEO-101', description: 'A survey of the history of life on Earth.', teacherId: '1', schedule: 'Mon/Wed/Fri 10:00-11:00', credits: 3 },
  { id: '2', name: 'Advanced Paleobotany', code: 'PBOT-302', description: 'In-depth study of fossilized plants.', teacherId: '2', schedule: 'Tue/Thu 13:00-14:30', credits: 4 },
  { id: '3', name: 'Chaos Theory', code: 'MATH-450', description: 'The mathematical study of complex systems.', teacherId: '3', schedule: 'Mon/Wed 15:00-16:30', credits: 4 },
  { id: '4', name: 'Fossil Preparation Lab', code: 'PALEO-102', description: 'Hands-on laboratory techniques for fossils.', teacherId: '1', schedule: 'Fri 13:00-16:00', credits: 2 },
];

export const enrollments: Enrollment[] = [
  { studentId: '1', courseId: '1' },
  { studentId: '1', courseId: '2' },
  { studentId: '2', courseId: '1' },
  { studentId: '2', courseId: '3' },
  { studentId: '3', courseId: '3' },
  { studentId: '4', courseId: '1' },
  { studentId: '4', courseId: '4' },
  { studentId: '5', courseId: '2' },
  { studentId: '5', courseId: '3' },
];

export const grades: Grade[] = [
  { studentId: '1', courseId: '1', grade: 'A' },
  { studentId: '1', courseId: '2', grade: 'B+' },
  { studentId: '2', courseId: '1', grade: 'B' },
  { studentId: '2', courseId: '3', grade: 'A-' },
  { studentId: '3', courseId: '3', grade: 'C' },
  { studentId: '4', courseId: '1', grade: 'A' },
];

// Helper functions
export const getTeacherById = (id: string) => teachers.find(t => t.id === id);
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getCourseById = (id: string) => courses.find(c => c.id === id);
export const getCoursesByTeacher = (teacherId: string) => courses.filter(c => c.teacherId === teacherId);
export const getEnrollmentsByStudent = (studentId: string) => enrollments.filter(e => e.studentId === studentId);
export const getStudentsByCourse = (courseId: string) => {
    const studentIds = enrollments.filter(e => e.courseId === courseId).map(e => e.studentId);
    return students.filter(s => studentIds.includes(s.id));
};
export const getGradesByStudent = (studentId: string) => grades.filter(g => g.studentId === studentId);
