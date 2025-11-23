import Link from "next/link"

export function LoginFooter() {
  return (
    <div className="mt-6 text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        ¿No tiene una cuenta?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Registrarse
        </Link>
      </p>
      <p className="text-xs text-muted-foreground">© 2025 Gobierno Autónomo Municipal de La Paz</p>
    </div>
  )
}
