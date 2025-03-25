<script setup lang="ts">
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useBoardStore } from '@/stores/boardStore'
import CreateTaskModal from '@/components/CreateTaskModal.vue'
import TaskDetailsModal from '@/components/TaskDetailsModal.vue'
import type { Task, TaskState, List } from '@/types/index'

const boardStore = useBoardStore()
const currentBoard = computed(() => boardStore.currentBoard)

// Variables para controlar la visibilidad de los modales
const showCreateTaskModal = ref(false)
const showTaskDetailsModal = ref(false)
const selectedTask = ref<Task | null>(null)

// Ordenamos las listas por "order" si existen; si no, devolvemos un arreglo vacío
const boardLists = computed<List[]>(() =>
  currentBoard.value && currentBoard.value.lists
    ? [...currentBoard.value.lists].sort((a, b) => a.order - b.order)
    : [],
)

// Función para abrir el modal de creación de tarea.
// La nueva tarea se asignará a la lista correspondiente a "inicio"
const openCreateTaskModal = (): void => {
  showCreateTaskModal.value = true
}

// Función para abrir el modal de detalles de tarea
const openTaskModal = (task: Task): void => {
  selectedTask.value = task
  showTaskDetailsModal.value = true
}

const deleteTask = async (listId: string, taskId: string): Promise<void> => {
  if (currentBoard.value) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      await boardStore.deleteTask(currentBoard.value.boardId, listId, taskId)
    }
  }
}

// Función para manejar drag & drop de tareas
const onDragEnd = (event: { from: HTMLElement; to: HTMLElement; item: HTMLElement }): void => {
  const { from, to, item } = event
  if (from !== to) {
    const fromListId = from.getAttribute('data-list-id') || ''
    const toListId = to.getAttribute('data-list-id') || ''
    const taskId = item.getAttribute('data-task-id') || ''
    const newState: TaskState = toListId.includes('_inprocess')
      ? 'inprocess'
      : toListId.includes('_inreview')
        ? 'inreview'
        : toListId.includes('_done')
          ? 'done'
          : 'start'
    if (currentBoard.value && fromListId && toListId && taskId) {
      boardStore.updateTaskState(currentBoard.value.boardId, fromListId, toListId, taskId, newState)
    }
  }
}
</script>

<template>
  <BaseLayout>
    <div class="max-w-[min(80%,1200px)] h-full flex flex-col">
      <header class="w-full p-4 border-b dark:text-white">
        <h1 class="text-2xl font-bold">
          {{ currentBoard ? currentBoard.title : 'Selecciona un proyecto' }}
        </h1>
        <p class="text-light-black-coral dark:text-dark-iron">
          {{ currentBoard ? currentBoard.description : '' }}
        </p>
      </header>

      <div v-if="currentBoard" class="p-4 flex justify-end">
        <button @click="openCreateTaskModal" class="px-4 py-2 bg-green-600 text-white rounded">
          + Nueva Tarea
        </button>
      </div>

      <main v-if="currentBoard" class="flex flex-col lg:flex-row gap-4 overflow-x-auto p-4">
        <div
          v-for="list in boardLists"
          :key="list.listId"
          class="flex flex-col bg-light-pastel-blue dark:bg-dark-neptune p-4 rounded min-w-[200px]"
          :data-list-id="list.listId"
        >
          <h2 class="font-bold mb-2 capitalize">{{ list.title }}</h2>
          <div :data-list-id="list.listId" class="flex-1 min-h-[150px]">
            <draggable
              v-model="list.tasks"
              :group="{ name: 'tasks', pull: true, put: true }"
              tag="div"
              :data-list-id="list.listId"
              item-key="taskId"
              @end="onDragEnd"
            >
              <template #item="{ element }">
                <div
                  class="p-2 mb-2 bg-light-desert-sand dark:bg-dark-faded-jade rounded cursor-pointer flex gap-2 items-center justify-between"
                  @click="openTaskModal(element)"
                  :data-task-id="element.taskId"
                >
                  <div>
                    <p class="font-medium">{{ element.title }}</p>
                    <p class="text-xs text-light-black-coral font-bold dark:text-dark-iron">
                      {{ new Date(element.deadline).toLocaleDateString() }}
                    </p>
                  </div>
                  <button
                    @click.stop="deleteTask(list.listId, element.taskId)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2h3.5l.5-1h3l.5 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0 0 1H3v-.5a.5.5 0 0 0-.5-.5h-0z"
                      />
                    </svg>
                  </button>
                </div>
              </template>
            </draggable>
          </div>
          <div v-if="!(list.tasks && list.tasks.length)" class="text-sm text-gray-500 italic">
            Sin tareas
          </div>
        </div>
      </main>
      <p v-else class="p-4 dark:text-dark-iron">
        Por favor, selecciona un proyecto desde el sidebar.
      </p>
    </div>

    <div v-if="currentBoard" class="p-4 flex justify-end gap-2">
      <button
        v-if="!currentBoard.isFinished"
        @click="boardStore.updateBoard(currentBoard.boardId, { isFinished: true })"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Marcar como Acabado
      </button>
      <button
        v-else
        @click="boardStore.updateBoard(currentBoard.boardId, { isFinished: false })"
        class="px-4 py-2 bg-gray-600 text-white rounded"
      >
        Reabrir Proyecto
      </button>
    </div>

    <CreateTaskModal
      v-if="showCreateTaskModal"
      :boardId="currentBoard?.boardId"
      :list="boardLists.find((l) => l.title.toLowerCase() === 'start')"
      @close-modal="showCreateTaskModal = false"
    />

    <TaskDetailsModal
      v-if="showTaskDetailsModal && selectedTask"
      :task="selectedTask"
      :boardId="currentBoard?.boardId"
      @close-modal="showTaskDetailsModal = false"
    />
  </BaseLayout>
</template>
