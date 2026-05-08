import type { NextRequest } from "next/server";
import { getMenus, replaceMenus } from "@/lib/repositories";
import { requireSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { menuSchema } from "@/lib/validators";

export async function GET() {
  return Response.json({ data: await getMenus() });
}

export async function PUT(request: NextRequest) {
  const blocked = rateLimit(request, "menus-update", 30, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN"]);
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = menuSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  return Response.json({ data: await replaceMenus(parsed.data) });
}
