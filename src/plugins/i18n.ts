import { type App, reactive } from 'vue'

const messages = {
  en: {},
  es: {},
  cat: {},
}

const state = reactive({
  locale: localStorage.getItem('lang') || 'es',
})

export default {
  install(app: App) {
    const i18n = {
      t(key: string): string {
        const keys = key.split('.')
        let translation: any = messages[state.locale as keyof typeof messages]
        for (const k of keys) {
          if (translation && translation[k]) {
            translation = translation[k]
          } else {
            return key
          }
        }
        return translation
      },
      get locale() {
        return state.locale
      },
      set locale(newLocale: string) {
        state.locale = newLocale
        localStorage.setItem('lang', newLocale)
      },
    }
    app.provide('i18n', i18n)
    app.config.globalProperties.$i18n = i18n
  },
}
