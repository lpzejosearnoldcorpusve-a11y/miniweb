import { type NextRequest, NextResponse } from "next/server"
import { updateVehiculo, deleteVehiculo } from "@/lib/actions/gps"

// PUT - Update a vehicle
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const result = await updateVehiculo(id, data)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

// DELETE - Delete a vehicle
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await deleteVehiculo(id)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
