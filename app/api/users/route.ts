import { db } from "@/db"
import { users } from "@/db/schema"
import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { eq } from "drizzle-orm"

// Tipos para TypeScript
interface CreateUserRequest {
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  password: string
  rol?: string
  [key: string]: string | undefined
}

export async function GET() {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .orderBy(users.createdAt)
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user
      return safeUser
    })
    
    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al obtener usuarios" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateUserRequest = await request.json()
    const requiredFields = ['nombres', 'apellidos', 'email', 'password']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: "Faltan campos obligatorios", 
          fields: missingFields 
        }, 
        { status: 400 }
      )
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" }, 
        { status: 400 }
      )
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" }, 
        { status: 400 }
      )
    }
    // Verificar si el usuario ya existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este email" }, 
        { status: 409 }
      )
    }
    const hashedPassword = await hash(body.password, 12)

    const newUser = await db
      .insert(users)
      .values({
        nombres: body.nombres.trim(),
        apellidos: body.apellidos.trim(),
        email: body.email.toLowerCase().trim(),
        telefono: body.telefono?.trim(),
        password: hashedPassword, 
        rol: body.rol || "user",
      })
      .returning()

    // Excluir la contraseña en la respuesta
    const { password, ...userWithoutPassword } = newUser[0]
    
    return NextResponse.json(userWithoutPassword, { status: 201 })
    
  } catch (error) {
    console.error("Error creating user:", error)
    
    if (error instanceof Error) {
      if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: "Ya existe un usuario con este email" }, 
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor al crear usuario" }, 
      { status: 500 }
    )
  }
}