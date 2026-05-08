import type { NextRequest } from "next/server";
import { requireSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { storeMediaFile } from "@/lib/storage";
import { updateMedia } from "@/lib/repositories";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: Context) {
  const blocked = rateLimit(request, "media-update", 30, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN", "USER"]);
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const alt = form?.get("alt");

  const data: { url?: string; key?: string; alt?: string | null } = {
    alt: typeof alt === "string" ? alt : null,
  };

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Only images are allowed" }, { status: 400 });
    }
    Object.assign(data, await storeMediaFile(file));
  }

  const media = await updateMedia(id, data);
  return Response.json({ data: media });
}
