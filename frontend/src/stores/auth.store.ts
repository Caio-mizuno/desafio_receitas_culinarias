import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, AuthResponse, DefaultResponse } from '@/types/auth.types'
import apiClient from '@/plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.post<DefaultResponse<AuthResponse>>('/auth/login', credentials)
      const { access_token, expires_in } = response.data.response

      token.value = access_token
      localStorage.setItem('auth_token', access_token)

      // Simular dados do usuário (em produção, vir do backend)
      user.value = {
        id: 1,
        login: credentials.login,
      }

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      await apiClient.post('/auth/logout')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
  }
})
