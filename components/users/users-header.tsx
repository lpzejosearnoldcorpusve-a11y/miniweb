"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserFormDialog } from "./user-form-dialog"

export function UsersHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-2">Administre los usuarios del sistema de movilidad urbana</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar usuarios..." className="pl-10" />
        </div>
      </div>

      <UserFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
