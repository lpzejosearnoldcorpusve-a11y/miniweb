import { type NextRequest, NextResponse } from "next/server"
import { getReporteById, updateReporte, deleteReporte } from "@/lib/actions/reportes"

// GET /api/reportes/[id] - Obtener reporte por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const reporte = await getReporteById(id)

    if (!reporte) {
      return NextResponse.json({ success: false, error: "Reporte no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: reporte,
    })
  } catch (error) {
    console.error("Error in GET /api/reportes/[id]:", error)
    return NextResponse.json({ success: false, error: "Error al obtener reporte" }, { status: 500 })
  }
}

// PUT /api/reportes/[id] - Actualizar reporte
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const reporte = await updateReporte(id, {
      estado: body.estado,
      prioridad: body.prioridad,
      notasRevision: body.notasRevision,
      revisadoPor: body.revisadoPor,
    })

    if (!reporte) {
      return NextResponse.json({ success: false, error: "Error al actualizar reporte" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: reporte,
      message: "Reporte actualizado exitosamente",
    })
  } catch (error) {
    console.error("Error in PUT /api/reportes/[id]:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar reporte" }, { status: 500 })
  }
}

// DELETE /api/reportes/[id] - Eliminar reporte
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const success = await deleteReporte(id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Error al eliminar reporte" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Reporte eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error in DELETE /api/reportes/[id]:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar reporte" }, { status: 500 })
  }
}
