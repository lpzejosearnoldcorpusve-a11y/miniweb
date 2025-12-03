import { type NextRequest, NextResponse } from "next/server"
import { crearAsignacionRuta, getAsignacionesActivas } from "@/lib/actions/alertas"

// GET - Get active route assignments
export async function GET() {
  try {
    const result = await getAsignacionesActivas()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ success: false, error: "Error al obtener asignaciones" }, { status: 500 })
  }
}

// POST - Create new route assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[API] POST /api/gps/asignaciones body:", body)
    const { vehiculoId, transporteId, rutaId, toleranciaMetros } = body

    if (!vehiculoId || !transporteId || !rutaId) {
      return NextResponse.json(
        { success: false, error: "vehiculoId, transporteId y rutaId son requeridos" },
        { status: 400 },
      )
    }

    const result = await crearAsignacionRuta({
      vehiculoId,
      transporteId,
      rutaId,
      toleranciaMetros,
    })

    // If validation failed, return 400 with the message; otherwise 201 or 500
    if (!result.success) {
      // Show the exact result for debugging in logs
      console.log("[API] crearAsignacionRuta returned:", result)
      const badRequestErrors = [
        "Vehículo no encontrado",
        "Transporte no encontrado",
        "Ruta no encontrada",
        "La ruta seleccionada no pertenece a la línea de transporte indicada",
        "Este transporte no tiene una ruta definida. Primero dibuja el recorrido en 'Rutas de Transporte'.",
      ]
      const errorMessage = (result.error ?? "") as string
      // Considerar también errores que empiezan con "Ruta no encontrada"
      const isBadRequest = badRequestErrors.includes(errorMessage) || errorMessage.startsWith("Ruta no encontrada")
      const status = isBadRequest ? 400 : 500
      return NextResponse.json(result, { status })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json({ success: false, error: "Error al crear asignación" }, { status: 500 })
  }
}
