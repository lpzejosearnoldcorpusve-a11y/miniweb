import { type NextRequest, NextResponse } from "next/server"
import { getAlertas, getAlertasActivas, getEstadisticasAlertas } from "@/lib/actions/alertas"

// GET - Get alerts with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get("estado")
    const tipoAlerta = searchParams.get("tipo")
    const vehiculoId = searchParams.get("vehiculoId")
    const soloActivas = searchParams.get("activas") === "true"
    const estadisticas = searchParams.get("estadisticas") === "true"

    // Return statistics if requested
    if (estadisticas) {
      const result = await getEstadisticasAlertas()
      return NextResponse.json(result)
    }

    // Return only active alerts if requested
    if (soloActivas) {
      const result = await getAlertasActivas()
      return NextResponse.json(result)
    }

    // Return filtered alerts
    const result = await getAlertas({
      estado: estado || undefined,
      tipoAlerta: tipoAlerta || undefined,
      vehiculoId: vehiculoId || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ success: false, error: "Error al obtener alertas" }, { status: 500 })
  }
}
