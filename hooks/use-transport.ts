import useSWR from "swr"
import type { Teleferico, Estacion, Transporte } from "@/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export type TelefericoWithStations = Teleferico & { estaciones: Estacion[] }
// Tip: Si puedes, evita el 'any' en la ruta
export type MinibusWithRoute = Transporte & { ruta: { lat: number; lng: number }[] }

export function useTelefericos() {
  const { data, error, isLoading, mutate } = useSWR<TelefericoWithStations[]>("/api/telefericos", fetcher)

  return {
    telefericos: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useMinibuses() {
  const { data, error, isLoading, mutate } = useSWR<MinibusWithRoute[]>("/api/minibuses", fetcher)

  return {
    minibuses: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useTransportes() {
  // Extend Transporte with optional rutaId provided by API
  const { data, error, isLoading, mutate } = useSWR<(Transporte & { rutaId?: string | null })[]>(
    "/api/minibuses",
    fetcher,
  )

  return {
    transportes: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}