import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const team = await provider.getTeam(Number(id));
  if (!team) return NextResponse.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  return NextResponse.json(team);
}
