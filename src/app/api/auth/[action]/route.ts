export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const backend = () => (process.env.BACKEND_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
async function proxy(request: Request, action: string, method: string) {
  const headers = new Headers();
  const cookie=request.headers.get("cookie"); if(cookie) headers.set("cookie",cookie);
  for(const name of ["cf-connecting-ip","cf-ipcountry","x-forwarded-for","user-agent"]){const value=request.headers.get(name);if(value)headers.set(name,value);}
  if(method!=="GET") headers.set("content-type","application/json");
  const response=await fetch(`${backend()}/api/auth/${action}`,{method,headers,body:method!=="GET"?await request.text():undefined,cache:"no-store"});
  const output=new Headers({"content-type":response.headers.get("content-type")||"application/json"});
  const setCookie=response.headers.get("set-cookie"); if(setCookie) output.set("set-cookie",setCookie.replace(/Path=\//i,"Path=/"));
  return new Response(response.body,{status:response.status,headers:output});
}
export async function GET(request:Request,context:{params:Promise<{action:string}>}){return proxy(request,(await context.params).action,"GET");}
export async function POST(request:Request,context:{params:Promise<{action:string}>}){return proxy(request,(await context.params).action,"POST");}
