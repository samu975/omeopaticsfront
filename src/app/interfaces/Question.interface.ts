export interface Question {
  id: number;
  text: string;
  type: 'abierta' | 'multiple' | 'unica' | 'number' | 'boolean' | 'text' | 'select';
  options?: Array<{
    id: number;
    text: string;
  }>;
  required: boolean;
}

export interface QuestionSet {
  id?: string;
  name: string;
  questions: Question[];
  createdAt: Date;
  followUpConfig?: {
    enabled: boolean;
    daysOfWeek: string[];
    time: string;
  };
}

export default Question;