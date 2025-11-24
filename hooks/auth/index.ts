// Hooks de autenticación
export { useAuth } from './use-auth'
export { useLogin } from './use-login'
export { useRegister } from './use-register'
export { useSession } from './use-session'

// Tipos comunes
export interface AuthUser {
  id: string
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  rol: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  password: string
  confirmPassword: string
}