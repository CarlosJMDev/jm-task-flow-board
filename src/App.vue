<script setup lang="ts">
import { RouterView } from 'vue-router'
// import { onMounted } from 'vue'
// import { useBoardStore } from '@/stores/boardStore'
// import { useUserStore } from '@/stores/userStore'

// // useUserStore()
// // console.log('🚀 ~ App.vue:8 ~ useUserStore():', await useUserStore().user)

// const boardStore = useBoardStore()

// onMounted(() => {
//   boardStore.loadBoards()
// })
</script>

<!-- <template>
  <RouterView />
</template> -->

<template>
  <Suspense>
    <template #default>
      <!-- Todo el contenido de App.vue -->
      <router-view />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
