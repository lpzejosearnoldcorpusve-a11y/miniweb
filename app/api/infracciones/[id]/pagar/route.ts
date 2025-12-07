import { type NextRequest, NextResponse } from "next/server"
import { pagarInfraccion } from "@/lib/actions/reportes"

// POST /api/infracciones/[id]/pagar - Marcar infracción como pagada
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const infraccion = await pagarInfraccion(id)

    if (!infraccion) {
      return NextResponse.json({ success: false, error: "Error al procesar pago" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: infraccion,
      message: "Infracción pagada exitosamente",
    })
  } catch (error) {
    console.error("Error in POST /api/infracciones/[id]/pagar:", error)
    return NextResponse.json({ success: false, error: "Error al procesar pago" }, { status: 500 })
  }
}
