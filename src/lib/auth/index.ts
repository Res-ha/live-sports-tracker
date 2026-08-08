import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { clearSessionCookie, getSessionUserId, setSessionCookie } from "./session";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export class AuthError extends Error {}

export async function getSession(): Promise<AuthUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AuthError("Email sudah terdaftar");

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash: await hashPassword(input.password),
    },
  });
  await setSessionCookie(user.id);
  return { id: user.id, name: user.name, email: user.email };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AuthError("Email atau kata sandi salah");
  }
  await setSessionCookie(user.id);
  return { id: user.id, name: user.name, email: user.email };
}

export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
}
