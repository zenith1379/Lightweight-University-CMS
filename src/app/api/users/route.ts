import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { createUser, getUsers } from "@/lib/repositories";
import { requireSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { userCreateSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ["ADMIN"]);
  if ("response" in auth) return auth.response;

  return Response.json({ data: await getUsers() });
}

export async function POST(request: NextRequest) {
  const blocked = rateLimit(request, "user-create", 20, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN"]);
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: parsed.data.role,
    avatar: parsed.data.avatar || null,
    active: parsed.data.active,
  });

  return Response.json({ data: user }, { status: 201 });
}
