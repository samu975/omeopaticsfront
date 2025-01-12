interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  title: string;
  type: "abierta" | "multiple" | "unica";
  options?: Array<Option>;
}

export default Question;