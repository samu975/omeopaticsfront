import Answer from "./Answer.interface"

interface FollowUp {
  _id: string
  answers: Answer[]
}

export default FollowUp