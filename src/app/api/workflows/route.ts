export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const backend = () => (process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export async function GET(request: Request) { return proxy("GET", request); }
export async function POST(request: Request) { return proxy("POST", request); }

async function proxy(method: string, request?: Request) {
  try {
    const cookie=request?.headers.get("cookie");
    const tracking=Object.fromEntries(["cf-connecting-ip","cf-ipcountry","x-forwarded-for","user-agent"].map(name=>[name,request?.headers.get(name)]).filter((entry):entry is [string,string]=>Boolean(entry[1])));
    const response = await fetch(`${backend()}/api/workflows`, {
      method,
      headers: { ...(request ? { "content-type": "application/json" } : {}), ...(cookie ? {cookie}: {}),...tracking },
      body: request && method !== "GET" ? await request.text() : undefined,
      cache: "no-store",
    });
    return new Response(response.body, { status: response.status, headers: { "content-type": response.headers.get("content-type") || "application/json" } });
  } catch (error) { return new Response(error instanceof Error ? error.message : "Workflow service unavailable", { status: 502 }); }
}
