"use client"

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  verifyToken: () => Promise<boolean>
}

interface RegisterData {
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  password: string
  confirmPassword: string
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false
  })

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      verifyToken()
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('auth_token', result.token)
        setState({
          user: result.user,
          token: result.token,
          isLoading: false,
          isAuthenticated: true
        })
        return { success: true }
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Error en el servidor' }
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setState(prev => ({ ...prev, isLoading: false }))
        return { success: true }
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Register error:', error)
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Error en el servidor' }
    }
  }, [])

  const logout = useCallback(async () => {
    const token = state.token
    if (token) {
      try {
        await fetch('/api/auth/verify', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })
      } catch (error) {
        console.error('Logout API error:', error)
      }
    }

    localStorage.removeItem('auth_token')
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false
    })
  }, [state.token])

  const verifyToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }))
      return false
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const result = await response.json()

      if (result.success) {
        setState({
          user: result.user,
          token,
          isLoading: false,
          isAuthenticated: true
        })
        return true
      } else {
        localStorage.removeItem('auth_token')
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }))
        return false
      }
    } catch (error) {
      console.error('Verify token error:', error)
      localStorage.removeItem('auth_token')
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }))
      return false
    }
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    verifyToken
  }
}