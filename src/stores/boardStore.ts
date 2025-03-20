import { defineStore } from 'pinia'
import { addBoard, addList, addTask, getBoards } from '@/services/dbService'
import type { Board, List, Task, TaskState } from '@/types/index'

export const useBoardStore = defineStore('board', {
  state: () => ({
    boards: [] as Board[],
    currentBoard: null as Board | null,
  }),
  actions: {
    async createBoard(boardData: Board): Promise<void> {
      try {
        await addBoard(boardData.boardId, boardData)
        this.boards.push(boardData)
      } catch (error) {
        console.error('Error creating board:', error)
      }
    },
    async loadBoards(): Promise<void> {
      try {
        const boardsData: Board[] = await getBoards()
        this.boards = boardsData
      } catch (error) {
        console.error('Error loading boards:', error)
      }
    },
    selectBoard(board: Board): void {
      this.currentBoard = board
    },
    async createList(boardId: string, listData: List): Promise<void> {
      try {
        await addList(boardId, listData.listId, listData)
      } catch (error) {
        console.error('Error creating list:', error)
      }
    },
    async createTask(boardId: string, listId: string, taskData: Task): Promise<void> {
      try {
        await addTask(boardId, listId, taskData.taskId, taskData)
      } catch (error) {
        console.error('Error creating task:', error)
      }
    },
    async updateTaskState(
      boardId: string,
      listId: string,
      taskId: string,
      newState: TaskState,
    ): Promise<void> {
      try {
        // Aquí deberías implementar la actualización en Firestore (por ejemplo, usando updateDoc)
        console.log(
          `Updating task ${taskId} in board ${boardId}, list ${listId} to state ${newState}`,
        )
      } catch (error) {
        console.error('Error updating task state:', error)
      }
    },
  },
})

// // store/boardStore.ts
// import { defineStore } from 'pinia'
// import { addBoard, addList, addTask, getBoards } from '../services/dbService'

// interface Board {
//   boardId: string
//   title: string
//   description?: string
//   // Puedes incluir más datos, por ejemplo, la fecha de creación, usuarios colaborativos, etc.
// }

// interface List {
//   listId: string
//   title: string
//   order: number
// }

// interface Task {
//   taskId: string
//   title: string
//   description?: string
//   state: 'inicio' | 'en proceso' | 'en revisión' | 'acabado'
//   createdAt: Date
//   deadline: Date
// }

// export const useBoardStore = defineStore('board', {
//   state: () => ({
//     boards: [] as Board[],
//     currentBoard: null as Board | null, // tablero seleccionado para mostrar detalles
//     // Si lo prefieres, puedes separar las listas y tareas en otro store.
//   }),
//   actions: {
//     async createBoard(boardData: Board) {
//       try {
//         await addBoard(boardData.boardId, boardData)
//         this.boards.push(boardData)
//       } catch (error) {
//         console.error('Error creating board:', error)
//       }
//     },
//     async loadBoards() {
//       try {
//         const boardsData = await getBoards() // Supón que obtienes los tableros desde Firebase
//         this.boards = boardsData
//       } catch (error) {
//         console.error('Error loading boards:', error)
//       }
//     },
//     selectBoard(board: Board) {
//       this.currentBoard = board
//     },
//     async createList(boardId: string, listData: List) {
//       try {
//         await addList(boardId, listData.listId, listData)
//       } catch (error) {
//         console.error('Error creating list:', error)
//       }
//     },
//     async createTask(boardId: string, listId: string, taskData: Task) {
//       try {
//         await addTask(boardId, listId, taskData.taskId, taskData)
//       } catch (error) {
//         console.error('Error creating task:', error)
//       }
//     },
//     async updateTaskState(
//       boardId: string,
//       listId: string,
//       taskId: string,
//       newState: Task['state'],
//     ) {
//       try {
//         // Aquí puedes llamar a un servicio para actualizar el estado en Firebase
//         // y luego actualizar el estado local si mantienes una lista de tareas.
//       } catch (error) {
//         console.error('Error updating task state:', error)
//       }
//     },
//   },
// })

// // import { defineStore } from 'pinia'
// // import { addBoard, addList, addTask } from '../services/dbService'

// // interface Board {
// //   boardId: string
// //   title: string
// //   description?: string
// // }

// // interface List {
// //   listaId: string
// //   title: string
// //   order: number
// // }

// // interface Task {
// //   cardId: string
// //   title: string
// //   description?: string
// //   completed: boolean
// // }

// // export const useBoardStore = defineStore('board', {
// //   state: () => ({
// //     boards: [] as Board[],
// //     // Aquí podrías tener listas y tareas también
// //   }),
// //   actions: {
// //     async createBoard(boardData: Board) {
// //       try {
// //         // Suponiendo que boardData.boardId ya esté definido
// //         await addBoard(boardData.boardId, boardData)
// //         // Luego actualizas el estado local (por ejemplo, agregando a la lista de boards)
// //         this.boards.push(boardData)
// //       } catch (error) {
// //         console.error('Error creating board:', error)
// //       }
// //     },
// //     async createList(boardId: string, listData: List) {
// //       try {
// //         await addList(boardId, listData.listaId, listData)
// //         // Aquí actualizarías el estado de las listas si lo gestionas en el store
// //       } catch (error) {
// //         console.error('Error creating list:', error)
// //       }
// //     },
// //     async createTask(boardId: string, listaId: string, taskData: Task) {
// //       try {
// //         await addTask(boardId, listaId, taskData.cardId, taskData)
// //         // Actualiza el estado de las tareas en el store si es necesario
// //       } catch (error) {
// //         console.error('Error creating task:', error)
// //       }
// //     },
// //   },
// // })
