import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users, tokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import { validateLoginData } from "@/lib/validations/auth"
import { randomUUID } from "crypto"
import { compare } from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validation = validateLoginData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const { email, password } = validation.validData!

    // Buscar usuario por email
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = existingUser[0]

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 401 }
      )
    }

    // Verificar contraseña usando bcrypt compare
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Contraseña incorrecta" },
        { status: 401 }
      )
    }

    // Generar token de sesión
    const sessionToken = randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días

    // Guardar token en la base de datos
    await db.insert(tokens).values({
      userId: user.id,
      token: sessionToken,
      type: "session",
      expiresAt
    })

    // Retornar datos del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: sessionToken,
      message: "Inicio de sesión exitoso"
    })

  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}