"use client"

import { FileWarning } from "lucide-react"

export function ReportesHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileWarning className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes de Trameaje</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de reportes ciudadanos e infracciones de transporte público
          </p>
        </div>
      </div>
    </div>
  )
}
