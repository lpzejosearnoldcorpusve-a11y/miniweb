import { type NextRequest, NextResponse } from "next/server"
import { getHistorialReportes } from "@/lib/actions/reportes"

// GET /api/reportes/historial - Obtener historial paginado de reportes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")

    const { data, total } = await getHistorialReportes(page, pageSize)

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error("Error in GET /api/reportes/historial:", error)
    return NextResponse.json({ success: false, error: "Error al obtener historial" }, { status: 500 })
  }
}
