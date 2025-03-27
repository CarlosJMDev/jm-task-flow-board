export type TaskState = 'start' | 'inprocess' | 'inreview' | 'done'

export interface Task {
  taskId: string
  title: string
  description?: string
  state: TaskState
  createdAt: Date
  deadline: Date
}

export interface List {
  listId: string
  title: string
  order: number
  tasks?: Task[]
}

export interface InvitedUser {
  userId: string
  role: 'boss' | 'collaborator'
}

export interface Board {
  creatorId: string
  boardId: string
  title: string
  description?: string
  isFavorite: boolean
  isFinished: boolean
  lists?: List[]
  invitedUsers?: InvitedUser[]
  invitedUserEmails?: string[]
}

export interface UserData {
  name: string
  email: string
  avatar: string
}
