import Question from './Question.interface'

interface Answer {
  id?: string;
  question: Question;
  type: 'abierta' | 'multiple' | 'unica';
  answer: string[];
  createdAt?: Date;
}

export default Answer;