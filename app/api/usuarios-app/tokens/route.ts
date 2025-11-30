import { type NextRequest, NextResponse } from "next/server"
import { validateTokenApp, revokeTokenApp, revokeAllTokensApp } from "@/lib/actions/usuarios-app"

// POST - Validar token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, error: "Token es requerido" }, { status: 400 })
    }

    const result = await validateTokenApp(token)

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/usuarios-app/tokens:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Revocar token
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const usuarioAppId = searchParams.get("usuarioAppId")

    if (usuarioAppId) {
      // Revoke all tokens for user
      const result = await revokeAllTokensApp(usuarioAppId)
      return NextResponse.json(result)
    }

    if (token) {
      // Revoke specific token
      const result = await revokeTokenApp(token)
      return NextResponse.json(result)
    }

    return NextResponse.json({ success: false, error: "Token o usuarioAppId es requerido" }, { status: 400 })
  } catch (error) {
    console.error("Error in DELETE /api/usuarios-app/tokens:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
