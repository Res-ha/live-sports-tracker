import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET() {
  const teams = await provider.getTeams();
  return NextResponse.json(teams);
}
