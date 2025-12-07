import { type NextRequest, NextResponse } from "next/server"
import { verificarReporte } from "@/lib/actions/reportes"

// POST /api/reportes/[id]/verificar - Verificar reporte y generar infracción
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.revisadoPor) {
      return NextResponse.json(
        { success: false, error: "Se requiere el ID del revisor (revisadoPor)" },
        { status: 400 },
      )
    }

    const result = await verificarReporte(
      id,
      body.revisadoPor,
      body.generarInfraccion !== false, // Default: true
    )

    if (!result) {
      return NextResponse.json({ success: false, error: "Error al verificar reporte" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: result.infraccion
        ? `Reporte verificado. Infracción generada: Bs. ${result.infraccion.montoBs}`
        : "Reporte verificado sin generar infracción",
    })
  } catch (error) {
    console.error("Error in POST /api/reportes/[id]/verificar:", error)
    return NextResponse.json({ success: false, error: "Error al verificar reporte" }, { status: 500 })
  }
}
