import type { NextRequest } from "next/server";
import { getRequestSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getRequestSession(request);

  if (!session) {
    return Response.json({ data: null }, { status: 401 });
  }

  return Response.json({ data: session });
}
