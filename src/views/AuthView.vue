<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default defineComponent({
  name: 'AuthView',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const i18n = inject('i18n') as { t: (key: string) => string; locale: string }

    const signInWithGoogle = async () => {
      await userStore.loginWithGoogle()
      if (userStore.user) {
        router.push('/BoardView/1')
      }
    }

    const signInWithGithub = async () => {
      await userStore.loginWithGithub()
      if (userStore.user) {
        window.location.href = '/BoardView/1'
      }
    }

    return { signInWithGoogle, signInWithGithub, i18n }
  },
})
</script>

<template>
  <div
    class="min-w-screen min-h-screen flex flex-col items-center justify-center gap-5 rounded-sm bg-light-snow p-5 text-center bg-[radial-gradient(#3d3d3d_1px,_transparent_0)] [background-size:20px_20px] bg-[0_0,_10px_10px]"
  >
    <div class="flex flex-col gap-6 bg-light-snow border-2 rounded-lg p-8">
      <h1 class="font-bold text-2xl text-light-black-coral">Task Flow Board</h1>
      <p class="font-bold text-xl flex flex-col text-[#323232]">
        {{ i18n.t('auth.welcome')
        }}<span class="text-[#666] font-semibold text-lg">{{ i18n.t('auth.sign') }}</span>
      </p>
      <button
        @click.prevent="signInWithGoogle"
        class="flex justify-center items-center gap-[5px] w-[250px] h-[40px] rounded-[5px] border-[2px] border-[#323232] [box-shadow:4px_4px_#323232] text-[16px] font-semibold cursor-pointer [transition:all_250ms] relative overflow-hidden before:content-[''] before:absolute before:top-[0] before:left-[0] before:h-full before:w-[0] before:bg-[#212121] before:[box-shadow:4px_8px_19px_-3px_rgba(0,_0,_0,_0.27)] before:[transition:all_250ms] hover:text-white hover:before:w-full"
      >
        <svg class="w-6 h-6 z-10" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          ></path>
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          ></path>
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          ></path>
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          ></path>
          <path d="M1 1h22v22H1z" fill="none"></path>
        </svg>
        <p class="z-10">{{ i18n.t('auth.signGoogle') }}</p>
      </button>
      <div class="w-full flex items-center justify-center gap-1.5">
        <div class="w-24 h-1 rounded-sm bg-[#666]"></div>
        <span class="text-[#323232] font-semibold">{{ i18n.t('auth.or') }}</span>
        <div class="w-24 h-1 rounded-sm bg-[#666]"></div>
      </div>
      <button
        @click.prevent="signInWithGithub"
        class="flex justify-center items-center gap-[5px] w-[250px] h-[40px] rounded-[5px] border-[2px] border-[#323232] [box-shadow:4px_4px_#323232] text-[16px] font-semibold cursor-pointer [transition:all_250ms] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:bg-[#212121] before:[box-shadow:4px_8px_19px_-3px_rgba(0,_0,_0,_0.27)] before:[transition:all_250ms] hover:text-white hover:before:w-full hover:fill-white"
      >
        <svg class="w-6 h-6 z-10" viewBox="0 0 24 24">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          ></path>
        </svg>
        <p class="z-10">{{ i18n.t('auth.signGithub') }}</p>
      </button>
    </div>
  </div>
</template>
