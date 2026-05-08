import type { NextRequest } from "next/server";
import { deletePost, getPostById, updatePost } from "@/lib/repositories";
import { requireSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { postUpsertSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const post = await getPostById(id);

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json({ data: post });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const blocked = rateLimit(request, "post-update", 80, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN", "USER"]);
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const current = await getPostById(id);
  if (!current) return Response.json({ error: "Post not found" }, { status: 404 });
  if (auth.session.role !== "ADMIN" && current.authorId !== auth.session.userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = postUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const post = await updatePost(id, {
    ...parsed.data,
    thumbnail: parsed.data.thumbnail || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
  });

  return Response.json({ data: post });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const blocked = rateLimit(request, "post-delete", 30, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN"]);
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  await deletePost(id);
  return Response.json({ data: { ok: true } });
}
