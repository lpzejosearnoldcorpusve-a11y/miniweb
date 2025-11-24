"use client"

import { useState, useCallback } from 'react'
import type { User, NewUser } from '@/types'

export interface ApiResponse<T = any> {
  success: boolean
  error?: string
  data?: T
}

// Hook para crear usuarios
export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false)

  const createUser = useCallback(async (userData: NewUser): Promise<ApiResponse<User>> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const result = await response.json()

      return {
        success: result.success,
        error: result.error,
        data: result.user
      }
    } catch (error) {
      console.error('Create user error:', error)
      return {
        success: false,
        error: 'Error en el servidor'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createUser,
    isLoading
  }
}

// Hook para actualizar usuarios
export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false)

  const updateUser = useCallback(async (
    id: string,
    userData: Partial<NewUser>
  ): Promise<ApiResponse<User>> => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const result = await response.json()

      return {
        success: result.success,
        error: result.error,
        data: result.user
      }
    } catch (error) {
      console.error('Update user error:', error)
      return {
        success: false,
        error: 'Error en el servidor'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    updateUser,
    isLoading
  }
}

// Hook para eliminar usuarios
export function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false)

  const deleteUser = useCallback(async (id: string): Promise<ApiResponse> => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      return {
        success: result.success,
        error: result.error
      }
    } catch (error) {
      console.error('Delete user error:', error)
      return {
        success: false,
        error: 'Error en el servidor'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    deleteUser,
    isLoading
  }
}