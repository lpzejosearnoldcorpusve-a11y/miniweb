"use client"

import { useState, useCallback } from 'react'

interface RegisterData {
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  password: string
  confirmPassword: string
}

interface RegisterResult {
  success: boolean
  error?: string
  user?: any
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)

  const register = useCallback(async (data: RegisterData): Promise<RegisterResult> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          user: result.user
        }
      } else {
        return {
          success: false,
          error: result.error
        }
      }
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        error: 'Error en el servidor'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    register,
    isLoading
  }
}