import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, AuthResponse, DefaultResponse, RegisterCredentials } from '@/types/auth.types'
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
      console.error('Login error:', err)
      error.value = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      if (token.value) {
        await apiClient.post('/auth/logout')
      }
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      loading.value = false
    }
  }

  const register = async (payload: RegisterCredentials) => {
    loading.value = true
    error.value = null

    try {
      await apiClient.post<DefaultResponse<User>>('/users', payload)
      return await login({ login: payload.login, senha: payload.senha })
    } catch (err: any) {
      console.error('Register error:', err)
      error.value = err.response?.data?.message || 'Erro ao cadastrar usuário'
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      const profile = await apiClient.get<DefaultResponse<User>>('/users/profile')
      user.value = profile.data.response
      return profile.data.response
    } catch (err: any) {
      console.error('Fetch profile error:', err)
      // Clear authentication on profile fetch error
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      throw err
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
    register,
    fetchProfile,
    clearError,
  }
})
