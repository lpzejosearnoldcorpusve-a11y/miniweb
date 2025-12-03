import { type NextRequest, NextResponse } from "next/server"
import { finalizarAsignacion } from "@/lib/actions/alertas"

// DELETE - End route assignment
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await finalizarAsignacion(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error ending assignment:", error)
    return NextResponse.json({ success: false, error: "Error al finalizar asignación" }, { status: 500 })
  }
}
