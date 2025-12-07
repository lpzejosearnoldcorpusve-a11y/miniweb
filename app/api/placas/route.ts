import { NextResponse } from "next/server"
import { getPlacas } from "@/lib/actions/reportes"

// GET /api/placas - Obtener todas las placas con choferes
export async function GET() {
  try {
    const placas = await getPlacas()

    return NextResponse.json({
      success: true,
      data: placas,
      total: placas.length,
    })
  } catch (error) {
    console.error("Error in GET /api/placas:", error)
    return NextResponse.json({ success: false, error: "Error al obtener placas" }, { status: 500 })
  }
}
