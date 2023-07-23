export interface Campaign {
  collectionId: string
  collectionName: string
  created: string
  createdUser: string
  description: string
  expand: Expand
  id: string
  image: string
  live: boolean
  map: string
  savedUsers: string[]
  title: string
  updated: string
  votes: number
}

export interface Message {
  campaign: string
  collectionId: string
  collectionName: string
  content: string
  created: string
  expand: MessageExpand
  id: string
  updated: string
  user: string
}

export interface Expand {
  createdUser: CreatedUser
}

export interface MessageExpand {
  user: CreatedUser,
  campaign: Campaign
}

export interface CreatedUser {
  avatar: string
  collectionId: string
  collectionName: string
  created: string
  emailVisibility: boolean
  id: string
  name: string
  updated: string
  username: string
  verified: boolean
}
