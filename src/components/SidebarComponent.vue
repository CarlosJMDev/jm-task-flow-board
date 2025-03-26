<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores/boardStore'
import CreateBoardModal from '@/components/CreateBoardModal.vue'
import type { Board } from '@/types/index'
import { useUserStore } from '../stores/userStore'

const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

const boardStore = useBoardStore()
const userStore = useUserStore()
const router = useRouter()

const isSidebarOpen = ref(false)
const showAllGeneral = ref(false)
const showAllFavorites = ref(false)
const showAllFinished = ref(false)
const showCreateBoardModal = ref(false)

// Filtros basados en las propiedades de cada board:
const generalBoards = computed<Board[]>(() =>
  boardStore.boards.filter((board) => !board.isFinished),
)

const favoriteBoards = computed<Board[]>(() =>
  boardStore.boards.filter((board) => board.isFavorite),
)

const finishedBoards = computed<Board[]>(() =>
  boardStore.boards.filter((board) => board.isFinished),
)

// Limitar a 3 elementos y permitir "Ver más":
const displayedGeneral = computed<Board[]>(() =>
  showAllGeneral.value ? generalBoards.value : generalBoards.value.slice(0, 3),
)

const displayedFavorites = computed<Board[]>(() =>
  showAllFavorites.value ? favoriteBoards.value : favoriteBoards.value.slice(0, 3),
)

const displayedFinished = computed<Board[]>(() =>
  showAllFinished.value ? finishedBoards.value : finishedBoards.value.slice(0, 3),
)

const toggleShowGeneral = (): void => {
  showAllGeneral.value = !showAllGeneral.value
}
const toggleShowFavorites = (): void => {
  showAllFavorites.value = !showAllFavorites.value
}
const toggleShowFinished = (): void => {
  showAllFinished.value = !showAllFinished.value
}

const selectBoard = (board: Board): void => {
  boardStore.selectBoard(board)
  router.push({ name: 'boardview', params: { id: board.boardId } })
}

const toggleFavorite = async (board: Board): Promise<void> => {
  const newFav = !board.isFavorite
  await boardStore.updateBoard(board.boardId, { isFavorite: newFav })
}

const logout = (): void => {
  router.push({ name: 'auth' })
  userStore.logout()
}
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full bg-light-pastel-blue dark:bg-dark-fireflay dark:text-white transition-all duration-300"
    :class="isSidebarOpen ? 'w-60' : 'w-16'"
  >
    <div class="relative flex flex-col h-full">
      <button
        @click="isSidebarOpen = !isSidebarOpen"
        class="p-4.5 text-black dark:text-white hover:bg-light-desert-sand dark:hover:bg-dark-neptune w-full cursor-pointer"
      >
        ☰
      </button>

      <div class="p-2 flex flex-col gap-2">
        <h3
          class="text-sm font-bold flex gap-3 items-center hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded py-1 px-2 cursor-pointer"
          :class="isSidebarOpen ? 'justify-between' : 'justify-center'"
        >
          <div class="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-folder"
            >
              <path
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
              />
            </svg>
            <span v-if="isSidebarOpen">{{ i18n.t('sidebar.projects') }}</span>
          </div>
          <button
            v-if="isSidebarOpen"
            @click.stop="showCreateBoardModal = true"
            class="p-1 rounded hover:bg-light-desert-sand dark:hover:bg-dark-neptune cursor-pointer hover:scale-125"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.5 7.5h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1z"
              />
            </svg>
          </button>
        </h3>
        <template v-if="isSidebarOpen">
          <div
            v-for="board in displayedGeneral"
            :key="board.boardId"
            class="flex items-center justify-between hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded-xl"
          >
            <button
              @click="selectBoard(board)"
              class="w-full p-2 rounded flex gap-3 cursor-pointer"
            >
              <p v-if="isSidebarOpen">{{ board.title }}</p>
            </button>
            <button @click.stop="toggleFavorite(board)" class="p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                :fill="board.isFavorite ? 'red' : 'none'"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-heart cursor-pointer"
              >
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
              </svg>
            </button>
          </div>
          <button
            v-if="generalBoards.length > 3"
            @click="toggleShowGeneral"
            class="w-full p-2 hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded flex gap-3 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <p v-if="isSidebarOpen">
              {{ showAllGeneral ? i18n.t('limit.seeLess') : i18n.t('limit.seeMore') }}
            </p>
          </button>
        </template>
      </div>

      <div class="p-2">
        <h3
          class="text-sm font-bold flex gap-3 items-center hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded py-1 cursor-pointer px-2"
          :class="isSidebarOpen ? 'justify-start' : 'justify-center'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-heart"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            />
          </svg>
          <p v-if="isSidebarOpen">{{ i18n.t('sidebar.favorites') }}</p>
        </h3>
        <div v-for="board in displayedFavorites" :key="board.boardId">
          <template v-if="isSidebarOpen">
            <button
              @click="selectBoard(board)"
              class="w-full p-2 hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded-xl flex gap-3 cursor-pointer"
            >
              <p v-if="isSidebarOpen">{{ board.title }}</p>
            </button>
            <button
              v-if="favoriteBoards.length > 3"
              @click="toggleShowFavorites"
              class="w-full p-2 hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded flex gap-3 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevron-down"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <p v-if="isSidebarOpen">
                {{ showAllFavorites ? i18n.t('limit.seeLess') : i18n.t('limit.seeMore') }}
              </p>
            </button>
          </template>
        </div>
      </div>

      <div class="p-2">
        <h3
          class="text-sm font-bold flex gap-3 items-center hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded py-1 cursor-pointer px-2"
          :class="isSidebarOpen ? 'justify-start' : 'justify-center'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-bookmark-check"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
            <path d="m9 10 2 2 4-4" />
          </svg>
          <p v-if="isSidebarOpen">{{ i18n.t('sidebar.ended') }}</p>
        </h3>
        <div
          v-for="board in displayedFinished"
          :key="board.boardId"
          class="flex items-center justify-between hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded-xl"
        >
          <template v-if="isSidebarOpen">
            <button @click="selectBoard(board)" class="w-full p-2 flex gap-3 cursor-pointer">
              <p v-if="isSidebarOpen">{{ board.title }}</p>
            </button>
            <button @click.stop="toggleFavorite(board)" class="p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                :fill="board.isFavorite ? 'red' : 'none'"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-heart"
              >
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
              </svg>
            </button>
          </template>
        </div>
        <button
          v-if="finishedBoards.length > 3"
          @click="toggleShowFinished"
          class="w-full p-2 hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded flex gap-3 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-down"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <p v-if="isSidebarOpen">
            {{ showAllFinished ? i18n.t('limit.seeLess') : i18n.t('limit.seeMore') }}
          </p>
        </button>
      </div>

      <div class="mt-auto p-2">
        <button
          @click="logout"
          class="w-full p-2 hover:bg-light-desert-sand dark:hover:bg-dark-neptune rounded flex gap-3 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <p v-if="isSidebarOpen">{{ i18n.t('sidebar.logout') }}</p>
        </button>
      </div>
    </div>
    <CreateBoardModal v-if="showCreateBoardModal" @closeModal="showCreateBoardModal = false" />
  </aside>
</template>
