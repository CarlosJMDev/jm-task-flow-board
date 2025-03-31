<script setup lang="ts">
import { inject, ref } from 'vue'
import { useBoardStore } from '@/stores/boardStore'

const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

const props = defineProps<{
  boardId: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const boardStore = useBoardStore()

const uid = ref('')
const role = ref<'boss' | 'collaborator'>('collaborator')

const invite = async (): Promise<void> => {
  if (!uid.value) {
    alert('Introduce un UID válido.')
    return
  }
  await boardStore.inviteUser(props.boardId, { userId: uid.value, role: role.value })
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50" @click="$emit('close')"></div>
    <div
      class="bg-light-pastel-blue dark:bg-dark-fireflay dark:text-white p-6 rounded shadow-lg z-10 w-80"
    >
      <h2 class="text-xl font-bold mb-4">{{ i18n.t('users.invite') }}</h2>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">{{ i18n.t('users.uid') }}</label>
        <input v-model="uid" type="text" class="w-full p-2 border rounded" placeholder="UID" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">{{ i18n.t('users.role') }}</label>
        <select
          v-model="role"
          class="w-full p-2 border rounded bg-light-pastel-blue dark:bg-dark-fireflay"
        >
          <option value="collaborator">{{ i18n.t('users.roles.collaborator') }}</option>
          <option value="boss">{{ i18n.t('users.roles.boss') }}</option>
        </select>
      </div>
      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 border rounded">
          {{ i18n.t('common.cancel') }}
        </button>
        <button @click="invite" class="px-4 py-2 bg-blue-600 text-white rounded">
          {{ i18n.t('users.sendInvite') }}
        </button>
      </div>
    </div>
  </div>
</template>
