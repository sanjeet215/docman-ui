"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../components/Button";

export default function LoginPage(){
 const router=useRouter(); const [register,setRegister]=useState(false); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setBusy(true);setError("");const form=new FormData(event.currentTarget);const body=Object.fromEntries(form.entries());
  const response=await fetch(`/api/auth/${register?"register":"login"}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if(response.ok){router.push("/workflows");router.refresh();}else setError((await response.text())||"Authentication failed");setBusy(false);};
 return <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#E2E1DF] p-5 dark:bg-[#0C3B2E]"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-[#D0C1A9] bg-white p-8 shadow-sm dark:border-[#6D9773]/40 dark:bg-[#173F35]"><h1 className="text-2xl font-semibold text-[#2F180B] dark:text-white">{register?"Create organization":"Sign in"}</h1><p className="mt-2 text-sm text-slate-500 dark:text-white/60">{register?"Your workflows and runs stay isolated inside your organization.":"Access your organization’s workflows."}</p>
 {register&&<><input name="tenantName" required maxLength={120} placeholder="Organization name" className="mt-6 w-full rounded-xl border p-3 dark:bg-[#0C3B2E] dark:text-white"/><input name="displayName" required maxLength={100} placeholder="Your name" className="mt-3 w-full rounded-xl border p-3 dark:bg-[#0C3B2E] dark:text-white"/></>}
 <input name="email" type="email" required placeholder="Email" className={`${register?"mt-3":"mt-6"} w-full rounded-xl border p-3 dark:bg-[#0C3B2E] dark:text-white`}/><input name="password" type="password" required minLength={10} placeholder="Password (10+ characters)" className="mt-3 w-full rounded-xl border p-3 dark:bg-[#0C3B2E] dark:text-white"/>
 {error&&<p className="mt-3 break-words text-sm text-rose-600">{error}</p>}<Button disabled={busy} className="mt-5 w-full justify-center">{busy?"Please wait...":register?"Create account":"Sign in"}</Button><button type="button" onClick={()=>{setRegister(!register);setError("");}} className="mt-4 w-full text-sm font-semibold text-indigo-600">{register?"Already have an account? Sign in":"Create a new organization"}</button><Link href="/" className="mt-3 block text-center text-sm text-slate-500">Back home</Link></form></main>;
}
