import { createHmac, randomInt, timingSafeEqual } from "crypto";

type Challenge={hash:string;expires:number;attempts:number;lastSent:number};
const globalStore=globalThis as typeof globalThis&{statsChallenges?:Map<string,Challenge>};
export const challenges=globalStore.statsChallenges??(globalStore.statsChallenges=new Map());
const secret=()=>process.env.STATS_SESSION_SECRET||"";
export function newCode(key:string){const code=randomInt(0,100_000_000).toString().padStart(8,"0");challenges.set(key,{hash:digest(code),expires:Date.now()+10*60_000,attempts:0,lastSent:Date.now()});return code;}
export function verifyCode(key:string,code:string){const item=challenges.get(key);if(!item||Date.now()>item.expires||item.attempts>=5)return false;item.attempts++;const ok=safe(item.hash,digest(code));if(ok)challenges.delete(key);return ok;}
export function sessionToken(){const expires=Date.now()+30*60_000;return `${expires}.${createHmac("sha256",secret()).update(String(expires)).digest("hex")}`;}
export function validSession(token?:string){if(!token||!secret())return false;const [expires,signature]=token.split(".");return Number(expires)>Date.now()&&safe(signature,createHmac("sha256",secret()).update(expires).digest("hex"));}
function digest(value:string){return createHmac("sha256",secret()).update(value).digest("hex");}
function safe(a:string,b:string){try{return timingSafeEqual(Buffer.from(a),Buffer.from(b));}catch{return false;}}
