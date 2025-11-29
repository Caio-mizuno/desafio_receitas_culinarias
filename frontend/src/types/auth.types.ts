export interface User {
  id: number
  login: string
  email?: string
  createdAt?: string
  nome?: string
  criadoEm?: string
  receitasCriadas?: number
  categoriasUtilizadas?: number
}

export interface LoginCredentials {
  login: string
  senha: string
}

export interface AuthResponse {
  access_token: string
  expires_in: number
}

export interface DefaultResponse<T> {
  response: T
  message: string
  status: boolean
}

export interface DefaultPaginationResponse<T> {
  response: T
  page: number
  total: number
  status: boolean
}

export interface RegisterCredentials {
  nome: string
  login: string
  senha: string
}
