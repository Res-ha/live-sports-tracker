import { NextResponse } from "next/server";
import { provider } from "@/lib/sports";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const round = Number(url.searchParams.get("round"));
  if (!Number.isInteger(round)) {
    return NextResponse.json({ error: "Parameter round wajib diisi" }, { status: 400 });
  }
  const data = await provider.getRound(round);
  return NextResponse.json(data);
}
