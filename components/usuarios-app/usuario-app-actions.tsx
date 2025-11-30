"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, CreditCard, KeyRound, Eye } from "lucide-react"
import { UsuarioAppFormDialog } from "./usuario-app-form-dialog"
import { UsuarioAppDeleteDialog } from "./usuario-app-delete-dialog"
import { UsuarioAppDetailDialog } from "./usuario-app-detail-dialog"
import { VincularTarjetaDialog } from "./vincular-tarjeta-dialog"
import { RevokeTokensDialog } from "./revoke-tokens-dialog"
import type { UsuarioAppWithTarjetas } from "@/types"

interface UsuarioAppActionsProps {
  usuario: UsuarioAppWithTarjetas
}

export function UsuarioAppActions({ usuario }: UsuarioAppActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showVincular, setShowVincular] = useState(false)
  const [showRevoke, setShowRevoke] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDetail(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowVincular(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Vincular Tarjeta
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRevoke(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Revocar Sesiones
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDelete(true)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UsuarioAppFormDialog open={showEdit} onOpenChange={setShowEdit} usuario={usuario} />

      <UsuarioAppDeleteDialog open={showDelete} onOpenChange={setShowDelete} usuario={usuario} />

      <UsuarioAppDetailDialog open={showDetail} onOpenChange={setShowDetail} usuario={usuario} />

      <VincularTarjetaDialog open={showVincular} onOpenChange={setShowVincular} usuario={usuario} />

      <RevokeTokensDialog open={showRevoke} onOpenChange={setShowRevoke} usuario={usuario} />
    </>
  )
}
