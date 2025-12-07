import { NextResponse } from "next/server"
import { getReportesEstadisticas } from "@/lib/actions/reportes"

// GET /api/reportes/estadisticas - Obtener estadísticas de reportes
export async function GET() {
  try {
    const estadisticas = await getReportesEstadisticas()

    return NextResponse.json({
      success: true,
      data: estadisticas,
    })
  } catch (error) {
    console.error("Error in GET /api/reportes/estadisticas:", error)
    return NextResponse.json({ success: false, error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
