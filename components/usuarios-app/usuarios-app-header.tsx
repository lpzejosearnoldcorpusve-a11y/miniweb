"use client"

import { useState } from "react"
import { Smartphone, UserPlus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UsuarioAppFormDialog } from "./usuario-app-form-dialog"
import { useUsuariosApp } from "@/hooks/use-usuarios-app"

export function UsuariosAppHeader() {
  const [showForm, setShowForm] = useState(false)
  const { refresh, isValidating } = useUsuariosApp()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <Smartphone className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios de la App</h1>
          <p className="text-sm text-muted-foreground">Gestión de usuarios móviles, tokens y tarjetas vinculadas</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => refresh()} disabled={isValidating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
        <Button onClick={() => setShowForm(true)} className="shadow-md">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <UsuarioAppFormDialog open={showForm} onOpenChange={setShowForm} />
    </div>
  )
}
