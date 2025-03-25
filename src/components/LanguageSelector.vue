<script setup lang="ts">
import { ref, inject } from 'vue'

type LanguageMap = Record<string, string>

type I18nContext = {
  t: (key: string) => string
  locale: string
}

const i18n = inject<I18nContext>('i18n')

const languages: LanguageMap = {
  en: 'English',
  es: 'Español',
  cat: 'Català',
}

const selectedLanguage = ref(i18n?.locale ?? 'en')
const isOpen = ref(false)

const changeLanguage = (lang: string) => {
  if (i18n) {
    selectedLanguage.value = lang
    i18n.locale = lang
  }
  isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block w-18 dark:text-white">
    <div class="flex w-full items-center cursor-pointer" @click="isOpen = !isOpen">
      <button class="bg-transparent p-2 text-lg border-none cursor-pointer">
        {{ selectedLanguage.toUpperCase() }}
      </button>
      <span class="ml-2">&#9662;</span>
    </div>
    <div
      v-show="isOpen"
      class="absolute bg-light-pastel-blue dark:bg-dark-fireflay dark:text-white text-black min-w-4 shadow-md z-10 border border-light-desert-sand dark:border-dark-neptune rounded-b-2xl"
    >
      <a
        v-for="(label, lang) in languages"
        :key="lang"
        class="p-4 block hover:bg-light-desert-sand dark:hover:bg-dark-neptune hover:bg-opacity-20 last:rounded-b-2xl"
        href="#"
        @click.prevent="changeLanguage(lang)"
      >
        {{ label }}
      </a>
    </div>
  </div>
</template>
