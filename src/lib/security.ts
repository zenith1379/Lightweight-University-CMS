import type { NextRequest } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, key: string, limit = 60, windowMs = 60_000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const current = buckets.get(bucketKey);

  if (!current || current.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count > limit) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return null;

  try {
    if (new URL(origin).host !== host) {
      return Response.json({ error: "Invalid request origin" }, { status: 403 });
    }
  } catch {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  return null;
}
