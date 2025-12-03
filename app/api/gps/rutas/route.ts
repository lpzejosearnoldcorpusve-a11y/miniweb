import { NextRequest, NextResponse } from "next/server"
import { getRutas } from "@/lib/actions/transport"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const transporteId = url.searchParams.get("transporteId") || undefined
    const data = await getRutas(transporteId)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching rutas:", error)
    return NextResponse.json({ success: false, error: "Error al obtener rutas" }, { status: 500 })
  }
}
