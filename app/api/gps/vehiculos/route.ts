import { type NextRequest, NextResponse } from "next/server"
import { getVehiculos, createVehiculo } from "@/lib/actions/gps"

// GET - List all vehicles
export async function GET() {
  try {
    const result = await getVehiculos()
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

// POST - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.placa || !data.linea) {
      return NextResponse.json({ success: false, error: "Placa y línea son requeridos" }, { status: 400 })
    }

    const result = await createVehiculo(data)
    return NextResponse.json(result, { status: result.success ? 201 : 500 })
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
