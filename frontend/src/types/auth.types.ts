export interface User {
  id: number
  login: string
  email?: string
  createdAt?: string
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
