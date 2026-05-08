import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { createSessionCookie, createSessionToken } from "@/lib/auth";
import { getUserByEmail } from "@/lib/repositories";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { loginSchema } from "@/lib/validators";

const fallbackPasswords: Record<string, string> = {
  "admin@scse.local": bcrypt.hashSync("Admin@12345", 12),
  "user@scse.local": bcrypt.hashSync("User@12345", 12),
};

export async function POST(request: NextRequest) {
  const blocked = rateLimit(request, "login", 10, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);
  const hash = user && "passwordHash" in user ? user.passwordHash : fallbackPasswords[parsed.data.email];
  const passwordOk = hash ? await bcrypt.compare(parsed.data.password, hash) : false;

  if (!user || !user.active || !passwordOk) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return Response.json(
    { data: { userId: user.id, email: user.email, role: user.role, name: user.name, avatar: user.avatar } },
    { headers: { "Set-Cookie": createSessionCookie(token) } },
  );
}
