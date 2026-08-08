import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const form = await provider.getTeamForm(Number(id));
  return NextResponse.json(form);
}
