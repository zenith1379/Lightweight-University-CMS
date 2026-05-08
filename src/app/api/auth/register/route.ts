import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { createSessionCookie, createSessionToken } from "@/lib/auth";
import { createUser } from "@/lib/repositories";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { userCreateSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const blocked = rateLimit(request, "register", 10, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const parsed = userCreateSchema.safeParse({ ...body, role: "USER", active: true });

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: "USER",
    avatar: parsed.data.avatar || null,
    active: true,
  });
  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return Response.json(
    { data: { userId: user.id, email: user.email, role: user.role, name: user.name } },
    { status: 201, headers: { "Set-Cookie": createSessionCookie(token) } },
  );
}
