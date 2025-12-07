import { type NextRequest, NextResponse } from "next/server"
import { getReportes, createReporte } from "@/lib/actions/reportes"

// GET /api/reportes - Obtener todos los reportes con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      estado: searchParams.get("estado") || undefined,
      prioridad: searchParams.get("prioridad") || undefined,
      tipoReporte: searchParams.get("tipoReporte") || undefined,
      fechaInicio: searchParams.get("fechaInicio") || undefined,
      fechaFin: searchParams.get("fechaFin") || undefined,
      placa: searchParams.get("placa") || undefined,
      linea: searchParams.get("linea") || undefined,
    }

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters]
      }
    })

    const reportes = await getReportes(Object.keys(filters).length > 0 ? filters : undefined)

    return NextResponse.json({
      success: true,
      data: reportes,
      total: reportes.length,
    })
  } catch (error) {
    console.error("Error in GET /api/reportes:", error)
    return NextResponse.json({ success: false, error: "Error al obtener reportes" }, { status: 500 })
  }
}

// POST /api/reportes - Crear nuevo reporte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    if (!body.placa || !body.linea || !body.horaSuceso) {
      return NextResponse.json(
        {
          success: false,
          error: "Campos requeridos: placa, linea, horaSuceso",
        },
        { status: 400 },
      )
    }

    const reporte = await createReporte({
      placa: body.placa,
      linea: body.linea,
      usuarioAppId: body.usuarioAppId || null,
      horaSuceso: new Date(body.horaSuceso),
      latitud: body.latitud || null,
      longitud: body.longitud || null,
      direccion: body.direccion || null,
      evidenciaImagenes: body.evidenciaImagenes || [],
      evidenciaVideos: body.evidenciaVideos || [],
      evidenciaAudios: body.evidenciaAudios || [],
      mensaje: body.mensaje || null,
      tipoReporte: body.tipoReporte || "trameaje",
      prioridad: body.prioridad || "media",
    })

    if (!reporte) {
      return NextResponse.json({ success: false, error: "Error al crear reporte" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        data: reporte,
        message: "Reporte creado exitosamente",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in POST /api/reportes:", error)
    return NextResponse.json({ success: false, error: "Error al crear reporte" }, { status: 500 })
  }
}
