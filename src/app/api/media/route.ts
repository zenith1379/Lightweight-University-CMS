import type { NextRequest } from "next/server";
import { createMedia, getMedia } from "@/lib/repositories";
import { requireSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { storeMediaFile } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ["ADMIN", "USER"]);
  if ("response" in auth) return auth.response;

  return Response.json({ data: await getMedia() });
}

export async function POST(request: NextRequest) {
  const blocked = rateLimit(request, "media-upload", 30, 60_000) ?? assertSameOrigin(request);
  if (blocked) return blocked;

  const auth = await requireSession(request, ["ADMIN", "USER"]);
  if ("response" in auth) return auth.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const alt = form?.get("alt");

  if (!(file instanceof File)) {
    return Response.json({ error: "Image file is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only images are allowed" }, { status: 400 });
  }

  try {
    const stored = await storeMediaFile(file);
    const media = await createMedia({
      ...stored,
      alt: typeof alt === "string" ? alt : file.name,
      uploadedBy: auth.session.userId,
    });

    return Response.json({ data: media }, { status: 201 });
  } catch (error: unknown) {
    console.error("Media upload error:", error);
    return Response.json({ error: error instanceof Error ? error.message : "Failed to upload file to storage" }, { status: 500 });
  }
}
