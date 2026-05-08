import type { NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  const blocked = assertSameOrigin(request);
  if (blocked) return blocked;

  return Response.json({ data: { ok: true } }, { headers: { "Set-Cookie": clearSessionCookie() } });
}
