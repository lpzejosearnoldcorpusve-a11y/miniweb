import { NextResponse } from "next/server"
import { getMinibuses } from "@/lib/actions/transport"

export async function GET() {
  const data = await getMinibuses()
  return NextResponse.json(data)
}
