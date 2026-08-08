import { NextResponse } from "next/server";
import { AuthError, loginUser } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Badan request tidak valid" }, { status: 400 });
  }

  try {
    const user = await loginUser({
      email: body.email ?? "",
      password: body.password ?? "",
    });
    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal masuk" }, { status: 500 });
  }
}
