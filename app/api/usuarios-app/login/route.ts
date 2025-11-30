import { type NextRequest, NextResponse } from "next/server"
import { loginUsuarioApp } from "@/lib/actions/usuarios-app"

// POST - Login de usuario app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { carnetIdentidad, password } = body

    if (!carnetIdentidad || !password) {
      return NextResponse.json(
        { success: false, error: "Carnet de identidad y contraseña son requeridos" },
        { status: 400 },
      )
    }

    // Get device info from headers
    const deviceInfo = request.headers.get("user-agent") || undefined
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

    const result = await loginUsuarioApp(carnetIdentidad, password, deviceInfo, ipAddress || undefined)

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/usuarios-app/login:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
