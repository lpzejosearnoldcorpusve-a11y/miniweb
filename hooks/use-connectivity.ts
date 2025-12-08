'use client'

import useSWR from 'swr'
import type { User } from '@/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useConnectivity() {
  const { data, error, isLoading } = useSWR(
    '/api/gps/estadisticas',
    fetcher,
    { refreshInterval: 10000 }
  )

  const gpsDevices = data?.data?.gpsDevices || 0
  const iotSensors = data?.data?.iotSensors || 0
  const wifiRouters = data?.data?.wifiRouters || 0
  const servers = data?.data?.servers || 0

  const totalDevices = gpsDevices + iotSensors + wifiRouters + servers
  const connectedDevices = Math.max(
    Math.floor(gpsDevices * 0.95),
    Math.floor(iotSensors * 0.93),
    Math.floor(wifiRouters * 1),
    Math.floor(servers * 1)
  ) * 4

  const availability = totalDevices > 0 
    ? Math.round((connectedDevices / totalDevices) * 100) 
    : 0

  return {
    gpsDevices,
    iotSensors,
    wifiRouters,
    servers,
    totalDevices,
    connectedDevices,
    availability: Math.min(availability, 100),
    isLoading,
    isError: error,
  }
}
