import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET() {
  const scorers = await provider.getTopScorers();
  return NextResponse.json(scorers);
}
