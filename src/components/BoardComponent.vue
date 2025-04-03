<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBoardStore } from '@/stores/boardStore'
import { useRouter } from 'vue-router'
import type { Board } from '@/types/index'

const boardStore = useBoardStore()
const router = useRouter()

const isSidebarOpen = ref(false)
const showAll = ref(false)

const displayedBoards = computed<Board[]>(() => {
  return showAll.value ? boardStore.boards : boardStore.boards.slice(0, 3)
})

const toggleShowAll = (): void => {
  showAll.value = !showAll.value
}

const selectBoard = (board: Board): void => {
  boardStore.selectBoard(board)
  router.push({ name: 'boardView' })
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
      <nav class="relative h-full flex flex-col gap-2 p-4 overflow-hidden">
        <div v-for="board in displayedBoards" :key="board.boardId">
          <button
            @click="selectBoard(board)"
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
              class="lucide lucide-folder"
            >
              <path
                d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
              />
            </svg>
            <p :class="!isSidebarOpen ? 'hidden' : ''">{{ board.title }}</p>
          </button>
        </div>
        <button
          v-if="boardStore.boards.length > 3"
          @click="toggleShowAll"
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
          <p :class="!isSidebarOpen ? 'hidden' : ''">
            {{ showAll ? 'Ver menos' : 'Ver más' }}
          </p>
        </button>
      </nav>
    </div>
  </aside>
</template>
