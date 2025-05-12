export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  title: string;
  type: 'abierta' | 'multiple' | 'unica';
  options?: Option[];
}

export interface Answer {
  question: Question;
  type: 'abierta' | 'multiple' | 'unica';
  answer: string[];
  createdAt: Date;
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  dosis: string;
  questions: Question[];
  userId: string;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  cedula: string;
  role: UserRole;
  asignedFormulas: Formula[];
}

export interface FollowUp {
  id: string;
  answers: Answer[];
  createdAt: Date;
}

export interface FollowUpQuestionary {
  id: string;
  questions: Question[];
} 