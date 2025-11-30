import { useAuthStore } from '@/stores/auth.store'

export async function logoutAndRedirect(push: (path: string) => void) {
  const authStore = useAuthStore()
  await authStore.logout()
  push('/')
}
