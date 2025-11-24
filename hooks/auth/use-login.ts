"use client"

import { useState, useCallback } from 'react'

interface LoginData {
  email: string
  password: string
}

interface LoginResult {
  success: boolean
  error?: string
  token?: string
  user?: any
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (data: LoginData): Promise<LoginResult> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('auth_token', result.token)
        return {
          success: true,
          token: result.token,
          user: result.user
        }
      } else {
        return {
          success: false,
          error: result.error
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Error en el servidor'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    login,
    isLoading
  }
}