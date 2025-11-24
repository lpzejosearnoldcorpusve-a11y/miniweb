"use client"

import useSWR from "swr"
import type { User } from "@/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Hook para obtener todos los usuarios
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("/api/users", fetcher)

  return {
    users: data || [],
    isLoading,
    isError: error,
    mutate,
    refetch: mutate
  }
}

// Hook para obtener un usuario específico
export function useUser(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    id ? `/api/users/${id}` : null,
    fetcher
  )

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
    refetch: mutate
  }
}