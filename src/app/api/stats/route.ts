import { cookies } from "next/headers";
import { validSession } from "../../lib/statsAuth";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(){const token=(await cookies()).get("stats_session")?.value;if(!validSession(token))return new Response("Authentication required",{status:401});const key=process.env.STATS_SERVICE_KEY;if(!key)return new Response("Statistics service is not configured",{status:503});const base=process.env.BACKEND_BASE_URL||"http://localhost:8080";const response=await fetch(`${base}/api/stats`,{headers:{"X-Stats-Service-Key":key},cache:"no-store"});return new Response(response.body,{status:response.status,headers:{"content-type":"application/json"}});}
