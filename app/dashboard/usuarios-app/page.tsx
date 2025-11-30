import { UsuariosAppHeader } from "@/components/usuarios-app/usuarios-app-header"
import { UsuariosAppContent } from "@/components/usuarios-app/usuarios-app-content"

export default function UsuariosAppPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <UsuariosAppHeader />
      <UsuariosAppContent />
    </div>
  )
}
