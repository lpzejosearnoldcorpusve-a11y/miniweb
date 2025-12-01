"use server"

import { db } from "@/db"
import { vehiculosGps, ubicacionesGps, transaccionesRfid, estadisticasViaje, tarjetasRfid } from "@/db/schema"
import { eq, desc, and, gte } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { HardwareGpsPayload, VerificacionPagoResponse } from "@/types/gps"

// ============ VEHICULOS GPS ============

export async function getVehiculos() {
  try {
    const result = await db.select().from(vehiculosGps).orderBy(desc(vehiculosGps.createdAt))
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching vehiculos:", error)
    return { success: false, error: "Error al obtener vehículos" }
  }
}

export async function getVehiculoByPlaca(placa: string) {
  try {
    const result = await db.select().from(vehiculosGps).where(eq(vehiculosGps.placa, placa))
    return { success: true, data: result[0] || null }
  } catch (error) {
    console.error("Error fetching vehiculo:", error)
    return { success: false, error: "Error al obtener vehículo" }
  }
}

export async function createVehiculo(data: {
  placa: string
  linea: string
  tipoVehiculo?: string
  transporteId?: string
}) {
  try {
    const result = await db
      .insert(vehiculosGps)
      .values({
        placa: data.placa,
        linea: data.linea,
        tipoVehiculo: data.tipoVehiculo || "minibus",
        transporteId: data.transporteId,
      })
      .returning()
    revalidatePath("/dashboard/mapa-gps")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error creating vehiculo:", error)
    return { success: false, error: "Error al crear vehículo" }
  }
}

export async function updateVehiculo(
  id: string,
  data: Partial<{
    placa: string
    linea: string
    tipoVehiculo: string
    estado: string
    transporteId: string
  }>,
) {
  try {
    const result = await db
      .update(vehiculosGps)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vehiculosGps.id, id))
      .returning()
    revalidatePath("/dashboard/mapa-gps")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error updating vehiculo:", error)
    return { success: false, error: "Error al actualizar vehículo" }
  }
}

export async function deleteVehiculo(id: string) {
  try {
    await db.delete(vehiculosGps).where(eq(vehiculosGps.id, id))
    revalidatePath("/dashboard/mapa-gps")
    return { success: true }
  } catch (error) {
    console.error("Error deleting vehiculo:", error)
    return { success: false, error: "Error al eliminar vehículo" }
  }
}

// ============ UBICACIONES GPS ============

export async function registrarUbicacion(data: {
  vehiculoId: string
  latitud: number
  longitud: number
  velocidad?: number
  direccion?: number
  satelites?: number
}) {
  try {
    const result = await db
      .insert(ubicacionesGps)
      .values({
        vehiculoId: data.vehiculoId,
        latitud: data.latitud,
        longitud: data.longitud,
        velocidad: data.velocidad || 0,
        direccion: data.direccion || 0,
        satelites: data.satelites || 0,
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error registering location:", error)
    return { success: false, error: "Error al registrar ubicación" }
  }
}

export async function getUltimasUbicaciones() {
  try {
    // Get the latest location for each active vehicle
    const vehiculos = await db.select().from(vehiculosGps).where(eq(vehiculosGps.estado, "activo"))

    const ubicaciones = await Promise.all(
      vehiculos.map(async (v) => {
        const ubicacion = await db
          .select()
          .from(ubicacionesGps)
          .where(eq(ubicacionesGps.vehiculoId, v.id))
          .orderBy(desc(ubicacionesGps.timestamp))
          .limit(1)

        return {
          ...v,
          ubicacion: ubicacion[0] || null,
        }
      }),
    )

    return { success: true, data: ubicaciones }
  } catch (error) {
    console.error("Error fetching locations:", error)
    return { success: false, error: "Error al obtener ubicaciones" }
  }
}

// ============ TRANSACCIONES RFID ============

export async function verificarPagoRfid(data: {
  rfidUid: string
  monto: number
  tipoPago?: string
  vehiculoId?: string
  latitud?: number
  longitud?: number
}): Promise<VerificacionPagoResponse> {
  try {
    // Find the card by UID
    const tarjeta = await db.select().from(tarjetasRfid).where(eq(tarjetasRfid.uid, data.rfidUid))

    if (!tarjeta[0]) {
      return {
        success: false,
        message: "Tarjeta no encontrada",
      }
    }

    if (tarjeta[0].estado !== "activa") {
      return {
        success: false,
        message: "Tarjeta inactiva o bloqueada",
      }
    }

    // Calculate discount based on payment type
    let descuento = 0
    let montoFinal = data.monto

    if (data.tipoPago === "estudiante") {
      descuento = 50
      montoFinal = data.monto * 0.5
    } else if (data.tipoPago === "tercera_edad") {
      descuento = 100
      montoFinal = 0
    }

    // Check sufficient balance
    if (tarjeta[0].montoBs < montoFinal) {
      return {
        success: false,
        message: "Saldo insuficiente",
        saldoRestante: tarjeta[0].montoBs,
      }
    }

    // Deduct balance
    const nuevoSaldo = tarjeta[0].montoBs - montoFinal
    await db
      .update(tarjetasRfid)
      .set({ montoBs: nuevoSaldo, updatedAt: new Date() })
      .where(eq(tarjetasRfid.id, tarjeta[0].id))

    // Create transaction record
    const transaccion = await db
      .insert(transaccionesRfid)
      .values({
        tarjetaId: tarjeta[0].id,
        vehiculoId: data.vehiculoId,
        rfidUid: data.rfidUid,
        monto: montoFinal,
        tipoPago: data.tipoPago || "normal",
        descuento,
        estado: "completado",
        saldoRestante: nuevoSaldo,
        latitud: data.latitud,
        longitud: data.longitud,
      })
      .returning()

    return {
      success: true,
      message: "Pago completado exitosamente",
      transaccionId: transaccion[0].id,
      saldoRestante: nuevoSaldo,
      tipoPago: data.tipoPago || "normal",
      descuento,
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      success: false,
      message: "Error al procesar el pago",
    }
  }
}

export async function getTransacciones(filtros?: {
  vehiculoId?: string
  tarjetaId?: string
  fechaInicio?: Date
  fechaFin?: Date
}) {
  try {
    let query = db.select().from(transaccionesRfid)

    if (filtros?.vehiculoId) {
      query = query.where(eq(transaccionesRfid.vehiculoId, filtros.vehiculoId)) as typeof query
    }

    const result = await query.orderBy(desc(transaccionesRfid.fechaHora))
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, error: "Error al obtener transacciones" }
  }
}

// ============ HARDWARE GPS ENDPOINT ============

export async function procesarDatosHardware(payload: HardwareGpsPayload) {
  try {
    // 1. Find or create vehicle
    const vehiculo = await db.select().from(vehiculosGps).where(eq(vehiculosGps.placa, payload.placa))

    let vehiculoId: string

    if (!vehiculo[0]) {
      // Create new vehicle
      const newVehiculo = await db
        .insert(vehiculosGps)
        .values({
          placa: payload.placa,
          linea: payload.linea,
          tipoVehiculo: "minibus",
        })
        .returning()
      vehiculoId = newVehiculo[0].id
    } else {
      vehiculoId = vehiculo[0].id
    }

    // 2. Register GPS location
    await registrarUbicacion({
      vehiculoId,
      latitud: payload.latitud,
      longitud: payload.longitud,
      velocidad: payload.velocidad,
      direccion: payload.direccion,
      satelites: payload.satelites,
    })

    // 3. Process transactions
    const transaccionesResult = []
    for (const trans of payload.transacciones) {
      const result = await verificarPagoRfid({
        rfidUid: trans.rfid_id,
        monto: trans.monto,
        tipoPago: trans.tipo_pago,
        vehiculoId,
        latitud: payload.latitud,
        longitud: payload.longitud,
      })
      transaccionesResult.push(result)
    }

    // 4. Update trip statistics
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const statsExistentes = await db
      .select()
      .from(estadisticasViaje)
      .where(and(eq(estadisticasViaje.vehiculoId, vehiculoId), gte(estadisticasViaje.fechaInicio, hoy)))

    if (statsExistentes[0]) {
      await db
        .update(estadisticasViaje)
        .set({
          totalPasajeros: (statsExistentes[0].totalPasajeros || 0) + payload.estadisticas.total_pasajeros,
          totalRecaudado: (statsExistentes[0].totalRecaudado || 0) + payload.estadisticas.total_recaudado,
          pagosNormales: (statsExistentes[0].pagosNormales || 0) + payload.estadisticas.pagos_normales,
          pagosEstudiante: (statsExistentes[0].pagosEstudiante || 0) + payload.estadisticas.pagos_estudiante,
          pagosTerceraEdad: (statsExistentes[0].pagosTerceraEdad || 0) + payload.estadisticas.pagos_tercera_edad,
        })
        .where(eq(estadisticasViaje.id, statsExistentes[0].id))
    } else {
      await db.insert(estadisticasViaje).values({
        vehiculoId,
        totalPasajeros: payload.estadisticas.total_pasajeros,
        totalRecaudado: payload.estadisticas.total_recaudado,
        pagosNormales: payload.estadisticas.pagos_normales,
        pagosEstudiante: payload.estadisticas.pagos_estudiante,
        pagosTerceraEdad: payload.estadisticas.pagos_tercera_edad,
      })
    }

    return {
      success: true,
      message: "Datos procesados correctamente",
      vehiculoId,
      transacciones: transaccionesResult,
    }
  } catch (error) {
    console.error("Error processing hardware data:", error)
    return { success: false, error: "Error al procesar datos del hardware" }
  }
}

export async function getEstadisticasHoy() {
  try {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const stats = await db.select().from(estadisticasViaje).where(gte(estadisticasViaje.fechaInicio, hoy))

    const totales = stats.reduce(
      (acc, s) => ({
        totalPasajeros: acc.totalPasajeros + (s.totalPasajeros || 0),
        totalRecaudado: acc.totalRecaudado + (s.totalRecaudado || 0),
        pagosNormales: acc.pagosNormales + (s.pagosNormales || 0),
        pagosEstudiante: acc.pagosEstudiante + (s.pagosEstudiante || 0),
        pagosTerceraEdad: acc.pagosTerceraEdad + (s.pagosTerceraEdad || 0),
      }),
      {
        totalPasajeros: 0,
        totalRecaudado: 0,
        pagosNormales: 0,
        pagosEstudiante: 0,
        pagosTerceraEdad: 0,
      },
    )

    return { success: true, data: totales }
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
