import { NextResponse } from "next/server"
import { getUltimasUbicaciones } from "@/lib/actions/gps"

// GET - Get latest locations for all active vehicles
export async function GET() {
  try {
    const result = await getUltimasUbicaciones()
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
