import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const source=readFileSync(new URL("../.env.crm-secrets.local",import.meta.url),"utf8");
const deployment=readFileSync(new URL("../.env.local",import.meta.url),"utf8");
if(!deployment.includes("exciting-scorpion-834"))throw new Error("Refusing to configure an unrelated Convex project");
const production=process.argv.includes("--prod");
for(const name of ["AUTH_GITHUB_ID","AUTH_GITHUB_SECRET","OPENAI_API_KEY","OPENAI_ORG_ID","OPENAI_PROJECT_ID"]){
 const value=source.match(new RegExp(`^${name}=(.*)$`,"m"))?.[1]?.trim();if(!value)throw new Error(`Missing ${name}`);
 const result=spawnSync("npx",["convex","env","set",...(production?["--prod"]:[]),name,value],{encoding:"utf8",stdio:["ignore","pipe","pipe"]});
 if(result.status!==0)throw new Error(`Unable to configure ${name}; provider output withheld`);
 console.log(`Configured ${production?"production":"development"} ${name}`);
}
