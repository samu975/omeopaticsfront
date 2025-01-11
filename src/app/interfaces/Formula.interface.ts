import FollowUp from "./FollowUp.interface"

interface Formula {
  name: string
  description: string
  followUps: FollowUp[]
}

export default Formula