import { NextResponse } from "next/server"
import { getChoferes } from "@/lib/actions/reportes"

// GET /api/choferes - Obtener todos los choferes
export async function GET() {
  try {
    const choferes = await getChoferes()

    return NextResponse.json({
      success: true,
      data: choferes,
      total: choferes.length,
    })
  } catch (error) {
    console.error("Error in GET /api/choferes:", error)
    return NextResponse.json({ success: false, error: "Error al obtener choferes" }, { status: 500 })
  }
}
