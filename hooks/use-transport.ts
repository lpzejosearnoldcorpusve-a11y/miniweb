import useSWR from "swr"
import type { Teleferico, Estacion, Transporte } from "@/types"

const fetcher: (url: string) => Promise<any> = (url: string) => fetch(url).then((res) => res.json())

export type TelefericoWithStations = Teleferico & { estaciones: Estacion[] }
export type MinibusWithRoute = Transporte & { ruta: any[] }

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
