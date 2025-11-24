"use client"

import { MoreVertical, Edit, Trash2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { TarjetaFormDialog } from "./tarjeta-form-dialog"
import { TarjetaDeleteDialog } from "./tarjeta-delete-dialog"
import { MontoFormDialog } from "./monto-form-dialog"
import type { TarjetaRfid } from "@/types"

interface TarjetaActionsProps {
  tarjeta: TarjetaRfid
}

export function TarjetaActions({ tarjeta }: TarjetaActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [montoOpen, setMontoOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setMontoOpen(true)}>
            <Wallet className="h-4 w-4 mr-2" />
            Agregar Monto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MontoFormDialog
        tarjeta={tarjeta}
        open={montoOpen}
        onOpenChange={setMontoOpen}
        onSuccess={() => setMontoOpen(false)}
      />

      <TarjetaFormDialog
        tarjeta={tarjeta}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => setEditOpen(false)}
      />

      <TarjetaDeleteDialog
        tarjeta={tarjeta}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => setDeleteOpen(false)}
      />
    </>
  )
}
