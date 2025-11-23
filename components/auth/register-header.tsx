import { Bus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function RegisterHeader() {
  return (
    <div className="text-center mb-8">
      <Link href="/login" className="inline-block mb-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </Link>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl mb-4">
        <Bus className="w-8 h-8 text-secondary-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Crear Cuenta</h1>
      <p className="text-muted-foreground">Registro para el Sistema de Movilidad Urbana</p>
    </div>
  )
}
