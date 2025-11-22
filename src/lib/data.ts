// This file is now deprecated. Data is fetched from Firestore.
import type { Student, Teacher, Course, Enrollment, Grade } from './types';

export const students: Omit<Student, 'id'>[] = [
];

export const teachers: Omit<Teacher, 'id'>[] = [
];

export const courses: Omit<Course, 'id'>[] = [
];

export const enrollments: Enrollment[] = [
];

export const grades: Grade[] = [
];

// Helper functions are now deprecated. Use firestore queries instead.
export const getTeacherById = (id: string) => null;
export const getStudentById = (id: string) => null;
export const getCourseById = (id: string) => null;
export const getCoursesByTeacher = (teacherId: string) => [];
export const getEnrollmentsByStudent = (studentId: string) => [];
export const getStudentsByCourse = (courseId: string) => [];
export const getGradesByStudent = (studentId: string) => [];
