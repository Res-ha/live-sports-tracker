import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET() {
  const standings = await provider.getStandings();
  return NextResponse.json(standings);
}
