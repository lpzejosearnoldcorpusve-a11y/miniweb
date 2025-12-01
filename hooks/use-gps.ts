"use client"

import useSWR from "swr"
import type { VehiculoGps, TransaccionRfid, VehiculoEnTiempoReal } from "@/types/gps"
import type { ApiResponse } from "@/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Hook for vehicles list
export function useVehiculos() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<VehiculoGps[]>>("/api/gps/vehiculos", fetcher)

  const createVehiculo = async (vehiculoData: {
    placa: string
    linea: string
    tipoVehiculo?: string
  }) => {
    const res = await fetch("/api/gps/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculoData),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const updateVehiculo = async (id: string, vehiculoData: Partial<VehiculoGps>) => {
    const res = await fetch(`/api/gps/vehiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculoData),
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  const deleteVehiculo = async (id: string) => {
    const res = await fetch(`/api/gps/vehiculos/${id}`, {
      method: "DELETE",
    })
    const result = await res.json()
    if (result.success) {
      mutate()
    }
    return result
  }

  return {
    vehiculos: data?.data || [],
    isLoading,
    isError: error,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    refresh: mutate,
  }
}

// Hook for real-time locations (polls every 5 seconds)
export function useUbicacionesEnTiempoReal(pollInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<VehiculoEnTiempoReal[]>>(
    "/api/gps/ubicaciones",
    fetcher,
    {
      refreshInterval: pollInterval,
      revalidateOnFocus: true,
    },
  )

  return {
    vehiculosEnMapa: data?.data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// Hook for transactions
export function useTransacciones(filtros?: { vehiculoId?: string; tarjetaId?: string }) {
  const params = new URLSearchParams()
  if (filtros?.vehiculoId) params.append("vehiculoId", filtros.vehiculoId)
  if (filtros?.tarjetaId) params.append("tarjetaId", filtros.tarjetaId)

  const url = `/api/gps/transacciones${params.toString() ? `?${params.toString()}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<TransaccionRfid[]>>(url, fetcher)

  return {
    transacciones: data?.data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// Hook for today's statistics
export function useEstadisticasHoy(pollInterval = 10000) {
  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<{
      totalPasajeros: number
      totalRecaudado: number
      pagosNormales: number
      pagosEstudiante: number
      pagosTerceraEdad: number
    }>
  >("/api/gps/estadisticas", fetcher, {
    refreshInterval: pollInterval,
  })

  return {
    estadisticas: data?.data || {
      totalPasajeros: 0,
      totalRecaudado: 0,
      pagosNormales: 0,
      pagosEstudiante: 0,
      pagosTerceraEdad: 0,
    },
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// Hook for payment verification (used by hardware)
export function useVerificarPago() {
  const verificarPago = async (data: {
    rfidUid: string
    monto: number
    tipoPago?: string
    vehiculoId?: string
    latitud?: number
    longitud?: number
  }) => {
    const res = await fetch("/api/gps/pagos/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  return { verificarPago }
}
