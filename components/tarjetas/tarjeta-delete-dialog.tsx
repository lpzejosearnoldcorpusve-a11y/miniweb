"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteTarjeta, useTarjetas } from "@/hooks/use-tarjetas"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { TarjetaRfid } from "@/types"

interface TarjetaDeleteDialogProps {
  tarjeta: TarjetaRfid
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TarjetaDeleteDialog({ tarjeta, open, onOpenChange, onSuccess }: TarjetaDeleteDialogProps) {
  const { deleteTarjeta, isDeleting } = useDeleteTarjeta()
  const { mutate } = useTarjetas()
  const { toast } = useToast()

  const handleDelete = async () => {
    const result = await deleteTarjeta(tarjeta.id)

    if (result.success) {
      toast({
        title: "Tarjeta eliminada",
        description: "La tarjeta se eliminó correctamente",
      })
      mutate()
      onSuccess?.()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar tarjeta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la tarjeta{" "}
            <span className="font-semibold">{tarjeta.uid}</span> de{" "}
            <span className="font-semibold">{tarjeta.nombre}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
