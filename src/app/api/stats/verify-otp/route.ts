import { NextResponse } from "next/server";
import { sessionToken,verifyCode } from "../../../lib/statsAuth";
export const runtime="nodejs";
export async function POST(request:Request){const ip=request.headers.get("cf-connecting-ip")||request.headers.get("x-forwarded-for")?.split(",")[0]||"local";const {code}=await request.json();if(typeof code!=="string"||!verifyCode(ip,code))return NextResponse.json({error:"Invalid or expired code."},{status:401});const response=NextResponse.json({ok:true});response.cookies.set("stats_session",sessionToken(),{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",maxAge:1800,path:"/"});return response;}
