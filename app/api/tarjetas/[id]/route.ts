import { NextRequest, NextResponse } from "next/server"
import { updateTarjeta, deleteTarjeta, updateMonto } from "@/lib/actions/tarjetas"

// PUT /api/tarjetas/[id] - Actualizar tarjeta
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id } = await params // Añadir await aquí

    // Si solo se actualiza el monto
    if (body.monto_bs !== undefined && Object.keys(body).length === 1) {
      const result = await updateMonto(id, body.monto_bs)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({ data: result.data })
    }

    // Actualización completa
    const updateData: any = {}
    if (body.nombre) updateData.nombre = body.nombre
    if (body.celular) updateData.celular = body.celular
    if (body.monto_bs !== undefined) updateData.montoBs = body.monto_bs
    if (body.estado) updateData.estado = body.estado

    const result = await updateTarjeta(id, updateData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar tarjeta" }, { status: 500 })
  }
}

// DELETE /api/tarjetas/[id] - Eliminar tarjeta
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // Añadir await aquí
    const result = await deleteTarjeta(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: "Tarjeta eliminada correctamente" })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar tarjeta" }, { status: 500 })
  }
}