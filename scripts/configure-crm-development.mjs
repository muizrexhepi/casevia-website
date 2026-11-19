import { readFileSync,writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { generateVAPIDKeys } from "web-push";
const path=new URL("../.env.local",import.meta.url);
let source=readFileSync(path,"utf8");
function get(name){return source.match(new RegExp(`^${name}=(.*)$`,"m"))?.[1]?.trim();}
if(!get("CONVEX_DEPLOYMENT")?.includes("exciting-scorpion-834"))throw new Error("Refusing to configure an unrelated deployment");
const keys=generateVAPIDKeys();
const config={CRM_CAPTURE_SECRET:get("CRM_CAPTURE_SECRET")??randomBytes(32).toString("hex"),VAPID_PUBLIC_KEY:get("NEXT_PUBLIC_VAPID_PUBLIC_KEY")??keys.publicKey,VAPID_PRIVATE_KEY:get("VAPID_PRIVATE_KEY")??keys.privateKey};
for(const [name,value] of Object.entries(config)){
 const result=spawnSync("npx",["convex","env","set",name,value],{encoding:"utf8",stdio:["ignore","pipe","pipe"]});
 if(result.status!==0)throw new Error(`Failed to set ${name}; provider output withheld`);
 console.log(`Configured server variable ${name}`);
}
for(const [name,value] of Object.entries({...config,NEXT_PUBLIC_VAPID_PUBLIC_KEY:config.VAPID_PUBLIC_KEY}))if(!get(name))source+=`\n${name}=${value}\n`;
writeFileSync(path,source,{mode:0o600});
console.log("Updated ignored local environment file. No secret values displayed.");
