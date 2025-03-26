<script setup lang="ts">
import { ref, inject } from 'vue'
import { useBoardStore } from '@/stores/boardStore'
import type { List, Task } from '@/types/index'

const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

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
    alert(i18n.t('alert'))
    return
  }

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
      <h2 class="text-xl font-bold mb-4">{{ i18n.t('task.newTask') }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium mb-1">{{
            i18n.t('common.title')
          }}</label>
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
          <label for="description" class="block text-sm font-medium mb-1">{{
            i18n.t('common.description')
          }}</label>
          <textarea
            id="description"
            placeholder="Descripción de la tarea"
            v-model="description"
            class="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="deadline" class="block text-sm font-medium mb-1">{{
            i18n.t('common.deadline')
          }}</label>
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
            {{ i18n.t('common.cancel') }}
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            {{ i18n.t('common.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
