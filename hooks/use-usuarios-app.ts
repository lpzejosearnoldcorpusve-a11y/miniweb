"use client"

import useSWR, { mutate } from "swr"
import type { UsuarioAppWithTarjetas, ApiResponse, NewUsuarioApp } from "@/types"

const API_BASE = "/api/usuarios-app"

// Fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Error al obtener datos")
  const data = await res.json()
  return data
}

// Hook para obtener todos los usuarios app
export function useUsuariosApp() {
  const { data, error, isLoading, isValidating } = useSWR<ApiResponse<UsuarioAppWithTarjetas[]>>(API_BASE, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  return {
    usuarios: data?.data || [],
    isLoading,
    isValidating,
    isError: error || !data?.success,
    error: error?.message || data?.error,
    refresh: () => mutate(API_BASE),
  }
}

// Hook para obtener un usuario app por ID
export function useUsuarioApp(id: string | null) {
  const { data, error, isLoading } = useSWR<ApiResponse<UsuarioAppWithTarjetas>>(
    id ? `${API_BASE}/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  )

  return {
    usuario: data?.data || null,
    isLoading,
    isError: error || (data && !data.success),
    error: error?.message || data?.error,
    refresh: () => id && mutate(`${API_BASE}/${id}`),
  }
}

// Hook para operaciones CRUD de usuarios app
export function useUsuariosAppMutations() {
  // Crear usuario
  const createUsuario = async (
    data: Omit<NewUsuarioApp, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<UsuarioAppWithTarjetas>> => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        mutate(API_BASE)
      }

      return result
    } catch (error) {
      console.error("Error creating usuario app:", error)
      return { success: false, error: "Error al crear usuario" }
    }
  }

  // Actualizar usuario
  const updateUsuario = async (
    id: string,
    data: Partial<NewUsuarioApp>,
  ): Promise<ApiResponse<UsuarioAppWithTarjetas>> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        mutate(API_BASE)
        mutate(`${API_BASE}/${id}`)
      }

      return result
    } catch (error) {
      console.error("Error updating usuario app:", error)
      return { success: false, error: "Error al actualizar usuario" }
    }
  }

  // Eliminar usuario
  const deleteUsuario = async (id: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      })

      const result = await res.json()

      if (result.success) {
        mutate(API_BASE)
      }

      return result
    } catch (error) {
      console.error("Error deleting usuario app:", error)
      return { success: false, error: "Error al eliminar usuario" }
    }
  }

  // Vincular tarjeta
  const vincularTarjeta = async (usuarioAppId: string, tarjetaId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_BASE}/tarjetas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioAppId, tarjetaId }),
      })

      const result = await res.json()

      if (result.success) {
        mutate(API_BASE)
        mutate(`${API_BASE}/${usuarioAppId}`)
      }

      return result
    } catch (error) {
      console.error("Error vinculando tarjeta:", error)
      return { success: false, error: "Error al vincular tarjeta" }
    }
  }

  // Desvincular tarjeta
  const desvincularTarjeta = async (tarjetaId: string, usuarioAppId?: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_BASE}/tarjetas?tarjetaId=${tarjetaId}`, {
        method: "DELETE",
      })

      const result = await res.json()

      if (result.success) {
        mutate(API_BASE)
        if (usuarioAppId) {
          mutate(`${API_BASE}/${usuarioAppId}`)
        }
      }

      return result
    } catch (error) {
      console.error("Error desvinculando tarjeta:", error)
      return { success: false, error: "Error al desvincular tarjeta" }
    }
  }

  // Revocar todos los tokens
  const revokeAllTokens = async (usuarioAppId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_BASE}/tokens?usuarioAppId=${usuarioAppId}`, {
        method: "DELETE",
      })

      const result = await res.json()

      if (result.success) {
        mutate(API_BASE)
        mutate(`${API_BASE}/${usuarioAppId}`)
      }

      return result
    } catch (error) {
      console.error("Error revocando tokens:", error)
      return { success: false, error: "Error al revocar tokens" }
    }
  }

  return {
    createUsuario,
    updateUsuario,
    deleteUsuario,
    vincularTarjeta,
    desvincularTarjeta,
    revokeAllTokens,
  }
}
