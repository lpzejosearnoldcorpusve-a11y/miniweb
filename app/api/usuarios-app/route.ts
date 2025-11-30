import { type NextRequest, NextResponse } from "next/server"
import { getUsuariosApp, createUsuarioApp } from "@/lib/actions/usuarios-app"

// GET - Obtener todos los usuarios app
export async function GET() {
  const result = await getUsuariosApp()

  if (!result.success) {
    return NextResponse.json(result, { status: 500 })
  }

  return NextResponse.json(result)
}

// POST - Crear nuevo usuario app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      carnetIdentidad,
      ciudad,
      complemento,
      fechaNacimiento,
      celular,
      password,
    } = body

    if (
      !nombres ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !carnetIdentidad ||
      !ciudad ||
      !fechaNacimiento ||
      !celular ||
      !password
    ) {
      return NextResponse.json(
        { success: false, error: "Todos los campos obligatorios son requeridos" },
        { status: 400 },
      )
    }

    const result = await createUsuarioApp({
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      carnetIdentidad,
      ciudad,
      complemento: complemento || null,
      fechaNacimiento,
      celular,
      password,
      estado: "activo",
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/usuarios-app:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
