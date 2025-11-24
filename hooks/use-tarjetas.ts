"use client"

import useSWR from "swr"
import { useState } from "react"
import type { TarjetaRfid } from "@/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTarjetas() {
  const { data, error, isLoading, mutate } = useSWR("/api/tarjetas", fetcher)

  return {
    tarjetas: data?.data as TarjetaRfid[] | undefined,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useTarjetaByUid(uid: string | null) {
  const { data, error, isLoading } = useSWR(uid ? `/api/tarjetas?uid=${uid}` : null, fetcher)

  return {
    tarjeta: data?.data as TarjetaRfid | undefined,
    registered: data?.registered as boolean | undefined,
    isLoading,
    isError: error,
  }
}

export function useCreateTarjeta() {
  const [isCreating, setIsCreating] = useState(false)

  const createTarjeta = async (data: {
    uid: string
    nombre: string
    celular: string
    monto_bs?: number
    estado?: string
  }) => {
    setIsCreating(true)
    try {
      const response = await fetch("/api/tarjetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear tarjeta")
      }

      const result = await response.json()
      return { success: true, data: result.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setIsCreating(false)
    }
  }

  return { createTarjeta, isCreating }
}

export function useUpdateTarjeta() {
  const [isUpdating, setIsUpdating] = useState(false)

  const updateTarjeta = async (
    id: string,
    data: {
      nombre?: string
      celular?: string
      monto_bs?: number
      estado?: string
    },
  ) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/tarjetas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al actualizar tarjeta")
      }

      const result = await response.json()
      return { success: true, data: result.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setIsUpdating(false)
    }
  }

  return { updateTarjeta, isUpdating }
}

export function useDeleteTarjeta() {
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteTarjeta = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tarjetas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar tarjeta")
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteTarjeta, isDeleting }
}
