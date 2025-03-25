<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/boardStore'
import type { List, Task } from '@/types/index'

const props = defineProps<{
  boardId: string | undefined
  list: List | undefined
}>()

const emit = defineEmits<{ (e: 'close-modal'): void }>()
const boardStore = useBoardStore()

const today = new Date().toISOString().split('T')[0]
const title = ref('')
const description = ref('')
const deadline = ref(today)

const closeModal = (): void => {
  emit('close-modal')
}

const submitForm = async (): Promise<void> => {
  if (!props.boardId || !props.list) {
    alert('No se ha seleccionado un board o la lista de "inicio" no está definida.')
    return
  }
  // Genera un ID para la tarea
  const taskId = Date.now().toString()
  const newTask: Task = {
    taskId,
    title: title.value,
    description: description.value,
    state: 'start',
    createdAt: new Date(),
    deadline: new Date(deadline.value),
  }
  await boardStore.createTask(props.boardId, props.list.listId, newTask)
  closeModal()
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-light-black-coral opacity-50" @click="closeModal"></div>
    <div
      class="bg-light-pastel-blue dark:bg-dark-fireflay dark:text-dark-iron p-6 rounded-lg shadow-lg z-10 w-80"
    >
      <h2 class="text-xl font-bold mb-4">Nueva Tarea</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium mb-1">Título</label>
          <input
            id="title"
            type="text"
            placeholder="Título de la tarea"
            v-model="title"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            id="description"
            placeholder="Descripción de la tarea"
            v-model="description"
            class="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="deadline" class="block text-sm font-medium mb-1">Fecha Límite</label>
          <input
            id="deadline"
            type="date"
            :min="today"
            v-model="deadline"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal" class="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            Crear Tarea
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
