import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }
  const team = await provider.getTeam(idNum);
  if (!team) return NextResponse.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  return NextResponse.json(team);
}