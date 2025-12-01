import { type NextRequest, NextResponse } from "next/server"
import { getTransacciones } from "@/lib/actions/gps"

// GET - Get transactions with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehiculoId = searchParams.get("vehiculoId") || undefined
    const tarjetaId = searchParams.get("tarjetaId") || undefined

    const result = await getTransacciones({ vehiculoId, tarjetaId })
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
