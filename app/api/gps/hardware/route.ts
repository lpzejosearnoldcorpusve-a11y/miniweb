import { type NextRequest, NextResponse } from "next/server"
import { procesarDatosHardware } from "@/lib/actions/gps"
import type { HardwareGpsPayload } from "@/types/gps"


export async function POST(request: NextRequest) {
  try {
    const payload: HardwareGpsPayload = await request.json()

    // Validate required fields
    if (!payload.placa || !payload.linea || payload.latitud === undefined || payload.longitud === undefined) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos: placa, linea, latitud y longitud son requeridos" },
        { status: 400 },
      )
    }

    const result = await procesarDatosHardware(payload)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    console.error("Error in hardware endpoint:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
