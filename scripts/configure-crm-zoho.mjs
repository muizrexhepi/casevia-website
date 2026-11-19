import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const path = new URL("../.env.crm-secrets.local",import.meta.url);
let source = readFileSync(path,"utf8");
const get = name=>source.match(new RegExp(`^${name}=(.*)$`,"m"))?.[1]?.trim();
function save(values) {
  for(const [key,value] of Object.entries(values)) source=source.replace(new RegExp(`^${key}=.*\\n?`,"gm"),"")+`\n${key}=${value}\n`;
  writeFileSync(path,source,{mode:0o600});
}
const id=get("ZOHO_CLIENT_ID"), secret=get("ZOHO_CLIENT_SECRET");
if(!id||!secret)throw new Error("Missing approved Zoho client credentials");
const refresh=get("ZOHO_REFRESH_TOKEN"), code=get("ZOHO_GRANT_CODE");
if(!refresh&&!code)throw new Error("Missing Zoho grant code");
const tokenResponse=await fetch("https://accounts.zoho.eu/oauth/v2/token",{method:"POST",body:new URLSearchParams({client_id:id,client_secret:secret,grant_type:refresh?"refresh_token":"authorization_code",...(refresh?{refresh_token:refresh}:{code})}),signal:AbortSignal.timeout(20000)});
const token=await tokenResponse.json();
if(!tokenResponse.ok||!token.access_token||(!refresh&&!token.refresh_token))throw new Error(`Zoho token exchange failed (${tokenResponse.status}, ${String(token.error??"missing-token").slice(0,50)})`);
if(token.refresh_token)save({ZOHO_REFRESH_TOKEN:token.refresh_token});
const headers={Authorization:`Zoho-oauthtoken ${token.access_token}`};
const accountsResponse=await fetch("https://mail.zoho.eu/api/accounts",{headers,signal:AbortSignal.timeout(15000)});
const accounts=await accountsResponse.json();
if(!accountsResponse.ok||!Array.isArray(accounts.data))throw new Error(`Zoho Mail accounts unavailable (${accountsResponse.status}); check Mail API plan access`);
const account=accounts.data.find(row=>JSON.stringify(row).toLowerCase().includes("mail@muizrexhepi.com"));
if(!account?.accountId)throw new Error("The authorized account does not contain the business mailbox");
const foldersResponse=await fetch(`https://mail.zoho.eu/api/accounts/${encodeURIComponent(String(account.accountId))}/folders`,{headers,signal:AbortSignal.timeout(15000)});
const folders=await foldersResponse.json();
if(!foldersResponse.ok||!Array.isArray(folders.data))throw new Error(`Zoho folders unavailable (${foldersResponse.status})`);
const inbox=folders.data.find(row=>String(row.folderName??row.folderType).toLowerCase()==="inbox" || row.path==="/Inbox");
if(!inbox?.folderId)throw new Error("No Inbox folder found; refusing to poll other folders");
save({ZOHO_ACCOUNT_ID:String(account.accountId),ZOHO_INBOX_FOLDER_ID:String(inbox.folderId),ZOHO_REGION:"eu"});
source=source.replace(/^ZOHO_GRANT_CODE=.*\n?/gm,"");writeFileSync(path,source,{mode:0o600});
for(const flags of [[],["--prod"]])for(const name of ["ZOHO_CLIENT_ID","ZOHO_CLIENT_SECRET","ZOHO_REFRESH_TOKEN","ZOHO_ACCOUNT_ID","ZOHO_INBOX_FOLDER_ID","ZOHO_REGION"]){
  const value=get(name);if(!value)throw new Error(`Missing ${name}`);
  const result=spawnSync("npx",["convex","env","set",...flags,name,value],{encoding:"utf8",stdio:["ignore","pipe","pipe"]});
  if(result.status!==0)throw new Error(`Could not set ${name}; response withheld`);
  console.log(`Configured ${flags.length?"production":"development"} ${name}`);
}
console.log("Zoho read-only account and Inbox access verified; credentials remain server-side.");
