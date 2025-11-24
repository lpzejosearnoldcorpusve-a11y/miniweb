"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TarjetaFormDialog } from "./tarjeta-form-dialog"
import { useState } from "react"

export function TarjetasHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tarjetas RFID</h1>
        <p className="text-muted-foreground mt-1">Gestión de tarjetas de transporte público</p>
      </div>
      <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4 mr-2" />
        Nueva Tarjeta
      </Button>

      <TarjetaFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={() => setIsDialogOpen(false)} />
    </div>
  )
}
