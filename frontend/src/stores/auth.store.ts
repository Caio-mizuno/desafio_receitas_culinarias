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
      const { access_token } = response.data.response

      token.value = access_token
      localStorage.setItem('auth_token', access_token)

      try {
        const profile = await apiClient.get<DefaultResponse<User>>('/users/profile')
        user.value = profile.data.response
      } catch {
        user.value = { id: 1, login: credentials.login }
      }

      return { success: true }
    } catch (err: any) {
      // Fallback to mock authentication when backend is not available
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Mock successful login for demo purposes
        token.value = 'mock_jwt_token_' + Date.now()
        localStorage.setItem('auth_token', token.value)
        user.value = {
          id: 1,
          login: credentials.login,
        }
        return { success: true }
      }
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
    } catch (err: any) {
      // Ignore network errors for logout
      if (err.code !== 'ERR_NETWORK' && !err.message?.includes('Network Error')) {
        console.error('Erro ao fazer logout:', err)
      }
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
