import { NextResponse } from "next/server"
import { getTarjetas, createTarjeta, getTarjetaByUid } from "@/lib/actions/tarjetas"

// Store para UIDs pendientes del ESP8266 (en memoria por simplicidad)
let pendingUids: string[] = []

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")
    const action = searchParams.get("action")

    // Para el frontend: obtener UID pendiente del ESP8266
    if (action === "pending") {
      const pendingUid = pendingUids.shift() // FIFO
      console.log(`🔍 Frontend consultando pendientes. Cola actual: ${pendingUids.length} items. Enviando: ${pendingUid || 'null'}`)
      console.log(`📋 Cola después de shift: [${pendingUids.join(', ')}]`)
      return NextResponse.json({ uid: pendingUid || null })
    }

    // Si se proporciona UID, buscar esa tarjeta específica (ESP8266)
    if (uid) {
      const result = await getTarjetaByUid(uid)

      if (!result.success) {
        return NextResponse.json({ error: result.error, registered: false }, { status: 404 })
      }

      return NextResponse.json({
        registered: true,
        data: result.data,
      })
    }

    // Si no hay UID, devolver todas las tarjetas
    const result = await getTarjetas()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar solicitud" }, { status: 500 })
  }
}

// POST /api/tarjetas - Registrar nueva tarjeta o recibir UID del ESP8266
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    // Endpoint para ESP8266 enviar UID detectado
    if (action === "detect") {
      const { uid } = body
      if (!uid) {
        return NextResponse.json({ error: "UID requerido" }, { status: 400 })
      }

      // Agregar a la cola de UIDs pendientes
      pendingUids.push(uid)
      console.log(`🎯 ESP8266 detectó tarjeta UID: ${uid}. Cola ahora tiene ${pendingUids.length} items`)
      console.log(`📋 Cola completa: [${pendingUids.join(', ')}]`)
      return NextResponse.json({ success: true, message: "UID recibido" })
    }

    // Validar campos requeridos para crear tarjeta
    if (!body.uid || !body.nombre || !body.celular) {
      return NextResponse.json({ error: "Faltan campos requeridos: uid, nombre, celular" }, { status: 400 })
    }

    const result = await createTarjeta({
      uid: body.uid,
      nombre: body.nombre,
      celular: body.celular,
      montoBs: body.monto_bs || 0,
      estado: body.estado || "activa",
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear tarjeta" }, { status: 500 })
  }
}
