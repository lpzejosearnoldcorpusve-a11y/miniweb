"use client"

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'

interface SessionState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false
  })

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }))
      return
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
      } else {
        localStorage.removeItem('auth_token')
        setState(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Session check error:', error)
      localStorage.removeItem('auth_token')
      setState(prev => ({ ...prev, isLoading: false }))
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

  const refreshSession = useCallback(async () => {
    await checkSession()
  }, [checkSession])

  return {
    ...state,
    logout,
    refreshSession,
    checkSession
  }
}