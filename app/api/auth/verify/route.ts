import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { tokens, users } from "@/db/schema"
import { eq, and, gt } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token requerido" },
        { status: 400 }
      )
    }

    // Verificar token en la base de datos
    const existingToken = await db
      .select({
        token: tokens.token,
        expiresAt: tokens.expiresAt,
        user: {
          id: users.id,
          nombres: users.nombres,
          apellidos: users.apellidos,
          email: users.email,
          telefono: users.telefono,
          rol: users.rol,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(tokens)
      .innerJoin(users, eq(tokens.userId, users.id))
      .where(
        and(
          eq(tokens.token, token),
          eq(tokens.type, "session"),
          gt(tokens.expiresAt, new Date())
        )
      )
      .limit(1)

    if (existingToken.length === 0) {
      return NextResponse.json(
        { success: false, error: "Token inválido o expirado" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: existingToken[0].user,
      message: "Token válido"
    })

  } catch (error) {
    console.error("Verify token API error:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token requerido" },
        { status: 400 }
      )
    }

    // Eliminar token (logout)
    await db
      .delete(tokens)
      .where(
        and(
          eq(tokens.token, token),
          eq(tokens.type, "session")
        )
      )

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente"
    })

  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}