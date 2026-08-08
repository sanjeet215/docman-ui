import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { challenges,newCode } from "../../../lib/statsAuth";
export const runtime="nodejs";
export async function POST(request:Request){
 const ip=request.headers.get("cf-connecting-ip")||request.headers.get("x-forwarded-for")?.split(",")[0]||"local";const existing=challenges.get(ip);
 if(existing&&Date.now()-existing.lastSent<60_000)return NextResponse.json({error:"Please wait before requesting another code."},{status:429});
 const user=process.env.SMTP_USER,pass=process.env.SMTP_PASS,to=process.env.STATS_ADMIN_EMAIL;if(!user||!pass||!to||!process.env.STATS_SESSION_SECRET)return NextResponse.json({error:"Statistics email authentication is not configured."},{status:503});
 const code=newCode(ip);const transport=nodemailer.createTransport({host:process.env.SMTP_HOST||"smtp.gmail.com",port:Number(process.env.SMTP_PORT||465),secure:(process.env.SMTP_SECURE||"true")==="true",auth:{user,pass}});
 await transport.sendMail({from:`"DevPour Security" <${user}>`,to,subject:"Your DevPour statistics access code",text:`Your one-time code is ${code}. It expires in 10 minutes and can only be used once.`});
 return NextResponse.json({ok:true});
}
