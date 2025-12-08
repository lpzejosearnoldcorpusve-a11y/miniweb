import { type NextRequest, NextResponse } from "next/server"
import { verificarPagoRfid } from "@/lib/actions/gps"

// POST - Verify RFID payment
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.rfidUid || data.monto === undefined) {
      return NextResponse.json({ success: false, message: "rfidUid y monto son requeridos" }, { status: 400 })
    }

    const result = await verificarPagoRfid(data)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
