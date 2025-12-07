"use client"

import useSWR from "swr"
import type {
  ReporteTrameajeWithDetails,
  ReporteEstadisticas,
  HistorialReporte,
  InfraccionWithDetails,
  PlacaWithChofer,
  Chofer,
} from "@/types/reportes"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// ==================== REPORTES ====================

export function useReportes(filters?: {
  estado?: string
  prioridad?: string
  tipoReporte?: string
  fechaInicio?: string
  fechaFin?: string
  placa?: string
  linea?: string
}) {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
  }

  const queryString = params.toString()
  const url = `/api/reportes${queryString ? `?${queryString}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: ReporteTrameajeWithDetails[]
    total: number
  }>(url, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  const createReporte = async (reporteData: {
    placa: string
    linea: string
    usuarioAppId?: string
    horaSuceso: string
    latitud?: number
    longitud?: number
    direccion?: string
    evidenciaImagenes?: string[]
    evidenciaVideos?: string[]
    evidenciaAudios?: string[]
    mensaje?: string
    tipoReporte?: string
    prioridad?: string
  }) => {
    const res = await fetch("/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporteData),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const updateReporte = async (
    id: string,
    updateData: {
      estado?: string
      prioridad?: string
      notasRevision?: string
      revisadoPor?: string
    },
  ) => {
    const res = await fetch(`/api/reportes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const deleteReporte = async (id: string) => {
    const res = await fetch(`/api/reportes/${id}`, {
      method: "DELETE",
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const verificarReporte = async (id: string, revisadoPor: string, generarInfraccion = true) => {
    const res = await fetch(`/api/reportes/${id}/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revisadoPor, generarInfraccion }),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  return {
    reportes: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    createReporte,
    updateReporte,
    deleteReporte,
    verificarReporte,
    refresh: mutate,
  }
}

export function useReporte(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: ReporteTrameajeWithDetails
  }>(id ? `/api/reportes/${id}` : null, fetcher)

  return {
    reporte: data?.data || null,
    isLoading,
    error,
    refresh: mutate,
  }
}

// ==================== ESTADISTICAS ====================

export function useReportesEstadisticas() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: ReporteEstadisticas
  }>("/api/reportes/estadisticas", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  return {
    estadisticas: data?.data || {
      totalReportes: 0,
      pendientes: 0,
      enRevision: 0,
      verificados: 0,
      rechazados: 0,
      resueltos: 0,
      infraccionesGeneradas: 0,
      montoTotalInfracciones: 0,
    },
    isLoading,
    error,
    refresh: mutate,
  }
}

// ==================== HISTORIAL ====================

export function useHistorialReportes(page = 1, pageSize = 20) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: HistorialReporte[]
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }>(`/api/reportes/historial?page=${page}&pageSize=${pageSize}`, fetcher)

  return {
    historial: data?.data || [],
    pagination: data?.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 0 },
    isLoading,
    error,
    refresh: mutate,
  }
}

// ==================== INFRACCIONES ====================

export function useInfracciones() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: InfraccionWithDetails[]
    total: number
  }>("/api/infracciones", fetcher, {
    refreshInterval: 30000,
  })

  const pagarInfraccion = async (id: string) => {
    const res = await fetch(`/api/infracciones/${id}/pagar`, {
      method: "POST",
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  return {
    infracciones: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    pagarInfraccion,
    refresh: mutate,
  }
}

// ==================== PLACAS & CHOFERES ====================

export function usePlacas() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: PlacaWithChofer[]
    total: number
  }>("/api/placas", fetcher)

  return {
    placas: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useChoferes() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: Chofer[]
    total: number
  }>("/api/choferes", fetcher)

  return {
    choferes: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh: mutate,
  }
}
