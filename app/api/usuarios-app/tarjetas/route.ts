import { type NextRequest, NextResponse } from "next/server"
import { vincularTarjeta, desvincularTarjeta } from "@/lib/actions/usuarios-app"

// POST - Vincular tarjeta a usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioAppId, tarjetaId } = body

    if (!usuarioAppId || !tarjetaId) {
      return NextResponse.json({ success: false, error: "usuarioAppId y tarjetaId son requeridos" }, { status: 400 })
    }

    const result = await vincularTarjeta(usuarioAppId, tarjetaId)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/usuarios-app/tarjetas:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Desvincular tarjeta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tarjetaId = searchParams.get("tarjetaId")

    if (!tarjetaId) {
      return NextResponse.json({ success: false, error: "tarjetaId es requerido" }, { status: 400 })
    }

    const result = await desvincularTarjeta(tarjetaId)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in DELETE /api/usuarios-app/tarjetas:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
