import { db } from './firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'

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

// Función para agregar un usuario
export async function addUser(uid: string, userData: UserData): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, userData)
  console.log(`User ${uid} added`)
}

// Función para agregar un tablero
export async function addBoard(boardId: string, boardData: BoardData): Promise<void> {
  const boardRef = doc(db, 'boards', boardId)
  await setDoc(boardRef, boardData)
  console.log(`Board ${boardId} added`)
}

// Función para agregar una lista a un tablero
export async function addList(boardId: string, listaId: string, listData: ListData): Promise<void> {
  const listRef = doc(db, 'boards', boardId, 'listas', listaId)
  await setDoc(listRef, listData)
  console.log(`List ${listaId} added to board ${boardId}`)
}

// Función para agregar una tarea a una lista
export async function addTask(
  boardId: string,
  listaId: string,
  cardId: string,
  taskData: TaskData,
): Promise<void> {
  const taskRef = doc(db, 'boards', boardId, 'listas', listaId, 'tasks', cardId)
  await setDoc(taskRef, taskData)
  console.log(`Task ${cardId} added to list ${listaId} in board ${boardId}`)
}
