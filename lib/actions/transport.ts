"use server"

import { db } from "@/db"
import { telefericos, estaciones, transportes, rutas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { NewTeleferico, NewEstacion, NewTransporte } from "@/types"

// --- Telefericos ---

export async function getTelefericos() {
  try {
    const allTelefericos = await db.select().from(telefericos).orderBy(telefericos.createdAt)

    // Fetch stations for each teleferico
    const results = await Promise.all(
      allTelefericos.map(async (t) => {
        const stations = await db
          .select()
          .from(estaciones)
          .where(eq(estaciones.telefericoId, t.id))
          .orderBy(estaciones.orden)
        return { ...t, estaciones: stations }
      }),
    )

    return results
  } catch (error) {
    console.error("Error fetching telefericos:", error)
    return []
  }
}

export async function createTeleferico(data: NewTeleferico, stations: Omit<NewEstacion, "telefericoId" | "id">[]) {
  try {
    const [newTeleferico] = await db.insert(telefericos).values(data).returning()

    if (stations.length > 0) {
      await db.insert(estaciones).values(stations.map((s) => ({ ...s, telefericoId: newTeleferico.id })))
    }

    revalidatePath("/dashboard/rutas")
    return { success: true, data: newTeleferico }
  } catch (error) {
    console.error("Error creating teleferico:", error)
    return { success: false, error: "Failed to create teleferico" }
  }
}

// --- Minibuses ---

export async function getMinibuses() {
  try {
    const allMinibuses = await db.select().from(transportes).orderBy(transportes.createdAt)

    const results = await Promise.all(
      allMinibuses.map(async (m) => {
        const route = await db.select().from(rutas).where(eq(rutas.transporteId, m.id)).limit(1)
        return { ...m, ruta: route[0]?.puntos || [] }
      }),
    )

    return results
  } catch (error) {
    console.error("Error fetching minibuses:", error)
    return []
  }
}

export async function createMinibus(data: NewTransporte, routePoints: any[]) {
  try {
    const [newTransporte] = await db.insert(transportes).values(data).returning()

    await db.insert(rutas).values({
      transporteId: newTransporte.id,
      puntos: routePoints,
    })

    revalidatePath("/dashboard/rutas")
    return { success: true, data: newTransporte }
  } catch (error) {
    console.error("Error creating minibus:", error)
    return { success: false, error: "Failed to create minibus" }
  }
}

// --- Transportes ---

export async function createTransport(data: NewTransporte) {
  try {
    const [newTransporte] = await db.insert(transportes).values(data).returning()
    revalidatePath("/dashboard/rutas")
    return { success: true, id: newTransporte.id }
  } catch (error) {
    console.error("Error creating transport:", error)
    return { success: false, error: "Failed to create transport" }
  }
}

export async function createRoute(data: { transporte_id: string; nombre: string; puntos: any[] }) {
  try {
    await db.insert(rutas).values({
      transporteId: data.transporte_id,
      puntos: data.puntos,
    })
    revalidatePath("/dashboard/rutas")
    return { success: true }
  } catch (error) {
    console.error("Error creating route:", error)
    return { success: false, error: "Failed to create route" }
  }
}
