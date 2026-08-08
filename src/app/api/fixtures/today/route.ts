import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET() {
  const matches = await provider.getTodayMatches();
  return NextResponse.json(matches);
}
