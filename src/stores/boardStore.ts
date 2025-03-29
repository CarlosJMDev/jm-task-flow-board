import { defineStore } from 'pinia'
import {
  addBoard,
  addList,
  addTask,
  getBoards,
  getTasks,
  updateTaskState as dbUpdateTaskState,
  deleteTask as dbDeleteTask,
  updateBoard as dbUpdateBoard,
} from '@/services/dbService'
import type { Board, List, Task, TaskState, InvitedUser } from '@/types/index'
import { useUserStore } from './userStore'

export const useBoardStore = defineStore('board', {
  state: () => ({
    boards: [] as Board[],
    currentBoard: null as Board | null,
  }),
  actions: {
    async createBoard(boardData: Board): Promise<void> {
      try {
        const userStore = useUserStore()
        const creatorEmail = userStore.user?.email
        if (!creatorEmail) {
          throw new Error('No hay usuario autenticado.')
        }
        // Asignamos el correo del creador si aún no se ha establecido.
        boardData.creatorId = boardData.creatorId || creatorEmail
        boardData.isFavorite = boardData.isFavorite || false
        boardData.isFinished = boardData.isFinished || false
        boardData.invitedUsers = boardData.invitedUsers || []
        boardData.invitedUserEmails = [creatorEmail]
        if (!boardData.lists) {
          boardData.lists = [
            { listId: boardData.boardId + '_start', title: 'start', order: 1, tasks: [] },
            { listId: boardData.boardId + '_inprocess', title: 'inprocess', order: 2, tasks: [] },
            {
              listId: boardData.boardId + '_inreview',
              title: 'inreview',
              order: 3,
              tasks: [],
            },
            { listId: boardData.boardId + '_done', title: 'done', order: 4, tasks: [] },
          ]
        }
        await addBoard(boardData.boardId, boardData)
        this.boards.push(boardData)
      } catch (error) {
        console.error('Error creating board:', error)
      }
    },
    async loadBoards(email: string): Promise<void> {
      try {
        if (!email) {
          console.error('Usuario no autenticado.')
          return
        }
        const boardsData: Board[] = await getBoards(email)
        await Promise.all(
          boardsData.map(async (board) => {
            board.isFavorite = board.isFavorite || false
            board.isFinished = board.isFinished || false
            if (!board.lists) {
              board.lists = [
                { listId: board.boardId + '_start', title: 'start', order: 1, tasks: [] },
                { listId: board.boardId + '_inprocess', title: 'inprocess', order: 2, tasks: [] },
                {
                  listId: board.boardId + '_inreview',
                  title: 'inreview',
                  order: 3,
                  tasks: [],
                },
                { listId: board.boardId + '_done', title: 'done', order: 4, tasks: [] },
              ]
            }
            await Promise.all(
              board.lists.map(async (list) => {
                const tasks = await getTasks(board.boardId, list.listId)
                list.tasks = tasks
              }),
            )
          }),
        )
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
        const board = this.boards.find((b) => b.boardId === boardId)
        if (board && board.lists) {
          const list = board.lists.find((l) => l.listId === listId)
          if (list) {
            list.tasks = list.tasks ? [...list.tasks, taskData] : [taskData]
          }
        }
      } catch (error) {
        console.error('Error creating task:', error)
      }
    },
    async updateTaskState(
      boardId: string,
      fromListId: string,
      toListId: string,
      taskId: string,
      newState: TaskState,
    ): Promise<void> {
      try {
        await dbUpdateTaskState(boardId, fromListId, toListId, taskId, newState)
        const board = this.boards.find((b) => b.boardId === boardId)
        if (board && board.lists) {
          const fromList = board.lists.find((l) => l.listId === fromListId)
          const toList = board.lists.find((l) => l.listId === toListId)
          if (fromList && toList && fromList.tasks) {
            const taskIndex = fromList.tasks.findIndex((t) => t.taskId === taskId)
            if (taskIndex !== -1) {
              const [movedTask] = fromList.tasks.splice(taskIndex, 1)
              movedTask.state = newState
              toList.tasks = toList.tasks ? [...toList.tasks, movedTask] : [movedTask]
            }
          }
        }
      } catch (error) {
        console.error('Error updating task state:', error)
      }
    },

    async deleteTask(boardId: string, listId: string, taskId: string): Promise<void> {
      try {
        await dbDeleteTask(boardId, listId, taskId)
        const board = this.boards.find((b) => b.boardId === boardId)
        if (board && board.lists) {
          const list = board.lists.find((l) => l.listId === listId)
          if (list && list.tasks) {
            list.tasks = list.tasks.filter((t) => t.taskId !== taskId)
          }
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    },
    async updateBoard(boardId: string, data: Partial<Board>): Promise<void> {
      try {
        await dbUpdateBoard(boardId, data)
        const board = this.boards.find((b) => b.boardId === boardId)
        if (board) {
          Object.assign(board, data)
        }
      } catch (error) {
        console.error('Error updating board:', error)
      }
    },
    async inviteUser(
      boardId: string,
      invitedUser: { userId: string; role: 'boss' | 'collaborator' },
    ): Promise<void> {
      try {
        const board = this.boards.find((b) => b.boardId === boardId)
        if (!board) return
        const invitedUsers = board.invitedUsers ? [...board.invitedUsers] : []
        const exists = invitedUsers.find((u) => u.userId === invitedUser.userId)
        if (!exists) {
          invitedUsers.push(invitedUser)
        } else {
          exists.role = invitedUser.role
        }

        const invitedUserEmails = board.invitedUserEmails ? [...board.invitedUserEmails] : []
        if (!invitedUserEmails.includes(invitedUser.userId)) {
          invitedUserEmails.push(invitedUser.userId)
        }
        await this.updateBoard(boardId, { invitedUsers, invitedUserEmails })
      } catch (error) {
        console.error('Error inviting user:', error)
      }
    },
  },
})
