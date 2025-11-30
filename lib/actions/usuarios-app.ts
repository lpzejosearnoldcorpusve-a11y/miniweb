"use server"

import { db } from "@/db"
import { usuariosApp, tokensApp, tarjetasRfid } from "@/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { NewUsuarioApp, ApiResponse, UsuarioApp, UsuarioAppWithTarjetas } from "@/types"
import crypto from "crypto"

// Helper to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Helper to generate secure token
function generateToken(): string {
  return crypto.randomBytes(64).toString("hex")
}

// GET - Obtener todos los usuarios app
export async function getUsuariosApp(): Promise<ApiResponse<UsuarioAppWithTarjetas[]>> {
  try {
    const usuarios = await db.select().from(usuariosApp).orderBy(desc(usuariosApp.createdAt))

    // Enrich with tarjetas count
    const enrichedUsuarios = await Promise.all(
      usuarios.map(async (usuario) => {
        const tarjetas = await db.select().from(tarjetasRfid).where(eq(tarjetasRfid.usuarioAppId, usuario.id))

        const tokensActivos = await db
          .select({ count: sql<number>`count(*)` })
          .from(tokensApp)
          .where(eq(tokensApp.usuarioAppId, usuario.id))

        return {
          ...usuario,
          tarjetas,
          tokensActivos: Number(tokensActivos[0]?.count || 0),
        }
      }),
    )

    return { success: true, data: enrichedUsuarios }
  } catch (error) {
    console.error("Error fetching usuarios app:", error)
    return { success: false, error: "Error al obtener usuarios de la app" }
  }
}

// GET by ID - Obtener usuario app por ID
export async function getUsuarioAppById(id: string): Promise<ApiResponse<UsuarioAppWithTarjetas>> {
  try {
    const [usuario] = await db.select().from(usuariosApp).where(eq(usuariosApp.id, id))

    if (!usuario) {
      return { success: false, error: "Usuario no encontrado" }
    }

    const tarjetas = await db.select().from(tarjetasRfid).where(eq(tarjetasRfid.usuarioAppId, usuario.id))

    const tokens = await db.select().from(tokensApp).where(eq(tokensApp.usuarioAppId, usuario.id))

    return {
      success: true,
      data: {
        ...usuario,
        tarjetas,
        tokensActivos: tokens.length,
      },
    }
  } catch (error) {
    console.error("Error fetching usuario app:", error)
    return { success: false, error: "Error al obtener usuario" }
  }
}

// POST - Crear nuevo usuario app
export async function createUsuarioApp(
  data: Omit<NewUsuarioApp, "id" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<UsuarioApp>> {
  try {
    const hashedPassword = hashPassword(data.password)

    const [newUsuario] = await db
      .insert(usuariosApp)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning()

    revalidatePath("/dashboard/usuarios-app")
    return { success: true, data: newUsuario, message: "Usuario creado exitosamente" }
  } catch (error: unknown) {
    console.error("Error creating usuario app:", error)
    if (error instanceof Error && error.message.includes("unique")) {
      return { success: false, error: "El carnet de identidad ya está registrado" }
    }
    return { success: false, error: "Error al crear usuario" }
  }
}

// PUT - Actualizar usuario app
export async function updateUsuarioApp(
  id: string,
  data: Partial<Omit<NewUsuarioApp, "id" | "createdAt">>,
): Promise<ApiResponse<UsuarioApp>> {
  try {
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() }

    // If password is being updated, hash it
    if (data.password) {
      updateData.password = hashPassword(data.password)
    }

    const [updated] = await db.update(usuariosApp).set(updateData).where(eq(usuariosApp.id, id)).returning()

    if (!updated) {
      return { success: false, error: "Usuario no encontrado" }
    }

    revalidatePath("/dashboard/usuarios-app")
    return { success: true, data: updated, message: "Usuario actualizado exitosamente" }
  } catch (error) {
    console.error("Error updating usuario app:", error)
    return { success: false, error: "Error al actualizar usuario" }
  }
}

// DELETE - Eliminar usuario app
export async function deleteUsuarioApp(id: string): Promise<ApiResponse<null>> {
  try {
    const [deleted] = await db.delete(usuariosApp).where(eq(usuariosApp.id, id)).returning()

    if (!deleted) {
      return { success: false, error: "Usuario no encontrado" }
    }

    revalidatePath("/dashboard/usuarios-app")
    return { success: true, message: "Usuario eliminado exitosamente" }
  } catch (error) {
    console.error("Error deleting usuario app:", error)
    return { success: false, error: "Error al eliminar usuario" }
  }
}

// Update last connection
export async function updateUltimaConexion(id: string): Promise<ApiResponse<null>> {
  try {
    await db.update(usuariosApp).set({ ultimaConexion: new Date() }).where(eq(usuariosApp.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error updating ultima conexion:", error)
    return { success: false, error: "Error al actualizar última conexión" }
  }
}

// TOKEN MANAGEMENT

// Create token for user
export async function createTokenApp(
  usuarioAppId: string,
  type = "access",
  deviceInfo?: string,
  ipAddress?: string,
): Promise<ApiResponse<{ token: string; expiresAt: Date }>> {
  try {
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await db.insert(tokensApp).values({
      usuarioAppId,
      token,
      type,
      deviceInfo,
      ipAddress,
      expiresAt,
    })

    return { success: true, data: { token, expiresAt } }
  } catch (error) {
    console.error("Error creating token:", error)
    return { success: false, error: "Error al crear token" }
  }
}

// Validate token
export async function validateTokenApp(token: string): Promise<ApiResponse<UsuarioApp>> {
  try {
    const [tokenRecord] = await db.select().from(tokensApp).where(eq(tokensApp.token, token))

    if (!tokenRecord) {
      return { success: false, error: "Token inválido" }
    }

    if (new Date() > tokenRecord.expiresAt) {
      await db.delete(tokensApp).where(eq(tokensApp.id, tokenRecord.id))
      return { success: false, error: "Token expirado" }
    }

    const [usuario] = await db.select().from(usuariosApp).where(eq(usuariosApp.id, tokenRecord.usuarioAppId))

    if (!usuario) {
      return { success: false, error: "Usuario no encontrado" }
    }

    // Update last connection
    await updateUltimaConexion(usuario.id)

    return { success: true, data: usuario }
  } catch (error) {
    console.error("Error validating token:", error)
    return { success: false, error: "Error al validar token" }
  }
}

// Revoke token
export async function revokeTokenApp(token: string): Promise<ApiResponse<null>> {
  try {
    await db.delete(tokensApp).where(eq(tokensApp.token, token))
    return { success: true, message: "Token revocado exitosamente" }
  } catch (error) {
    console.error("Error revoking token:", error)
    return { success: false, error: "Error al revocar token" }
  }
}

// Revoke all tokens for user
export async function revokeAllTokensApp(usuarioAppId: string): Promise<ApiResponse<null>> {
  try {
    await db.delete(tokensApp).where(eq(tokensApp.usuarioAppId, usuarioAppId))
    revalidatePath("/dashboard/usuarios-app")
    return { success: true, message: "Todos los tokens revocados" }
  } catch (error) {
    console.error("Error revoking all tokens:", error)
    return { success: false, error: "Error al revocar tokens" }
  }
}

// Link tarjeta to usuario app
export async function vincularTarjeta(usuarioAppId: string, tarjetaId: string): Promise<ApiResponse<null>> {
  try {
    await db.update(tarjetasRfid).set({ usuarioAppId }).where(eq(tarjetasRfid.id, tarjetaId))

    revalidatePath("/dashboard/usuarios-app")
    revalidatePath("/dashboard/tarjetas")
    return { success: true, message: "Tarjeta vinculada exitosamente" }
  } catch (error) {
    console.error("Error linking tarjeta:", error)
    return { success: false, error: "Error al vincular tarjeta" }
  }
}

// Unlink tarjeta from usuario app
export async function desvincularTarjeta(tarjetaId: string): Promise<ApiResponse<null>> {
  try {
    await db.update(tarjetasRfid).set({ usuarioAppId: null }).where(eq(tarjetasRfid.id, tarjetaId))

    revalidatePath("/dashboard/usuarios-app")
    revalidatePath("/dashboard/tarjetas")
    return { success: true, message: "Tarjeta desvinculada exitosamente" }
  } catch (error) {
    console.error("Error unlinking tarjeta:", error)
    return { success: false, error: "Error al desvincular tarjeta" }
  }
}

// App Login
export async function loginUsuarioApp(
  carnetIdentidad: string,
  password: string,
  deviceInfo?: string,
  ipAddress?: string,
): Promise<ApiResponse<{ usuario: UsuarioApp; token: string; expiresAt: Date }>> {
  try {
    const hashedPassword = hashPassword(password)

    const [usuario] = await db.select().from(usuariosApp).where(eq(usuariosApp.carnetIdentidad, carnetIdentidad))

    if (!usuario) {
      return { success: false, error: "Credenciales inválidas" }
    }

    if (usuario.password !== hashedPassword) {
      return { success: false, error: "Credenciales inválidas" }
    }

    if (usuario.estado !== "activo") {
      return { success: false, error: "Usuario suspendido o inactivo" }
    }

    // Create token
    const tokenResult = await createTokenApp(usuario.id, "access", deviceInfo, ipAddress)

    if (!tokenResult.success || !tokenResult.data) {
      return { success: false, error: "Error al generar token" }
    }

    // Update last connection
    await updateUltimaConexion(usuario.id)

    return {
      success: true,
      data: {
        usuario,
        token: tokenResult.data.token,
        expiresAt: tokenResult.data.expiresAt,
      },
    }
  } catch (error) {
    console.error("Error login usuario app:", error)
    return { success: false, error: "Error al iniciar sesión" }
  }
}
