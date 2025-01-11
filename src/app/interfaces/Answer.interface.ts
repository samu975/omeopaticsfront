import Question from "./Question.interface"

interface Answer {
  question: Question
  type: "abierta" | "multiple" | "unica"
  answer: string | string[]
}

export default Answer