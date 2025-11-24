import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { NewUser } from "@/types"
import { validateRegisterData } from "@/lib/validations/auth"
import { hash } from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const validation = validateRegisterData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const { nombres, apellidos, email, telefono, password } = validation.validData!

    // Verificar si el usuario ya existe
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "El email ya está registrado" },
        { status: 409 }
      )
    }

    // Crear nuevo usuario
    const hashedPassword = await hash(password, 12)
    const newUser: NewUser = {
      nombres,
      apellidos,
      email,
      telefono: telefono || null,
      password: hashedPassword,
      rol: "user"
    }

    const result = await db.insert(users).values(newUser).returning({
      id: users.id,
      nombres: users.nombres,
      apellidos: users.apellidos,
      email: users.email,
      telefono: users.telefono,
      rol: users.rol,
      createdAt: users.createdAt
    })

    return NextResponse.json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: result[0]
    }, { status: 201 })

  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}