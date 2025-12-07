"use server"

import { db } from "@/db"
import { reportesTrameaje, infracciones, placas, choferes, usuariosApp, users } from "@/db/schema"
import { eq, desc, and, gte, lte, sql, ilike } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type {
  ReporteTrameaje,
  NewReporteTrameaje,
  ReporteTrameajeWithDetails,
  Infraccion,
  PlacaWithChofer,
  Chofer,
  ReporteEstadisticas,
  HistorialReporte,
} from "@/types/reportes"

// ==================== REPORTES ====================

export async function getReportes(filters?: {
  estado?: string
  prioridad?: string
  tipoReporte?: string
  fechaInicio?: string
  fechaFin?: string
  placa?: string
  linea?: string
}): Promise<ReporteTrameajeWithDetails[]> {
  try {
    const conditions = []

    if (filters?.estado) {
      conditions.push(eq(reportesTrameaje.estado, filters.estado))
    }
    if (filters?.prioridad) {
      conditions.push(eq(reportesTrameaje.prioridad, filters.prioridad))
    }
    if (filters?.tipoReporte) {
      conditions.push(eq(reportesTrameaje.tipoReporte, filters.tipoReporte))
    }
    if (filters?.fechaInicio) {
      conditions.push(gte(reportesTrameaje.horaReporte, new Date(filters.fechaInicio)))
    }
    if (filters?.fechaFin) {
      conditions.push(lte(reportesTrameaje.horaReporte, new Date(filters.fechaFin)))
    }
    if (filters?.placa) {
      conditions.push(ilike(reportesTrameaje.placa, `%${filters.placa}%`))
    }
    if (filters?.linea) {
      conditions.push(ilike(reportesTrameaje.linea, `%${filters.linea}%`))
    }

    const result = await db
      .select()
      .from(reportesTrameaje)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reportesTrameaje.horaReporte))

    // Fetch related data
    const reportesWithDetails: ReporteTrameajeWithDetails[] = await Promise.all(
      result.map(async (reporte) => {
        let usuarioApp = null
        let revisadoPorUsuario = null
        let infraccion = null

        if (reporte.usuarioAppId) {
          const [usuario] = await db
            .select({
              id: usuariosApp.id,
              nombres: usuariosApp.nombres,
              apellidoPaterno: usuariosApp.apellidoPaterno,
              apellidoMaterno: usuariosApp.apellidoMaterno,
              celular: usuariosApp.celular,
            })
            .from(usuariosApp)
            .where(eq(usuariosApp.id, reporte.usuarioAppId))
          usuarioApp = usuario || null
        }

        if (reporte.revisadoPor) {
          const [revisor] = await db
            .select({
              id: users.id,
              nombres: users.nombres,
              apellidos: users.apellidos,
            })
            .from(users)
            .where(eq(users.id, reporte.revisadoPor))
          revisadoPorUsuario = revisor || null
        }

        if (reporte.infraccionGenerada) {
          const [inf] = await db.select().from(infracciones).where(eq(infracciones.id, reporte.infraccionGenerada))
          infraccion = inf || null
        }

        return {
          ...reporte,
          usuarioApp,
          revisadoPorUsuario,
          infraccion,
        }
      }),
    )

    return reportesWithDetails
  } catch (error) {
    console.error("Error fetching reportes:", error)
    return []
  }
}

export async function getReporteById(id: string): Promise<ReporteTrameajeWithDetails | null> {
  try {
    const [reporte] = await db.select().from(reportesTrameaje).where(eq(reportesTrameaje.id, id))

    if (!reporte) return null

    let usuarioApp = null
    let revisadoPorUsuario = null
    let infraccion = null

    if (reporte.usuarioAppId) {
      const [usuario] = await db
        .select({
          id: usuariosApp.id,
          nombres: usuariosApp.nombres,
          apellidoPaterno: usuariosApp.apellidoPaterno,
          apellidoMaterno: usuariosApp.apellidoMaterno,
          celular: usuariosApp.celular,
        })
        .from(usuariosApp)
        .where(eq(usuariosApp.id, reporte.usuarioAppId))
      usuarioApp = usuario || null
    }

    if (reporte.revisadoPor) {
      const [revisor] = await db
        .select({
          id: users.id,
          nombres: users.nombres,
          apellidos: users.apellidos,
        })
        .from(users)
        .where(eq(users.id, reporte.revisadoPor))
      revisadoPorUsuario = revisor || null
    }

    if (reporte.infraccionGenerada) {
      const [inf] = await db.select().from(infracciones).where(eq(infracciones.id, reporte.infraccionGenerada))
      infraccion = inf || null
    }

    return {
      ...reporte,
      usuarioApp,
      revisadoPorUsuario,
      infraccion,
    }
  } catch (error) {
    console.error("Error fetching reporte:", error)
    return null
  }
}

export async function createReporte(data: NewReporteTrameaje): Promise<ReporteTrameaje | null> {
  try {
    const [reporte] = await db
      .insert(reportesTrameaje)
      .values({
        ...data,
        horaReporte: new Date(),
      })
      .returning()

    revalidatePath("/dashboard/reportes")
    return reporte
  } catch (error) {
    console.error("Error creating reporte:", error)
    return null
  }
}

export async function updateReporte(id: string, data: Partial<ReporteTrameaje>): Promise<ReporteTrameaje | null> {
  try {
    const [reporte] = await db
      .update(reportesTrameaje)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(reportesTrameaje.id, id))
      .returning()

    revalidatePath("/dashboard/reportes")
    return reporte
  } catch (error) {
    console.error("Error updating reporte:", error)
    return null
  }
}

export async function deleteReporte(id: string): Promise<boolean> {
  try {
    await db.delete(reportesTrameaje).where(eq(reportesTrameaje.id, id))
    revalidatePath("/dashboard/reportes")
    return true
  } catch (error) {
    console.error("Error deleting reporte:", error)
    return false
  }
}

export async function verificarReporte(
  id: string,
  revisadoPor: string,
  generarInfraccion = true,
): Promise<{ reporte: ReporteTrameaje; infraccion?: Infraccion } | null> {
  try {
    const [reporte] = await db.select().from(reportesTrameaje).where(eq(reportesTrameaje.id, id))

    if (!reporte) return null

    let infraccionCreada: Infraccion | undefined

    if (generarInfraccion) {
      // Find or create placa record
      let [placaRecord] = await db.select().from(placas).where(eq(placas.placa, reporte.placa))

      if (!placaRecord) {
        const tipoPlaca = reporte.placa.length === 8 ? "moderna" : "antigua"
        const [newPlaca] = await db
          .insert(placas)
          .values({
            placa: reporte.placa,
            tipoPlaca,
            linea: reporte.linea,
          })
          .returning()
        placaRecord = newPlaca
      }

      // Create infraccion
      const [infraccion] = await db
        .insert(infracciones)
        .values({
          placaId: placaRecord.id,
          choferId: placaRecord.choferId,
          tipoInfraccion: reporte.tipoReporte,
          descripcion: reporte.mensaje || `Reporte de ${reporte.tipoReporte} verificado`,
          montoBs: 100, // Multa de 100bs
          estado: "pendiente",
          fechaInfraccion: reporte.horaSuceso,
        })
        .returning()

      infraccionCreada = infraccion

      // Update reporte with infraccion reference
      await db
        .update(reportesTrameaje)
        .set({
          estado: "verificado",
          revisadoPor,
          infraccionGenerada: infraccion.id,
          fechaResolucion: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(reportesTrameaje.id, id))
    } else {
      await db
        .update(reportesTrameaje)
        .set({
          estado: "verificado",
          revisadoPor,
          fechaResolucion: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(reportesTrameaje.id, id))
    }

    const [updatedReporte] = await db.select().from(reportesTrameaje).where(eq(reportesTrameaje.id, id))

    revalidatePath("/dashboard/reportes")
    return { reporte: updatedReporte, infraccion: infraccionCreada }
  } catch (error) {
    console.error("Error verificando reporte:", error)
    return null
  }
}

export async function getReportesEstadisticas(): Promise<ReporteEstadisticas> {
  try {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pendientes: sql<number>`count(*) filter (where ${reportesTrameaje.estado} = 'pendiente')::int`,
        enRevision: sql<number>`count(*) filter (where ${reportesTrameaje.estado} = 'en_revision')::int`,
        verificados: sql<number>`count(*) filter (where ${reportesTrameaje.estado} = 'verificado')::int`,
        rechazados: sql<number>`count(*) filter (where ${reportesTrameaje.estado} = 'rechazado')::int`,
        resueltos: sql<number>`count(*) filter (where ${reportesTrameaje.estado} = 'resuelto')::int`,
        conInfraccion: sql<number>`count(*) filter (where ${reportesTrameaje.infraccionGenerada} is not null)::int`,
      })
      .from(reportesTrameaje)

    // Get total monto from generated infracciones
    const [montoStats] = await db
      .select({
        montoTotal: sql<number>`coalesce(sum(${infracciones.montoBs}), 0)::float`,
      })
      .from(infracciones)
      .innerJoin(reportesTrameaje, eq(infracciones.id, reportesTrameaje.infraccionGenerada))

    return {
      totalReportes: stats?.total || 0,
      pendientes: stats?.pendientes || 0,
      enRevision: stats?.enRevision || 0,
      verificados: stats?.verificados || 0,
      rechazados: stats?.rechazados || 0,
      resueltos: stats?.resueltos || 0,
      infraccionesGeneradas: stats?.conInfraccion || 0,
      montoTotalInfracciones: montoStats?.montoTotal || 0,
    }
  } catch (error) {
    console.error("Error getting estadisticas:", error)
    return {
      totalReportes: 0,
      pendientes: 0,
      enRevision: 0,
      verificados: 0,
      rechazados: 0,
      resueltos: 0,
      infraccionesGeneradas: 0,
      montoTotalInfracciones: 0,
    }
  }
}

export async function getHistorialReportes(
  page = 1,
  pageSize = 20,
): Promise<{ data: HistorialReporte[]; total: number }> {
  try {
    const offset = (page - 1) * pageSize

    const result = await db
      .select({
        id: reportesTrameaje.id,
        placa: reportesTrameaje.placa,
        linea: reportesTrameaje.linea,
        tipoReporte: reportesTrameaje.tipoReporte,
        estado: reportesTrameaje.estado,
        prioridad: reportesTrameaje.prioridad,
        horaReporte: reportesTrameaje.horaReporte,
        horaSuceso: reportesTrameaje.horaSuceso,
        usuarioAppId: reportesTrameaje.usuarioAppId,
        evidenciaImagenes: reportesTrameaje.evidenciaImagenes,
        evidenciaVideos: reportesTrameaje.evidenciaVideos,
        evidenciaAudios: reportesTrameaje.evidenciaAudios,
      })
      .from(reportesTrameaje)
      .orderBy(desc(reportesTrameaje.horaReporte))
      .limit(pageSize)
      .offset(offset)

    const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(reportesTrameaje)

    const historial: HistorialReporte[] = await Promise.all(
      result.map(async (r) => {
        let usuarioReportador: string | undefined

        if (r.usuarioAppId) {
          const [usuario] = await db
            .select({
              nombres: usuariosApp.nombres,
              apellidoPaterno: usuariosApp.apellidoPaterno,
            })
            .from(usuariosApp)
            .where(eq(usuariosApp.id, r.usuarioAppId))

          if (usuario) {
            usuarioReportador = `${usuario.nombres} ${usuario.apellidoPaterno}`
          }
        }

        const imagenes = r.evidenciaImagenes as string[] | null
        const videos = r.evidenciaVideos as string[] | null
        const audios = r.evidenciaAudios as string[] | null

        return {
          id: r.id,
          placa: r.placa,
          linea: r.linea,
          tipoReporte: r.tipoReporte,
          estado: r.estado,
          prioridad: r.prioridad,
          horaReporte: r.horaReporte.toISOString(),
          horaSuceso: r.horaSuceso.toISOString(),
          usuarioReportador,
          tieneEvidencia: (imagenes?.length || 0) + (videos?.length || 0) + (audios?.length || 0) > 0,
        }
      }),
    )

    return {
      data: historial,
      total: countResult?.count || 0,
    }
  } catch (error) {
    console.error("Error getting historial:", error)
    return { data: [], total: 0 }
  }
}

// ==================== INFRACCIONES ====================

export async function getInfracciones(): Promise<InfraccionWithDetails[]> {
  try {
    const result = await db.select().from(infracciones).orderBy(desc(infracciones.fechaInfraccion))

    const infraccionesWithDetails = await Promise.all(
      result.map(async (inf) => {
        let placa = null
        let chofer = null

        const [placaRecord] = await db.select().from(placas).where(eq(placas.id, inf.placaId))
        placa = placaRecord || null

        if (inf.choferId) {
          const [choferRecord] = await db.select().from(choferes).where(eq(choferes.id, inf.choferId))
          chofer = choferRecord || null
        }

        return { ...inf, placa, chofer }
      }),
    )

    return infraccionesWithDetails
  } catch (error) {
    console.error("Error fetching infracciones:", error)
    return []
  }
}

export async function pagarInfraccion(id: string): Promise<Infraccion | null> {
  try {
    const [infraccion] = await db
      .update(infracciones)
      .set({
        estado: "pagada",
        fechaPago: new Date(),
      })
      .where(eq(infracciones.id, id))
      .returning()

    revalidatePath("/dashboard/reportes")
    return infraccion
  } catch (error) {
    console.error("Error pagando infraccion:", error)
    return null
  }
}

// ==================== PLACAS & CHOFERES ====================

export async function getPlacas(): Promise<PlacaWithChofer[]> {
  try {
    const result = await db.select().from(placas).orderBy(desc(placas.createdAt))

    const placasWithChofer = await Promise.all(
      result.map(async (p) => {
        let chofer = null
        if (p.choferId) {
          const [choferRecord] = await db.select().from(choferes).where(eq(choferes.id, p.choferId))
          chofer = choferRecord || null
        }
        return { ...p, chofer }
      }),
    )

    return placasWithChofer
  } catch (error) {
    console.error("Error fetching placas:", error)
    return []
  }
}

export async function getChoferes(): Promise<Chofer[]> {
  try {
    return await db.select().from(choferes).orderBy(desc(choferes.createdAt))
  } catch (error) {
    console.error("Error fetching choferes:", error)
    return []
  }
}

import type { InfraccionWithDetails } from "@/types/reportes"
