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
import { Loader2, KeyRound } from "lucide-react"
import type { UsuarioAppWithTarjetas } from "@/types"

interface RevokeTokensDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioAppWithTarjetas
}

export function RevokeTokensDialog({ open, onOpenChange, usuario }: RevokeTokensDialogProps) {
  const { revokeAllTokens } = useUsuariosAppMutations()
  const [isLoading, setIsLoading] = useState(false)

  const handleRevoke = async () => {
    setIsLoading(true)
    try {
      const result = await revokeAllTokens(usuario.id)
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
              <KeyRound className="h-5 w-5 text-orange-500" />
            </div>
            <AlertDialogTitle>Revocar Sesiones</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            ¿Está seguro que desea revocar todas las sesiones activas de{" "}
            <strong>
              {usuario.nombres} {usuario.apellidoPaterno}
            </strong>
            ?
            <br />
            <br />
            El usuario tiene actualmente <strong>{usuario.tokensActivos || 0}</strong>{" "}
            {usuario.tokensActivos === 1 ? "sesión activa" : "sesiones activas"}.
            <br />
            <br />
            El usuario deberá iniciar sesión nuevamente en todos sus dispositivos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <Button
            variant="default"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleRevoke}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Revocar Sesiones
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
