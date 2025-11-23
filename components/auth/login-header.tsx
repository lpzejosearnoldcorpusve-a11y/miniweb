import { Bus } from "lucide-react"

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
        <Bus className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Movilidad Urbana</h1>
      <p className="text-muted-foreground">Gobierno Autónomo Municipal de La Paz</p>
    </div>
  )
}
