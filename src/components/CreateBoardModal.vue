<script setup lang="ts">
import { ref, inject } from 'vue'
import { useBoardStore } from '@/stores/boardStore'
import type { Board } from '@/types/index'

const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

const emit = defineEmits<{ (e: 'closeModal'): void }>()

const boardStore = useBoardStore()

const title = ref('')
const description = ref('')

const closeModal = () => {
  emit('closeModal')
}

const submitForm = async () => {
  const boardId = Date.now().toString()
  const newBoard: Board = {
    boardId,
    title: title.value,
    description: description.value,
    creationDate: new Date(),
  }
  await boardStore.createBoard(newBoard)
  closeModal()
}
</script>
<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50" @click="closeModal"></div>
    <div class="bg-light-pastel-blue dark:bg-dark-fireflay p-6 rounded shadow-lg z-10 w-80">
      <h2 class="text-xl font-bold mb-4">{{ i18n.t('projects.add') }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium mb-1">{{
            i18n.t('common.title')
          }}</label>
          <input
            id="title"
            type="text"
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
            v-model="description"
            class="w-full p-2 border rounded"
            required
          ></textarea>
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
