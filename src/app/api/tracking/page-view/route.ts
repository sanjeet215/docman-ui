export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const backend = (process.env.BACKEND_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
  const body = await request.json().catch(() => null) as { path?: unknown } | null;
  const path = typeof body?.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 300) : "/";
  const headers = new Headers({ "x-original-path": path });
  for (const name of ["cf-connecting-ip", "cf-ipcountry", "x-forwarded-for", "user-agent"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetch(`${backend}/api/tracking/page-view`, { method: "POST", headers, cache: "no-store" });
    return new Response(null, { status: response.status });
  } catch {
    return new Response(null, { status: 503 });
  }
}
