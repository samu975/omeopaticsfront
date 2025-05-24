import { Document } from 'mongodb'

export interface FollowUp {
  enabled: boolean;
  daysOfWeek: string[];
  time: string;
  oneTime: boolean;
  oneTimeDate: string;
  oneTimeTime: string;
  noSend: boolean;
}

export interface Question {
  id: number;
  title: string;
  type: 'abierta' | 'multiple' | 'unica';
  options: Array<{
    id: number;
    text: string;
  }>;
  followUp: FollowUp;
}

export interface FormulaQuestionBank {
  bankId: string;
  followUp: FollowUp;
}

export interface Formula extends Document {
  _id?: string;
  name: string;
  description: string;
  dosis: string;
  user: string;
  questionBanks?: FormulaQuestionBank[];
  followUp?: FollowUp;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Formula;