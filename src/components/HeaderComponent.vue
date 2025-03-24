<script setup lang="ts">
import LanguageSelector from './LanguageSelector.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
</script>

<template>
  <header
    class="w-full flex justify-around items-center gap-2 px-8 py-2 bg-light-pastel-blue dark:bg-dark-fireflay dark:text-white"
  >
    <ThemeSwitcher />
    <h1 class="flex text-xl font-bold">TaskFlowBoard</h1>
    <LanguageSelector />
  </header>
</template>
