import type { NextRequest } from "next/server";
import { createPost, getPostsPage } from "@/lib/repositories";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { requireSession } from "@/lib/auth";
import { listQuerySchema, postUpsertSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = listQuerySchema.safeParse(params);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { page, pageSize, q, category, status } = parsed.data;
  const publicOnly = request.nextUrl.searchParams.get("public") === "true";
  const result = await getPostsPage({ page, pageSize, q, category, status, publicOnly });

  return Response.json({
    data: result.data,
    pagination: { page, pageSize, total: result.total, totalPages: Math.ceil(result.total / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const blocked = rateLimit(request, "post-create", 60, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN", "USER"]);
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = postUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const post = await createPost({
    ...parsed.data,
    thumbnail: parsed.data.thumbnail || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    authorId: auth.session.userId,
  });

  return Response.json({ data: post }, { status: 201 });
}
