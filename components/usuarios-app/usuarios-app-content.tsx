"use client"

import { useUsuariosApp } from "@/hooks/use-usuarios-app"
import { UsuariosAppTable } from "./usuarios-app-table"
import { UsuariosAppStats } from "./usuarios-app-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function UsuariosAppContent() {
  const { usuarios, isLoading, isError, error } = useUsuariosApp()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "No se pudieron cargar los usuarios. Verifique la conexión a la base de datos."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <UsuariosAppStats usuarios={usuarios} />
      <UsuariosAppTable usuarios={usuarios} />
    </div>
  )
}
