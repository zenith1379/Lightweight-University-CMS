import { getDashboardData } from "@/lib/repositories";

export async function GET() {
  return Response.json(await getDashboardData(), {
    headers: {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
    },
  });
}
