import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const project=JSON.parse(readFileSync(new URL("../.vercel/project.json",import.meta.url),"utf8"));
if(project.projectName!=="muiz-sales-crm-preview")throw new Error("Refusing to configure an unrelated Vercel project");
const source=readFileSync(new URL("../.env.local",import.meta.url),"utf8");
for(const name of ["NEXT_PUBLIC_CONVEX_URL","NEXT_PUBLIC_CONVEX_SITE_URL","CRM_CAPTURE_SECRET","NEXT_PUBLIC_VAPID_PUBLIC_KEY"]){
 const value=source.match(new RegExp(`^${name}=(.*)$`,"m"))?.[1]?.trim();if(!value)throw new Error(`Missing ${name}`);
 const result=spawnSync("npx",["--yes","vercel@latest","env","add",name,"preview"],{input:value,encoding:"utf8",stdio:["pipe","pipe","pipe"]});
 if(result.status!==0)throw new Error(`Could not configure ${name}; provider output withheld`);
 console.log(`Configured preview variable ${name}`);
}
