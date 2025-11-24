"use server"

import { db } from "@/db"
import { tarjetasRfid } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { NewTarjetaRfid } from "@/types"

export async function getTarjetas() {
  try {
    const tarjetas = await db.select().from(tarjetasRfid).orderBy(tarjetasRfid.createdAt)
    return { success: true, data: tarjetas }
  } catch (error) {
    console.error("Error getting tarjetas:", error)
    return { success: false, error: "Error al obtener tarjetas" }
  }
}

export async function getTarjetaByUid(uid: string) {
  try {
    const tarjeta = await db.select().from(tarjetasRfid).where(eq(tarjetasRfid.uid, uid)).limit(1)

    if (tarjeta.length === 0) {
      return { success: false, error: "Tarjeta no encontrada" }
    }

    return { success: true, data: tarjeta[0] }
  } catch (error) {
    console.error("Error getting tarjeta by UID:", error)
    return { success: false, error: "Error al buscar tarjeta" }
  }
}

export async function createTarjeta(data: NewTarjetaRfid) {
  try {
    const newTarjeta = await db.insert(tarjetasRfid).values(data).returning()
    revalidatePath("/dashboard/tarjetas")
    return { success: true, data: newTarjeta[0] }
  } catch (error) {
    console.error("Error creating tarjeta:", error)
    return { success: false, error: "Error al crear tarjeta" }
  }
}

export async function updateTarjeta(id: string, data: Partial<NewTarjetaRfid>) {
  try {
    const updatedTarjeta = await db
      .update(tarjetasRfid)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tarjetasRfid.id, id))
      .returning()

    revalidatePath("/dashboard/tarjetas")
    return { success: true, data: updatedTarjeta[0] }
  } catch (error) {
    console.error("Error updating tarjeta:", error)
    return { success: false, error: "Error al actualizar tarjeta" }
  }
}

export async function updateMonto(id: string, nuevoMonto: number) {
  try {
    const updatedTarjeta = await db
      .update(tarjetasRfid)
      .set({ montoBs: nuevoMonto, updatedAt: new Date() })
      .where(eq(tarjetasRfid.id, id))
      .returning()

    revalidatePath("/dashboard/tarjetas")
    return { success: true, data: updatedTarjeta[0] }
  } catch (error) {
    console.error("Error updating monto:", error)
    return { success: false, error: "Error al actualizar monto" }
  }
}

export async function deleteTarjeta(id: string) {
  try {
    await db.delete(tarjetasRfid).where(eq(tarjetasRfid.id, id))
    revalidatePath("/dashboard/tarjetas")
    return { success: true }
  } catch (error) {
    console.error("Error deleting tarjeta:", error)
    return { success: false, error: "Error al eliminar tarjeta" }
  }
}
