import type { NextRequest } from "next/server";
import { createCategory, getCategories } from "@/lib/repositories";
import { requireSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { categorySchema } from "@/lib/validators";

export async function GET() {
  return Response.json({ data: await getCategories() });
}

export async function POST(request: NextRequest) {
  const blocked = rateLimit(request, "category-create", 30, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN"]);
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  return Response.json({ data: await createCategory(parsed.data) }, { status: 201 });
}
