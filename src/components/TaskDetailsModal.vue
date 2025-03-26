<script setup lang="ts">
import { ref, inject } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useBoardStore } from '@/stores/boardStore'
import type { Task, TaskState } from '@/types/index'

const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

const props = defineProps<{
  task: Task
  boardId: string | undefined
}>()

const emit = defineEmits<{ (e: 'close-modal'): void }>()
const boardStore = useBoardStore()
const userStore = useUserStore()

const newState = ref<TaskState>(props.task.state)

const closeModal = (): void => {
  emit('close-modal')
}

const submitChange = async (): Promise<void> => {
  // Validar que solo el usuario con rol adecuado pueda pasar a "done"
  if (newState.value === 'done' && !userStore.isOwnerOrBoss) {
    alert(i18n.t('task.permission'))
    return
  }
  if (props.boardId) {
    const fromListId =
      props.task.state === 'start'
        ? props.boardId + '_start'
        : props.task.state === 'inprocess'
          ? props.boardId + '_inprocess'
          : props.task.state === 'inreview'
            ? props.boardId + '_inreview'
            : props.boardId + '_done'

    const toListId =
      newState.value === 'start'
        ? props.boardId + '_start'
        : newState.value === 'inprocess'
          ? props.boardId + '_inprocess'
          : newState.value === 'inreview'
            ? props.boardId + '_inreview'
            : props.boardId + '_done'

    await boardStore.updateTaskState(
      props.boardId,
      fromListId,
      toListId,
      props.task.taskId,
      newState.value,
    )
    closeModal()
  }
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50" @click="closeModal"></div>
    <div
      class="bg-light-pastel-blue dark:bg-dark-fireflay p-6 rounded-lg z-10 w-80 shadow-lg dark:text-dark-iron"
    >
      <h2 class="text-xl font-bold mb-4">{{ i18n.t('task.details') }}</h2>
      <p class="mb-2">
        <strong>{{ i18n.t('common.title') }}:</strong> {{ task.title }}
      </p>
      <p class="mb-2">
        <strong>{{ i18n.t('common.description') }}:</strong> {{ task.description }}
      </p>
      <p class="mb-2">
        <strong>{{ i18n.t('common.deadline') }}:</strong>
        {{ new Date(task.deadline).toLocaleDateString() }}
      </p>
      <p class="mb-4">
        <strong>{{ i18n.t('task.state.actual') }}:</strong> {{ i18n.t(`task.state.${task.state}`) }}
      </p>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">{{ i18n.t('task.state.change') }}</label>
        <select
          v-model="newState"
          class="w-full p-2 border rounded bg-light-pastel-blue dark:bg-dark-fireflay"
        >
          <option
            value="start"
            class="checked:bg-light-desert-sand dark:checked:bg-dark-faded-jade"
          >
            {{ i18n.t('task.state.start') }}
          </option>
          <option
            value="inprocess"
            class="checked:bg-light-desert-sand dark:checked:bg-dark-faded-jade"
          >
            {{ i18n.t('task.state.inprocess') }}
          </option>
          <option
            value="inreview"
            class="checked:bg-light-desert-sand dark:checked:bg-dark-faded-jade"
          >
            {{ i18n.t('task.state.inreview') }}
          </option>
          <option value="done" class="checked:bg-light-desert-sand dark:checked:bg-dark-faded-jade">
            {{ i18n.t('task.state.done') }}
          </option>
        </select>
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" @click="closeModal" class="px-4 py-2 border rounded">
          {{ i18n.t('common.cancel') }}
        </button>
        <button
          type="button"
          @click="submitChange"
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {{ i18n.t('task.state.update') }}
        </button>
      </div>
    </div>
  </div>
</template>
