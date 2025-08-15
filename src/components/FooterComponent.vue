<script setup lang="ts">
import { inject } from 'vue'
const i18n = inject('i18n') as { t: (key: string) => string; locale: string }
</script>

<template>
  <footer class="flex flex-col items-center">
    <span
      class="bg-light-Java dark:bg-dark-Liver p-3 px-8 mt-10 rounded-t-3xl text-light-Black dark:text-gray-200"
      >{{ i18n.t('footer') }}</span
    >
    <a
      class="bg-light-Java dark:bg-dark-Liver p-2 px-8 rounded-t-3xl text-light-Black dark:text-gray-200 hover:underlines"
      href="https://carlosjm.pages.dev/"
      >{{ i18n.t('jmdev') }}</a
    >
    >
  </footer>
</template>
