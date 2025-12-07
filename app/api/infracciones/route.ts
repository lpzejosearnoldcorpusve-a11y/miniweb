import { NextResponse } from "next/server"
import { getInfracciones } from "@/lib/actions/reportes"

// GET /api/infracciones - Obtener todas las infracciones
export async function GET() {
  try {
    const infracciones = await getInfracciones()

    return NextResponse.json({
      success: true,
      data: infracciones,
      total: infracciones.length,
    })
  } catch (error) {
    console.error("Error in GET /api/infracciones:", error)
    return NextResponse.json({ success: false, error: "Error al obtener infracciones" }, { status: 500 })
  }
}
