<script setup lang="ts">
import { ref, onMounted } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('light')

onMounted(() => {
  if (localStorage.theme) {
    theme.value = localStorage.theme
  } else {
    theme.value = 'system'
  }
  document.documentElement.classList.toggle(
    'dark',
    localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
})

const setSystem = () => {
  localStorage.removeItem('theme')
  theme.value = 'system'
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
const setLight = () => {
  localStorage.theme = 'light'
  localStorage.system = true
  theme.value = 'light'
  document.documentElement.classList.remove('dark')
}
const setDark = () => {
  localStorage.theme = 'dark'
  theme.value = 'dark'
  document.documentElement.classList.add('dark')
}
</script>

<template>
  <div role="radiogroup" class="p-[3px] w-fit flex rounded-[9999px] border border-gray-500">
    <button
      type="button"
      role="radio"
      :class="[
        'w-8 h-8 flex items-center justify-center cursor-pointer hover:*:stroke-white dark:hover:*:stroke-light-Java hover:bg-light-Java hover:rounded-full dark:hover:bg-dark-Liver',
        theme === 'light' ? 'bg-light-desert-sand rounded-full dark:bg-dark-sidebar' : '',
      ]"
      aria-label="Switch to light theme"
      :aria-checked="theme === 'light'"
      @click="setLight()"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
      >
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        />
      </svg>
    </button>
    <button
      type="button"
      role="radio"
      :class="[
        'w-8 h-8 flex items-center justify-center cursor-pointer hover:*:stroke-white dark:hover:*:stroke-light-Java hover:bg-light-Java hover:rounded-full dark:hover:bg-dark-Liver',
        theme === 'system' ? 'bg-light-desert-sand rounded-full dark:bg-dark-sidebar' : '',
      ]"
      aria-label="Switch to system theme"
      :aria-checked="theme === 'system'"
      @click="setSystem()"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    </button>
    <button
      type="button"
      role="radio"
      :class="[
        'w-8 h-8 flex items-center justify-center cursor-pointer hover:*:stroke-white dark:hover:*:stroke-light-Java hover:bg-light-Java hover:rounded-full dark:hover:bg-dark-Liver',
        theme === 'dark' ? 'bg-light-desert-sand rounded-full dark:bg-dark-sidebar' : '',
      ]"
      aria-label="Switch to dark theme"
      :aria-checked="theme === 'dark'"
      @click="setDark()"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  </div>
</template>
