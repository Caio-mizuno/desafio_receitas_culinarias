import type { LoginCredentials } from '@/types/auth.types'
import { useAuthStore } from '@/stores/auth.store'

export async function submitLogin(credentials: LoginCredentials) {
  const authStore = useAuthStore()
  return authStore.login(credentials)
}

