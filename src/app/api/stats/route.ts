import { getStats } from "@/lib/analytics";
import { NextResponse } from "next/server";

export async function GET() {
  const stats = getStats();
  return NextResponse.json(stats);
}
