export interface UserData {
  name: string
  email: string
  avatar?: string
}

export interface BoardData {
  boardId: string
  title: string
  description?: string
}

export interface ListData {
  listaId: string
  title: string
  order: number
}

export interface TaskData {
  cardId: string
  title: string
  description?: string
  completed: boolean
}
