interface Option {
  id: number;
  value: string;
}


interface Question {
  title: string;
  type: "abierta" | "multiple" | "unica";
  options?: Array<Option>;
}

export default Question