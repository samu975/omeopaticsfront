export interface Question {
  id?: string;
  text: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
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