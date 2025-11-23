import Link from "next/link"

export function RegisterFooter() {
  return (
    <div className="mt-6 text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        ¿Ya tiene una cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Iniciar Sesión
        </Link>
      </p>
      <p className="text-xs text-muted-foreground">© 2025 Gobierno Autónomo Municipal de La Paz</p>
    </div>
  )
}
