import { NextResponse } from "next/server"
import { getEstadisticasHoy } from "@/lib/actions/gps"

// GET - Get today's statistics
export async function GET() {
  try {
    const result = await getEstadisticasHoy()
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
