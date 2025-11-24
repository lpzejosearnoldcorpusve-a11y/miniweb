import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { hash } from "bcrypt"

// Tipos para TypeScript
interface UpdateUserRequest {
  nombres?: string
  apellidos?: string
  email?: string
  telefono?: string
  password?: string
  rol?: string
}

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validar ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "ID de usuario no válido" }, 
        { status: 400 }
      )
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      )
    }

    // Excluir contraseña de la respuesta
    const { password, ...userWithoutPassword } = user[0]
    
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al obtener usuario" }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateUserRequest = await request.json()

    // Validar ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "ID de usuario no válido" }, 
        { status: 400 }
      )
    }

    // Verificar que el usuario existe antes de actualizar
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      )
    }

    // Preparar datos para actualización
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Campos opcionales con validación
    if (body.nombres !== undefined) {
      if (!body.nombres.trim()) {
        return NextResponse.json(
          { error: "El nombre no puede estar vacío" }, 
          { status: 400 }
        )
      }
      updateData.nombres = body.nombres.trim()
    }

    if (body.apellidos !== undefined) {
      if (!body.apellidos.trim()) {
        return NextResponse.json(
          { error: "Los apellidos no pueden estar vacíos" }, 
          { status: 400 }
        )
      }
      updateData.apellidos = body.apellidos.trim()
    }

    if (body.email !== undefined) {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: "El formato del email no es válido" }, 
          { status: 400 }
        )
      }
      
      // Verificar que el email no esté en uso por otro usuario
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, body.email.toLowerCase().trim()))
        .limit(1)

      if (emailExists.length > 0 && emailExists[0].id !== id) {
        return NextResponse.json(
          { error: "El email ya está en uso por otro usuario" }, 
          { status: 409 }
        )
      }
      
      updateData.email = body.email.toLowerCase().trim()
    }

    if (body.telefono !== undefined) {
      updateData.telefono = body.telefono.trim() || null
    }

    if (body.rol !== undefined) {
      // Validar roles permitidos
      const allowedRoles = ['user', 'admin'] // Ajusta según tus necesidades
      if (!allowedRoles.includes(body.rol)) {
        return NextResponse.json(
          { error: "Rol no válido" }, 
          { status: 400 }
        )
      }
      updateData.rol = body.rol
    }

    if (body.password !== undefined) {
      // Validar longitud de contraseña
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 6 caracteres" }, 
          { status: 400 }
        )
      }
      // Hash de la nueva contraseña
      updateData.password = await hash(body.password, 12)
    }

    // Actualizar usuario
    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()

    // Excluir contraseña de la respuesta
    const { password, ...userWithoutPassword } = updatedUser[0]
    
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error updating user:", error)
    
    // Manejar errores específicos de la base de datos
    if (error instanceof Error) {
      if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: "El email ya está en uso" }, 
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar usuario" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validar ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "ID de usuario no válido" }, 
        { status: 400 }
      )
    }

    // Verificar que el usuario existe antes de eliminar
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      )
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    return NextResponse.json(
      { message: "Usuario eliminado correctamente" }
    )
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar usuario" }, 
      { status: 500 }
    )
  }
}