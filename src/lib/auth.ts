import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import type { Role } from "./domain";

const encoder = new TextEncoder();
export const sessionCookieName = "cms_session";

function getJwtSecret() {
  return encoder.encode(process.env.AUTH_SECRET ?? process.env.JWT_SECRET ?? "dev-only-change-me-in-production");
}

export type SessionClaims = {
  userId: string;
  email: string;
  role: Role;
  name: string;
};

export async function createSessionToken(claims: SessionClaims) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setIssuer("lightweight-university-cms")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    issuer: "lightweight-university-cms",
  });

  return payload as unknown as SessionClaims;
}

export function createSessionCookie(token: string) {
  return `${sessionCookieName}=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Strict; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
}

export function clearSessionCookie() {
  return `${sessionCookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
}

export async function getRequestSession(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireSession(request: NextRequest, roles?: Role[]) {
  const session = await getRequestSession(request);
  if (!session) {
    return { response: Response.json({ error: "Authentication required" }, { status: 401 }) as Response };
  }

  if (roles && !roles.includes(session.role)) {
    return { response: Response.json({ error: "Forbidden" }, { status: 403 }) as Response };
  }

  return { session };
}
