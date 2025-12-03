"use client"

import useSWR from "swr"
import type { AlertaConDetalles, EstadisticasAlertas } from "@/types/alertas"
import type { ApiResponse } from "@/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Hook for all alerts with filters
export function useAlertas(filtros?: { estado?: string; tipo?: string; vehiculoId?: string }) {
  const params = new URLSearchParams()
  if (filtros?.estado) params.append("estado", filtros.estado)
  if (filtros?.tipo) params.append("tipo", filtros.tipo)
  if (filtros?.vehiculoId) params.append("vehiculoId", filtros.vehiculoId)

  const url = `/api/gps/alertas${params.toString() ? `?${params.toString()}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<AlertaConDetalles[]>>(url, fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
  })

  const actualizarEstado = async (alertaId: string, estado: string, notas?: string) => {
    const res = await fetch(`/api/gps/alertas/${alertaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado, notas }),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  return {
    alertas: data?.data || [],
    isLoading,
    isError: error,
    actualizarEstado,
    refresh: mutate,
  }
}

// Hook for active alerts only (real-time monitoring)
export function useAlertasActivas(pollInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<AlertaConDetalles[]>>(
    "/api/gps/alertas?activas=true",
    fetcher,
    {
      refreshInterval: pollInterval,
      revalidateOnFocus: true,
    },
  )

  const marcarRevisada = async (alertaId: string) => {
    const res = await fetch(`/api/gps/alertas/${alertaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "revisada" }),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const resolverAlerta = async (alertaId: string, notas?: string) => {
    const res = await fetch(`/api/gps/alertas/${alertaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "resuelta", notas }),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const ignorarAlerta = async (alertaId: string, notas?: string) => {
    const res = await fetch(`/api/gps/alertas/${alertaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "ignorada", notas }),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  return {
    alertasActivas: data?.data || [],
    totalActivas: data?.data?.length || 0,
    isLoading,
    isError: error,
    marcarRevisada,
    resolverAlerta,
    ignorarAlerta,
    refresh: mutate,
  }
}

// Hook for alerts statistics
export function useEstadisticasAlertas(pollInterval = 30000) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<EstadisticasAlertas>>(
    "/api/gps/alertas?estadisticas=true",
    fetcher,
    {
      refreshInterval: pollInterval,
    },
  )

  return {
    estadisticas: data?.data || {
      totalActivas: 0,
      totalHoy: 0,
      porTipo: { desvio_ruta: 0, fuera_servicio: 0, velocidad_excesiva: 0, sin_movimiento: 0 },
      porSeveridad: { baja: 0, media: 0, alta: 0, critica: 0 },
    },
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// Hook for route assignments
export function useAsignacionesRuta() {
  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<
      {
        asignacion: {
          id: string
          vehiculoId: string
          transporteId: string
          rutaId: string
          toleranciaMetros: number
          activa: string
        }
        vehiculo: { placa: string; linea: string }
        transporte: { sindicato: string; linea: string; rutaNombre: string }
      }[]
    >
  >("/api/gps/asignaciones", fetcher)

  const crearAsignacion = async (data: {
    vehiculoId: string
    transporteId: string
    rutaId: string
    toleranciaMetros?: number
  }) => {
    const res = await fetch("/api/gps/asignaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const finalizarAsignacion = async (asignacionId: string) => {
    const res = await fetch(`/api/gps/asignaciones/${asignacionId}`, {
      method: "DELETE",
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  return {
    asignaciones: data?.data || [],
    isLoading,
    isError: error,
    crearAsignacion,
    finalizarAsignacion,
    refresh: mutate,
  }
}
