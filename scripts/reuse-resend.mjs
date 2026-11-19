import {readFileSync,writeFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const project=JSON.parse(readFileSync(new URL("../.vercel/project.json",import.meta.url),"utf8"));
if(project.projectName!=="casevia-io")throw new Error("Refusing to read configuration from an unrelated project");
function api(endpoint){const result=spawnSync("npx",["--yes","vercel@latest","api",endpoint,"--scope","knuckleclots-projects","--raw"],{encoding:"utf8",stdio:["ignore","pipe","pipe"]});if(result.status!==0)throw new Error("Scoped Vercel request failed; response withheld");return JSON.parse(result.stdout);}
// List encrypted metadata solely to locate the one approved variable's ID.
// Never decrypt, persist or display other production configuration.
const metadata=api(`/v10/projects/${project.projectId}/env?decrypt=false`);
const target=(metadata.envs??metadata).find(row=>row.key==="RESEND_API_KEY"&&row.target?.includes("production"));
if(!target?.id)throw new Error("RESEND_API_KEY is not configured for this project");
const item=api(`/v1/projects/${project.projectId}/env/${target.id}`);
if(item.key!=="RESEND_API_KEY"||typeof item.value!=="string"||!item.value.startsWith("re_"))throw new Error("The single Resend variable could not be decrypted; value withheld");
const secretPath=new URL("../.env.crm-secrets.local",import.meta.url),localPath=new URL("../.env.local",import.meta.url);
for(const path of [secretPath,localPath]){const text=readFileSync(path,"utf8").replace(/^RESEND_API_KEY=.*\n?/gm,"");writeFileSync(path,`${text}\nRESEND_API_KEY=${item.value}\n`,{mode:0o600});}
for(const target of [[],["--prod"]]){const result=spawnSync("npx",["convex","env","set",...target,"RESEND_API_KEY",item.value],{encoding:"utf8",stdio:["ignore","pipe","pipe"]});if(result.status!==0)throw new Error("Could not set CRM Resend variable; output withheld");}
console.log("Reused only the existing Resend sending key in the CRM's development and production server environments. No unrelated secret was decrypted or saved.");
