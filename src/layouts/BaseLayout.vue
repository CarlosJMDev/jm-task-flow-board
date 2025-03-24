<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
</script>

<template>
  <div
    class="relative min-w-screen min-h-screen flex flex-col justify-between items-center m-auto overflow-x-hidden z-0 bg-light-snow dark:bg-dark-black-pearl"
  >
    <SidebarComponent />
    <div
      class="w-full min-h-screen flex flex-col justify-between items-center transition-all duration-300"
    >
      <HeaderComponent />
      <main class="w-full h-full flex flex-col justify-center items-center">
        <slot />
      </main>
      <FooterComponent />
    </div>
  </div>
</template>
