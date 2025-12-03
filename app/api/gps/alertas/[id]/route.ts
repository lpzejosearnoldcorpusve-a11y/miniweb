import { type NextRequest, NextResponse } from "next/server"
import { actualizarEstadoAlerta } from "@/lib/actions/alertas"

// PUT - Update alert status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { estado, revisadoPor, notas } = body

    if (!estado) {
      return NextResponse.json({ success: false, error: "Estado es requerido" }, { status: 400 })
    }

    const result = await actualizarEstadoAlerta(id, estado, revisadoPor, notas)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar alerta" }, { status: 500 })
  }
}
