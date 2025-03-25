<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useBoardStore } from '@/stores/boardStore'

const boardStore = useBoardStore()

onMounted(() => {
  boardStore.loadBoards()
})
</script>

<template>
  <RouterView />
</template>
