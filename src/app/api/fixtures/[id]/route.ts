import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const match = await provider.getMatch(Number(id));
  if (!match) return NextResponse.json({ error: "Pertandingan tidak ditemukan" }, { status: 404 });
  return NextResponse.json(match);
}
