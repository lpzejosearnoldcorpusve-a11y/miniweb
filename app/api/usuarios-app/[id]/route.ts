import { type NextRequest, NextResponse } from "next/server"
import { getUsuarioAppById, updateUsuarioApp, deleteUsuarioApp } from "@/lib/actions/usuarios-app"

// GET - Obtener usuario app por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getUsuarioAppById(id)

  if (!result.success) {
    return NextResponse.json(result, { status: 404 })
  }

  return NextResponse.json(result)
}

// PUT - Actualizar usuario app
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const result = await updateUsuarioApp(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in PUT /api/usuarios-app/[id]:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar usuario app
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await deleteUsuarioApp(id)

  if (!result.success) {
    return NextResponse.json(result, { status: 404 })
  }

  return NextResponse.json(result)
}
