<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import draggable from 'vuedraggable'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useBoardStore } from '@/stores/boardStore'
import CreateTaskModal from '@/components/CreateTaskModal.vue'
import TaskDetailsModal from '@/components/TaskDetailsModal.vue'
import InviteUserModal from '@/components/InviteUserModal.vue'
import type { Task, TaskState, List, InvitedUser } from '@/types/index'
import { useUserStore } from '@/stores/userStore'

const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

const userStore = useUserStore()
const boardStore = useBoardStore()
const currentBoard = computed(() => boardStore.currentBoard)

const showCreateTaskModal = ref(false)
const showTaskDetailsModal = ref(false)
const showInviteUserModal = ref(false)
const selectedTask = ref<Task | null>(null)

const boardLists = computed<List[]>(() =>
  currentBoard.value && currentBoard.value.lists
    ? [...currentBoard.value.lists].sort((a, b) => a.order - b.order)
    : [],
)

const openCreateTaskModal = (): void => {
  showCreateTaskModal.value = true
}

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

const changeInvitedRole = async (
  invited: InvitedUser,
  newRole: 'boss' | 'collaborator',
): Promise<void> => {
  if (currentBoard.value) {
    // Actualizamos el array de invitedUsers en el board
    const updatedInvited = currentBoard.value.invitedUsers?.map((user) =>
      user.userId === invited.userId ? { ...user, role: newRole } : user,
    )
    await boardStore.updateBoard(currentBoard.value.boardId, { invitedUsers: updatedInvited })
  }
}

const onDragEnd = async (event: {
  from: HTMLElement
  to: HTMLElement
  item: HTMLElement
}): void => {
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
      await boardStore.updateTaskState(
        currentBoard.value.boardId,
        fromListId,
        toListId,
        taskId,
        newState,
      )
    }
  }
}
</script>

<template>
  <BaseLayout>
    <div class="max-w-[min(80%,1200px)] h-full flex flex-col">
      <header class="w-full p-4 border-b dark:text-white">
        <h1 class="text-2xl font-bold">
          {{ currentBoard ? currentBoard.title : i18n.t('board.select') }}
        </h1>
        <p class="text-light-black-coral dark:text-dark-iron">
          {{ currentBoard ? currentBoard.description : '' }}
        </p>
      </header>

      <div v-if="currentBoard" class="p-4 flex justify-end gap-4">
        <button @click="openCreateTaskModal" class="px-4 py-2 bg-green-600 text-white rounded">
          + {{ i18n.t('task.newTask') }}
        </button>
        <button
          @click="showInviteUserModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded"
        >
          {{ i18n.t('users.add') }}
        </button>
      </div>

      <main v-if="currentBoard" class="flex flex-col lg:flex-row gap-4 overflow-x-auto p-4">
        <div
          v-for="list in boardLists"
          :key="list.listId"
          class="flex flex-col bg-light-pastel-blue dark:bg-dark-neptune p-4 rounded min-w-[200px]"
          :data-list-id="list.listId"
        >
          <h2 class="font-bold mb-2 capitalize">{{ i18n.t(`task.state.${list.title}`) }}</h2>
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
            {{ i18n.t('task.empty') }}
          </div>
        </div>
        <!-- Sección de usuarios invitados (sólo se muestra si hay invitados) -->
        <div
          v-if="currentBoard && currentBoard.invitedUsers && currentBoard.invitedUsers.length"
          class="p-4 border-t mt-4"
        >
          <!-- <h3 class="text-lg font-bold mb-2">{{ i18n.t('board.invitedUsers') }}</h3> -->
          <h3 class="text-lg font-bold mb-2">Users</h3>
          <ul>
            <li
              v-for="invited in currentBoard.invitedUsers"
              :key="invited.userId"
              class="flex items-center gap-2"
            >
              <span
                >{{ invited.userId }} - <em>{{ invited.role }}</em></span
              >
              <!-- Si el usuario actual es el creador, permite cambiar el rol -->
              <template v-if="currentBoard.creatorId === userStore.user?.uid">
                <select
                  v-model="invited.role"
                  @change="changeInvitedRole(invited, invited.role)"
                  class="border rounded p-1"
                >
                  <option value="collaborator">{{ i18n.t('board.collaborator') }}</option>
                  <option value="boss">{{ i18n.t('board.boss') }}</option>
                </select>
              </template>
            </li>
          </ul>
        </div>
      </main>
      <p v-else class="p-4 dark:text-dark-iron">
        {{ i18n.t('board.selectSidebar') }}
      </p>
    </div>

    <div v-if="currentBoard" class="p-4 flex justify-end gap-2">
      <button
        v-if="!currentBoard.isFinished"
        @click="boardStore.updateBoard(currentBoard.boardId, { isFinished: true })"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {{ i18n.t('board.endBoard') }}
      </button>
      <button
        v-else
        @click="boardStore.updateBoard(currentBoard.boardId, { isFinished: false })"
        class="px-4 py-2 bg-gray-600 text-white rounded"
      >
        {{ i18n.t('board.reopen') }}
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

    <InviteUserModal
      v-if="showInviteUserModal && currentBoard"
      :boardId="currentBoard.boardId"
      @close="showInviteUserModal = false"
    />
  </BaseLayout>
</template>
