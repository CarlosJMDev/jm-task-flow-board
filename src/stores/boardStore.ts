import { defineStore } from 'pinia'
import { addBoard, addList, addTask } from '../services/dbService'

interface Board {
  boardId: string
  title: string
  description?: string
}

interface List {
  listaId: string
  title: string
  order: number
}

interface Task {
  cardId: string
  title: string
  description?: string
  completed: boolean
}

export const useBoardStore = defineStore('board', {
  state: () => ({
    boards: [] as Board[],
    // Aquí podrías tener listas y tareas también
  }),
  actions: {
    async createBoard(boardData: Board) {
      try {
        // Suponiendo que boardData.boardId ya esté definido
        await addBoard(boardData.boardId, boardData)
        // Luego actualizas el estado local (por ejemplo, agregando a la lista de boards)
        this.boards.push(boardData)
      } catch (error) {
        console.error('Error creating board:', error)
      }
    },
    async createList(boardId: string, listData: List) {
      try {
        await addList(boardId, listData.listaId, listData)
        // Aquí actualizarías el estado de las listas si lo gestionas en el store
      } catch (error) {
        console.error('Error creating list:', error)
      }
    },
    async createTask(boardId: string, listaId: string, taskData: Task) {
      try {
        await addTask(boardId, listaId, taskData.cardId, taskData)
        // Actualiza el estado de las tareas en el store si es necesario
      } catch (error) {
        console.error('Error creating task:', error)
      }
    },
  },
})
