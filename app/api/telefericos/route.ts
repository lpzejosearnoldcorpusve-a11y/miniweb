import { NextResponse } from "next/server"
import { getTelefericos } from "@/lib/actions/transport"

export async function GET() {
  const data = await getTelefericos()
  return NextResponse.json(data)
}
