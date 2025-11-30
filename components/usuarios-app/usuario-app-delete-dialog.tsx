"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useUsuariosAppMutations } from "@/hooks/use-usuarios-app"
import { Loader2, AlertTriangle } from "lucide-react"
import type { UsuarioAppWithTarjetas } from "@/types"

interface UsuarioAppDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioAppWithTarjetas
}

export function UsuarioAppDeleteDialog({ open, onOpenChange, usuario }: UsuarioAppDeleteDialogProps) {
  const { deleteUsuario } = useUsuariosAppMutations()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteUsuario(usuario.id)
      if (result.success) {
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            ¿Está seguro que desea eliminar al usuario{" "}
            <strong>
              {usuario.nombres} {usuario.apellidoPaterno} {usuario.apellidoMaterno}
            </strong>
            ?
            <br />
            <br />
            Esta acción eliminará:
            <ul className="mt-2 list-inside list-disc text-sm">
              <li>Todos los tokens de sesión activos</li>
              <li>El vínculo con las tarjetas RFID asociadas</li>
            </ul>
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Usuario
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
