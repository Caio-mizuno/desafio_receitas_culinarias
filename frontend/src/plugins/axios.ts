import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor para adicionar token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para tratar erros
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      const currentPath = window.location.pathname
      const isLoginRoute = currentPath.startsWith('/login')
      const requestUrl: string = error.config?.url || ''
      localStorage.removeItem('auth_token')
      if (!isLoginRoute && !requestUrl.includes('/auth/login')) {
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
