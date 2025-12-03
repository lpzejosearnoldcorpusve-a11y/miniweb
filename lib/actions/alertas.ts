"use server"

import { db } from "@/db"
import { alertasGps, asignacionesRuta, vehiculosGps, transportes, rutas } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { SeveridadAlerta, ResultadoVerificacionRuta, EstadisticasAlertas } from "@/types/alertas"

// ============ UTILITY FUNCTIONS ============

// Calculate distance between two points using Haversine formula
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find the closest point on a route to a given location
function encontrarPuntoMasCercano(
  lat: number,
  lng: number,
  puntosRuta: { lat: number; lng: number }[],
): { punto: { lat: number; lng: number }; distancia: number } {
  let minDistancia = Number.POSITIVE_INFINITY
  let puntoMasCercano = puntosRuta[0]

  for (const punto of puntosRuta) {
    const distancia = calcularDistancia(lat, lng, punto.lat, punto.lng)
    if (distancia < minDistancia) {
      minDistancia = distancia
      puntoMasCercano = punto
    }
  }

  return { punto: puntoMasCercano, distancia: minDistancia }
}

// Determine severity based on deviation distance
function determinarSeveridad(distanciaMetros: number): SeveridadAlerta {
  if (distanciaMetros > 1000) return "critica"
  if (distanciaMetros > 500) return "alta"
  if (distanciaMetros > 200) return "media"
  return "baja"
}

// ============ ROUTE VERIFICATION ============

export async function verificarRutaVehiculo(
  vehiculoId: string,
  latitud: number,
  longitud: number,
): Promise<ResultadoVerificacionRuta> {
  try {
    // Get active route assignment for vehicle
    const asignacion = await db
      .select()
      .from(asignacionesRuta)
      .where(and(eq(asignacionesRuta.vehiculoId, vehiculoId), eq(asignacionesRuta.activa, "activa")))
      .limit(1)

    if (!asignacion[0]) {
      return {
        enRuta: true, // No assignment = no deviation alert
        distanciaDesvio: 0,
        puntoMasCercano: { lat: latitud, lng: longitud },
        alertaGenerada: false,
      }
    }

    // Get the route points
    const ruta = await db.select().from(rutas).where(eq(rutas.id, asignacion[0].rutaId)).limit(1)

    if (!ruta[0] || !ruta[0].puntos) {
      return {
        enRuta: true,
        distanciaDesvio: 0,
        puntoMasCercano: { lat: latitud, lng: longitud },
        alertaGenerada: false,
      }
    }

    const puntosRuta = ruta[0].puntos as { lat: number; lng: number }[]
    const tolerancia = asignacion[0].toleranciaMetros || 100

    // Find closest point on route
    const { punto, distancia } = encontrarPuntoMasCercano(latitud, longitud, puntosRuta)

    // Check if vehicle is within tolerance
    const enRuta = distancia <= tolerancia

    let alertaGenerada = false
    let alertaId: string | undefined

    // If off route, create alert
    if (!enRuta) {
      const severidad = determinarSeveridad(distancia)

      // Check if there's already an active alert for this vehicle
      const alertaExistente = await db
        .select()
        .from(alertasGps)
        .where(
          and(
            eq(alertasGps.vehiculoId, vehiculoId),
            eq(alertasGps.tipoAlerta, "desvio_ruta"),
            eq(alertasGps.estado, "activa"),
          ),
        )
        .limit(1)

      if (!alertaExistente[0]) {
        // Create new alert
        const vehiculo = await db.select().from(vehiculosGps).where(eq(vehiculosGps.id, vehiculoId)).limit(1)

        const nuevaAlerta = await db
          .insert(alertasGps)
          .values({
            vehiculoId,
            transporteId: asignacion[0].transporteId,
            rutaId: asignacion[0].rutaId,
            tipoAlerta: "desvio_ruta",
            severidad,
            mensaje: `Vehículo ${vehiculo[0]?.placa || "desconocido"} se desvió ${Math.round(distancia)}m de su ruta asignada`,
            latitud,
            longitud,
            distanciaDesvio: distancia,
          })
          .returning()

        alertaGenerada = true
        alertaId = nuevaAlerta[0].id
      } else {
        // Update existing alert with new location
        await db
          .update(alertasGps)
          .set({
            latitud,
            longitud,
            distanciaDesvio: distancia,
            severidad,
          })
          .where(eq(alertasGps.id, alertaExistente[0].id))
      }
    } else {
      // Vehicle is back on route, resolve any active alerts
      await db
        .update(alertasGps)
        .set({
          estado: "resuelta",
          fechaResolucion: new Date(),
          notasResolucion: "Vehículo volvió a la ruta automáticamente",
        })
        .where(
          and(
            eq(alertasGps.vehiculoId, vehiculoId),
            eq(alertasGps.tipoAlerta, "desvio_ruta"),
            eq(alertasGps.estado, "activa"),
          ),
        )
    }

    revalidatePath("/dashboard/mapa-gps")

    return {
      enRuta,
      distanciaDesvio: distancia,
      puntoMasCercano: punto,
      alertaGenerada,
      alertaId,
    }
  } catch (error) {
    console.error("Error verifying vehicle route:", error)
    return {
      enRuta: true,
      distanciaDesvio: 0,
      puntoMasCercano: { lat: latitud, lng: longitud },
      alertaGenerada: false,
    }
  }
}

// ============ ALERTS CRUD ============

export async function getAlertas(filtros?: {
  estado?: string
  tipoAlerta?: string
  vehiculoId?: string
  limit?: number
}) {
  try {
    let query = db
      .select({
        alerta: alertasGps,
        vehiculo: {
          placa: vehiculosGps.placa,
          linea: vehiculosGps.linea,
          tipoVehiculo: vehiculosGps.tipoVehiculo,
        },
        transporte: {
          sindicato: transportes.sindicato,
          linea: transportes.linea,
          rutaNombre: transportes.rutaNombre,
        },
      })
      .from(alertasGps)
      .leftJoin(vehiculosGps, eq(alertasGps.vehiculoId, vehiculosGps.id))
      .leftJoin(transportes, eq(alertasGps.transporteId, transportes.id))
      .orderBy(desc(alertasGps.fechaAlerta))

    if (filtros?.limit) {
      query = query.limit(filtros.limit) as typeof query
    }

    const result = await query

    const alertas = result.map((r) => ({
      ...r.alerta,
      vehiculo: r.vehiculo,
      transporte: r.transporte,
    }))

    // Filter in JS for simplicity
    let filtered = alertas
    if (filtros?.estado) {
      filtered = filtered.filter((a) => a.estado === filtros.estado)
    }
    if (filtros?.tipoAlerta) {
      filtered = filtered.filter((a) => a.tipoAlerta === filtros.tipoAlerta)
    }
    if (filtros?.vehiculoId) {
      filtered = filtered.filter((a) => a.vehiculoId === filtros.vehiculoId)
    }

    return { success: true, data: filtered }
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return { success: false, error: "Error al obtener alertas" }
  }
}

export async function getAlertasActivas() {
  return getAlertas({ estado: "activa" })
}

export async function actualizarEstadoAlerta(alertaId: string, estado: string, revisadoPor?: string, notas?: string) {
  try {
    const updateData: Record<string, unknown> = { estado }

    if (revisadoPor) updateData.revisadoPor = revisadoPor
    if (notas) updateData.notasResolucion = notas
    if (estado === "resuelta") updateData.fechaResolucion = new Date()

    const result = await db.update(alertasGps).set(updateData).where(eq(alertasGps.id, alertaId)).returning()

    revalidatePath("/dashboard/mapa-gps")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error updating alert:", error)
    return { success: false, error: "Error al actualizar alerta" }
  }
}

export async function getEstadisticasAlertas(): Promise<{
  success: boolean
  data?: EstadisticasAlertas
  error?: string
}> {
  try {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const alertas = await db.select().from(alertasGps)

    const activas = alertas.filter((a) => a.estado === "activa")
    const hoyAlertas = alertas.filter((a) => new Date(a.fechaAlerta) >= hoy)

    const stats: EstadisticasAlertas = {
      totalActivas: activas.length,
      totalHoy: hoyAlertas.length,
      porTipo: {
        desvio_ruta: alertas.filter((a) => a.tipoAlerta === "desvio_ruta").length,
        fuera_servicio: alertas.filter((a) => a.tipoAlerta === "fuera_servicio").length,
        velocidad_excesiva: alertas.filter((a) => a.tipoAlerta === "velocidad_excesiva").length,
        sin_movimiento: alertas.filter((a) => a.tipoAlerta === "sin_movimiento").length,
      },
      porSeveridad: {
        baja: alertas.filter((a) => a.severidad === "baja").length,
        media: alertas.filter((a) => a.severidad === "media").length,
        alta: alertas.filter((a) => a.severidad === "alta").length,
        critica: alertas.filter((a) => a.severidad === "critica").length,
      },
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching alert statistics:", error)
    return { success: false, error: "Error al obtener estadísticas de alertas" }
  }
}

// ============ ROUTE ASSIGNMENTS ============

export async function crearAsignacionRuta(data: {
  vehiculoId: string
  transporteId: string
  rutaId: string
  toleranciaMetros?: number
}) {
  try {
    console.log("crearAsignacionRuta called with:", data)
    // Validate references before mutating DB
    const vehiculo = await db.select().from(vehiculosGps).where(eq(vehiculosGps.id, data.vehiculoId)).limit(1)
    if (!vehiculo[0]) {
      console.warn("crearAsignacionRuta: vehiculo not found", data.vehiculoId)
      return { success: false, error: "Vehículo no encontrado" }
    }

    const transporte = await db.select().from(transportes).where(eq(transportes.id, data.transporteId)).limit(1)
    if (!transporte[0]) {
      console.warn("crearAsignacionRuta: transporte not found", data.transporteId)
      return { success: false, error: "Transporte no encontrado" }
    }

    const ruta = await db.select().from(rutas).where(eq(rutas.id, data.rutaId)).limit(1)
    if (!ruta[0]) {
      console.warn("crearAsignacionRuta: ruta not found", data.rutaId)
      // Verificar si existe alguna ruta para este transporte
      const rutasDelTransporte = await db.select().from(rutas).where(eq(rutas.transporteId, data.transporteId))
      if (rutasDelTransporte.length === 0) {
        return { 
          success: false, 
          error: "Este transporte no tiene una ruta definida. Primero dibuja el recorrido en 'Rutas de Transporte'." 
        }
      }
      return { success: false, error: `Ruta no encontrada (ID: ${data.rutaId.slice(0, 8)}...)` }
    }

    // Make sure the route actually belongs to the transport
    if (ruta[0].transporteId !== data.transporteId) {
      console.warn(
        "crearAsignacionRuta: ruta-transporte mismatch",
        data.rutaId,
        "belongs to",
        ruta[0].transporteId,
        "but request used",
        data.transporteId,
      )
      return { success: false, error: "La ruta seleccionada no pertenece a la línea de transporte indicada" }
    }

    // Deactivate previous assignments for this vehicle
    await db
      .update(asignacionesRuta)
      .set({ activa: "finalizada", fechaFin: new Date() })
      .where(and(eq(asignacionesRuta.vehiculoId, data.vehiculoId), eq(asignacionesRuta.activa, "activa")))

    const result = await db
      .insert(asignacionesRuta)
      .values({
        vehiculoId: data.vehiculoId,
        transporteId: data.transporteId,
        rutaId: data.rutaId,
        toleranciaMetros: data.toleranciaMetros || 100,
      })
      .returning()

    // Also update vehicle with transport reference
    await db.update(vehiculosGps).set({ transporteId: data.transporteId }).where(eq(vehiculosGps.id, data.vehiculoId))

    revalidatePath("/dashboard/mapa-gps")
    return { success: true, data: result[0] }
  } catch (error: any) {
    // Map common foreign key errors to readable messages
    if (error?.constraint) {
      switch (error.constraint) {
        case "asignaciones_ruta_ruta_id_rutas_id_fk":
          return { success: false, error: "Ruta no encontrada" }
        case "asignaciones_ruta_vehiculo_id_vehiculos_gps_id_fk":
          return { success: false, error: "Vehículo no encontrado" }
        case "asignaciones_ruta_transporte_id_transportes_id_fk":
          return { success: false, error: "Transporte no encontrado" }
        default:
          break
      }
    }

    console.error("Error creating route assignment:", error)
    return { success: false, error: "Error al crear asignación de ruta" }
  }
}

export async function getAsignacionesActivas() {
  try {
    const result = await db
      .select({
        asignacion: asignacionesRuta,
        vehiculo: {
          placa: vehiculosGps.placa,
          linea: vehiculosGps.linea,
        },
        transporte: {
          sindicato: transportes.sindicato,
          linea: transportes.linea,
          rutaNombre: transportes.rutaNombre,
        },
      })
      .from(asignacionesRuta)
      .leftJoin(vehiculosGps, eq(asignacionesRuta.vehiculoId, vehiculosGps.id))
      .leftJoin(transportes, eq(asignacionesRuta.transporteId, transportes.id))
      .where(eq(asignacionesRuta.activa, "activa"))

    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching active assignments:", error)
    return { success: false, error: "Error al obtener asignaciones" }
  }
}

export async function finalizarAsignacion(asignacionId: string) {
  try {
    const result = await db
      .update(asignacionesRuta)
      .set({ activa: "finalizada", fechaFin: new Date() })
      .where(eq(asignacionesRuta.id, asignacionId))
      .returning()

    revalidatePath("/dashboard/mapa-gps")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error ending assignment:", error)
    return { success: false, error: "Error al finalizar asignación" }
  }
}
