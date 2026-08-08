import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Harus masuk terlebih dahulu" }, { status: 401 });
  }
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { teamId: true },
  });
  return NextResponse.json({ teamIds: favorites.map((f) => f.teamId) });
}

async function readTeamId(request: Request): Promise<number | null> {
  let body: { teamId?: unknown };
  try {
    body = await request.json();
  } catch {
    return null;
  }
  const id = Number(body.teamId);
  return Number.isInteger(id) ? id : null;
}

async function requireUser() {
  const user = await getSession();
  return user;
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Harus masuk terlebih dahulu" }, { status: 401 });
  }
  const teamId = await readTeamId(request);
  if (teamId === null) {
    return NextResponse.json({ error: "teamId tidak valid" }, { status: 400 });
  }
  await prisma.favorite.upsert({
    where: { userId_teamId: { userId: user.id, teamId } },
    create: { userId: user.id, teamId },
    update: {},
  });
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { teamId: true },
  });
  return NextResponse.json({ teamIds: favorites.map((f) => f.teamId) });
}

export async function DELETE(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Harus masuk terlebih dahulu" }, { status: 401 });
  }
  const teamId = await readTeamId(request);
  if (teamId === null) {
    return NextResponse.json({ error: "teamId tidak valid" }, { status: 400 });
  }
  await prisma.favorite.deleteMany({ where: { userId: user.id, teamId } });
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { teamId: true },
  });
  return NextResponse.json({ teamIds: favorites.map((f) => f.teamId) });
}
