import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET() {
  const assisters = await provider.getTopAssists();
  return NextResponse.json(assisters);
}
