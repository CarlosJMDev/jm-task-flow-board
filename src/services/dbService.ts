import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  or,
  where,
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import type { Board, List, Task, TaskState, UserData } from '@/types/index'
import router from '@/router'

export async function addBoard(boardId: string, boardData: Board): Promise<void> {
  try {
    await setDoc(doc(db, 'boards', boardId), boardData)
    router.push({ name: 'boardview', params: { id: boardId } })
  } catch (error) {
    console.error('Error adding board:', error)
  }
}

export async function addList(boardId: string, listId: string, listData: List): Promise<void> {
  await setDoc(doc(db, 'boards', boardId, 'lists', listId), listData)
}

export async function addTask(
  boardId: string,
  listId: string,
  taskId: string,
  taskData: Task,
): Promise<void> {
  await setDoc(doc(db, 'boards', boardId, 'lists', listId, 'tasks', taskId), taskData)
}

export async function getBoards(email: string): Promise<Board[]> {
  const boardsCol = collection(db, 'boards')

  const q = query(
    boardsCol,
    or(where('creatorId', '==', email), where('invitedUserEmails', 'array-contains', email)),
  )

  const boardSnapshot = await getDocs(q)
  const boards: Board[] = []
  boardSnapshot.forEach((docSnap) => {
    // Se fuerza el tipado asumiendo que la estructura en Firestore es igual al de Board
    boards.push({ boardId: docSnap.id, ...docSnap.data() } as Board)
  })
  return boards
}

export async function getTasks(boardId: string, listId: string): Promise<Task[]> {
  const tasksCol = collection(db, 'boards', boardId, 'lists', listId, 'tasks')
  const tasksSnapshot = await getDocs(tasksCol)
  const tasks: Task[] = []
  tasksSnapshot.forEach((docSnap) => {
    const data = docSnap.data()
    if (data.deadline && typeof data.deadline.toDate === 'function') {
      data.deadline = data.deadline.toDate()
    } else {
      data.deadline = new Date(data.deadline)
    }
    tasks.push({ taskId: docSnap.id, ...data } as Task)
  })
  return tasks
}

export async function updateTaskState(
  boardId: string,
  fromListId: string,
  toListId: string,
  taskId: string,
  newState: TaskState,
): Promise<void> {
  if (fromListId === toListId) {
    const taskRef = doc(db, 'boards', boardId, 'lists', toListId, 'tasks', taskId)
    await updateDoc(taskRef, { state: newState })
  } else {
    const taskRefOld = doc(db, 'boards', boardId, 'lists', fromListId, 'tasks', taskId)
    const taskSnap = await getDoc(taskRefOld)
    if (taskSnap.exists()) {
      const taskData = taskSnap.data() as Task
      taskData.state = newState
      const taskRefNew = doc(db, 'boards', boardId, 'lists', toListId, 'tasks', taskId)
      await setDoc(taskRefNew, taskData)
      await deleteDoc(taskRefOld)
    }
  }
}

export async function updateBoard(boardId: string, data: Partial<Board>): Promise<void> {
  const boardRef = doc(db, 'boards', boardId)
  await updateDoc(boardRef, data)
}

export async function deleteTask(boardId: string, listId: string, taskId: string): Promise<void> {
  const taskRef = doc(db, 'boards', boardId, 'lists', listId, 'tasks', taskId)
  await deleteDoc(taskRef)
}

export async function addUser(uid: string, userData: UserData): Promise<void> {
  await setDoc(doc(db, 'users', uid), userData)
}
