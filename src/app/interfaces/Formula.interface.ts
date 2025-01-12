import Answer from './Answer.interface';
import Question from './Question.interface';

interface Formula {
  _id?: string;
  name: string;
  description: string;
  questions: Question[];
  answers?: Answer[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default Formula;