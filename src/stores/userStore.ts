// store/userStore.ts
import { defineStore } from 'pinia'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { addUser } from '../services/dbService'
import type { UserData } from '../types/index'

interface UserState {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loginWithGoogle(): Promise<void> {
      this.loading = true
      this.error = null
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        this.user = result.user
        const userData: UserData = {
          name: result.user.displayName || '',
          email: result.user.email || '',
          avatar: result.user.photoURL || '',
        }
        await addUser(result.user.uid, userData)
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Unknown error occurred'
        }
      } finally {
        this.loading = false
      }
    },
    async logout(): Promise<void> {
      const auth = getAuth()
      try {
        await signOut(auth)
        this.user = null
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error al cerrar sesión:', error.message)
        } else {
          console.error('Error al cerrar sesión:', error)
        }
      }
    },
  },
})
