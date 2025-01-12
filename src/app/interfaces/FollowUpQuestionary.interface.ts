import Question from "./Question.interface"

interface FollowUpQuestionary {
  _id: string
  questions: Question[]
}

export default FollowUpQuestionary