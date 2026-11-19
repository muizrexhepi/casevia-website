# Private CRM setup and operations

## Current development environment

- Repository: `/Users/muizrexhepi/Development/casevia-website`
- Branch: `feat/private-sales-crm`
- Convex project: [muiz-sales-crm](https://dashboard.convex.dev/t/mickamuiz/muiz-sales-crm/exciting-scorpion-834)
- Development URL: `https://exciting-scorpion-834.convex.cloud`
- HTTP actions: `https://exciting-scorpion-834.convex.site`
- Local CRM: `http://localhost:3000/crm`
- Public site routes are preserved in `app/(public)`.
- Production backend: `https://nautical-tapir-784.convex.cloud`; HTTP actions: `https://nautical-tapir-784.convex.site`.
- Production frontend destination: `https://crm.muizrexhepi.com`, Vercel `knuckleclots-projects/casevia-io`. The owner authorized the production release and DNS configuration.

## Owner authentication (required for access)

Uses current stable **Convex Auth v2** with GitHub OAuth. Refresh tokens are held in HTTP-only cookies. Every CRM query/mutation checks the live session and the explicitly configured immutable GitHub owner ID. Account creation and repeat sign-in are also owner restricted. No public signup or development auth bypass exists.

The CRM OAuth app is registered in [GitHub developer settings](https://github.com/settings/applications/4035276):

- Application name: `Muiz Private Sales CRM`
- Homepage URL: `https://crm.muizrexhepi.com`
- Authorization callback: `https://exciting-scorpion-834.convex.site/oauth/github/callback`
- Production callback: `https://nautical-tapir-784.convex.site/oauth/github/callback`
- **AUTH_GITHUB_ID** and **AUTH_GITHUB_SECRET** are configured in both CRM deployments. Wildcard callbacks and device flow remain disabled.
- **CRM_OWNER_GITHUB_ID=90201782** is configured for the public `muizrexhepi` account. Do not use a mutable display name or email as authorization.
- Allowed redirect origins: localhost ports 3000/3001, `https://crm.muizrexhepi.com`, plus the exact server-side `CRM_PREVIEW_ORIGIN` if configured. Redeploy functions after changing an OAuth component binding or preview origin.

Keys must be entered in the provider/deployment settings or a private terminal. Never paste secrets into chat, frontend settings, Git, screenshots, or documentation.

## OpenAI discovery and research

Uses **Responses API**, supported `gpt-6-luna` by default, with `gpt-6.2-sol` available for harder tasks, structured outputs, built-in `web_search`, and a maximum of three tool calls. No second search provider is required.

Configure on Convex:

| Variable          | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| OPENAI_API_KEY    | CRM-specific project API key, server only                       |
| OPENAI_ORG_ID     | Verified organization; currently `org-40APOTJxuKpbOGVE6XtalXzi` |
| OPENAI_PROJECT_ID | Optional explicit project selection; must match the key         |

The signed-in **Personal** organization's billing page showed **$100** remaining on **2026-11-19**, with the displayed grant expiring **2026-12-18**. This observation is not an ongoing live balance integration. No assumption is made about any larger promotional allowance. The dedicated Responses-only key expires **2026-12-19**. Live controlled research and draft generation are verified; renew the key securely before expiry.

Default limits: **$5/day**, **$30/month**, **5 AI jobs/day**, automatic discovery/research/drafting disabled. Job scheduling atomically reserves spending against both periods before enqueueing. Reservations include model input/output and search calls. Search uses the full model context at long-context rates as a conservative ceiling. Text-only input is byte bounded. Actual provider usage settles the reservation using current recorded rates; estimates are clearly separate from manually entered credits. Rates live in `lib/crm/policy.ts`, verified against official pricing on 2026-11-19. Recheck rates when changing model/provider behavior.

AI/network requests are not automatically retried after an ambiguous response. Their reservations remain held until provider usage is reconciled. A failed confirmed request can be retried explicitly with a fresh reservation.

## Contact form and Resend

Configure **RESEND_API_KEY** on both Vercel (existing public contact notification) and the CRM Convex deployment (eligible conversations/owner notifications). Keep the existing verified sender domain.

- CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL default to `mail@muizrexhepi.com` for the public form.
- CRM_FROM_EMAIL defaults to `Muiz Rexhepi <mail@muizrexhepi.com>`.
- CRM_REPLY_TO and CRM_OWNER_EMAIL default to `mail@muizrexhepi.com`.
- **CRM_CAPTURE_SECRET** must match on Vercel and Convex. The development signing secret was generated securely and stored in ignored `.env.local` and the CRM development backend.
- **NEXT_PUBLIC_CONVEX_URL** and **NEXT_PUBLIC_CONVEX_SITE_URL** point at the CRM environment.

Contact capture is HMAC signed, timestamp checked, and idempotent. A configured CRM capture failure prevents reporting the inquiry as successful. Existing Resend owner notifications and their idempotency keys remain intact. A site without CRM capture configuration retains its previous contact behavior.

Resend supports only requested/opted-in communication. It must **never** carry unsolicited cold outreach, including when a draft is owner approved. See [Resend acceptable-use policy](https://resend.com/legal/acceptable-use).

Signed Resend webhooks are configured for development and production:

`https://exciting-scorpion-834.convex.site/webhooks/resend`

`https://nautical-tapir-784.convex.site/webhooks/resend`

**RESEND_WEBHOOK_SECRET** is stored separately on each deployment. Subscribed events include sent, delivered, delayed, failed, bounced, and complained. Raw payloads are verified with current Svix signature/timestamp verification before parsing or processing. Events are deduplicated. Bounce/complaint suppresses the recipient and cancels follow-ups. Use owner-controlled recipients for live tests.

## Prospecting provider

No prospecting vendor has been selected, purchased, or configured. Prospecting sends are blocked. Discovery, research, lead management and drafts work independently.

The provider interface is in `lib/crm/email-provider.ts`. Its configurable HTTPS gateway accepts `from`, `to`, `replyTo`, `subject`, `text`, `idempotencyKey`, an `Idempotency-Key` header and bearer auth; it returns `{ "id": "provider-message-id" }`. Connect the selected vendor's maintained API through an adapter or a gateway implementing this contract. The gateway must enforce vendor idempotency and expose reliable delivery reconciliation. Generic gateway configuration alone does not establish that a vendor is appropriate.

Configure **PROSPECTING_API_URL**, **PROSPECTING_API_KEY**, provider name in Settings, and explicit owner prospecting authorization. A recipient must separately have `prospecting_eligible` status with documented evidence. Every saved draft still needs approval. Do not infer eligibility from a discovered or published address.

## Zoho reply synchronization

Preserves `mail@muizrexhepi.com` and the current MX records. Resend sending does not grant access to this inbox.

Authorize a read-only Zoho Mail integration in the correct data center:

- Scopes: `ZohoMail.messages.READ`; use `ZohoMail.accounts.READ` / `ZohoMail.folders.READ` only if needed to discover account/folder IDs.
- Obtain an offline refresh token via Zoho's supported OAuth flow and store it only in Convex.
- Configure **ZOHO_CLIENT_ID**, **ZOHO_CLIENT_SECRET**, **ZOHO_REFRESH_TOKEN**, **ZOHO_ACCOUNT_ID**, **ZOHO_REGION** (`com`, `eu`, `in`, or `com.au`), and preferably **ZOHO_INBOX_FOLDER_ID**.
- The five-minute server sweep reuses short-lived access tokens in a server-only cache, polls the Inbox with overlap, deduplicates by Zoho message ID, and matches known CRM contacts. It does not change MX, move mail, mark messages read, or send through Zoho.
- Review synchronization errors under Settings → Integrations. `Sync Zoho now` runs a controlled manual synchronization.

Source documentation: [OAuth](https://www.zoho.com/mail/help/api/using-oauth-2.html), [message listing](https://www.zoho.com/mail/help/api/get-emails-list.html), [message content](https://www.zoho.com/mail/help/api/get-email-content.html).

The read-only EU connection is configured in both server environments. Live account/Inbox discovery and matched reply import are verified. A provider refresh throttle during initial backfill led to persisted token reuse and bounded retries. Credentials never reach the frontend.

## Notifications and phone installation

Independent development and production VAPID key pairs are generated and stored securely. VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY belong on Convex; **NEXT_PUBLIC_VAPID_PUBLIC_KEY** is safe for the frontend.

Enable desired notification channels in Settings, choose individual updates or daily digest, and click **Enable on this device**. Permission is requested only after that action. iPhone Web Push requires the installed Home Screen app on a supported iOS release. Real push delivery still requires device permission and a live test.

Manifest: `/crm/manifest.webmanifest`; service worker: `/crm-sw.js`; PNG icons: `/crm-assets/icon-192.png` and `icon-512.png`. Only an inert offline HTML shell and icon are cached. Private CRM pages, correspondence, APIs, React payloads and send intents are never cached or queued offline.

## Automation and operating controls

- Global outbound pause starts **on**. It is checked during queueing and again when the worker claims a send. An already submitted provider request cannot be recalled.
- Draft edits and recipient changes invalidate approval. Every send intent identifies one exact draft revision and has a persistent idempotency key.
- Never blindly retry an uncertain send. Inspect the provider's delivery history and reconcile the result, using its message ID if sent.
- Replies, opt-outs, bounce/complaint, suppression and cancellation stop pending follow-ups.
- Explicit `won` requires outcome evidence. Proposal values are estimates; collected revenue is a separate owner-entered amount.
- Workpool concurrency: two AI jobs, one email job. Provider side effects have automatic retries disabled to avoid duplicate sends/charges. Sweeps recover interrupted jobs into an uncertain state. Read-only mailbox sweeps retain their cursor on failure with exponential backoff, pause after five failures, and support explicit owner recovery. OAuth throttling waits at least ten minutes. Pagination keeps the previous completed watermark until all pages finish; a persisted lease prevents concurrent sweeps. Only known-contact bodies are fetched. Initial history is bounded to the last 30 days plus one day of overlap. Numeric Zoho IDs retain full precision.
- Scheduled discovery runs once/day; new-lead research and qualified-lead drafting follow configured toggles and limits. Eligible follow-up preparation remains in owner approval mode.
- Overview/pipeline use the latest 250 records and label that boundary. Leads use search/stage filters and cursor pagination. History panels and individual lead histories are bounded; this is a private single-owner CRM, not multi-tenant SaaS.

## Vercel and production deployment

Use a separate preview deployment attached to this branch and the CRM development backend. Keep production keys and deployment IDs separate. The checkout is linked to the existing **casevia-io** project in **knuckleclots-projects**, which owns the public portfolio domains. Preview variables are scoped to `feat/private-sales-crm`.

Production release procedure (already authorized):

1. Confirm the Vercel team/project actually serving `muizrexhepi.com`.
2. Provision/configure a Convex production deployment for this CRM and its production-only secrets/OAuth callback.
3. Set matching Vercel environment variables with `node scripts/configure-crm-hosting.mjs --prod`. Deploy the backend with `npx convex deploy`, then the frontend with `vercel deploy --prod --scope knuckleclots-projects`. Build script uses `next build --webpack` on Node 24.
4. `crm.muizrexhepi.com` is attached and verified. Namecheap CNAME host `crm` points to `e7dbc163846c5963.vercel-dns-017.com.`. Root/www and all Zoho MX/SPF/DKIM records are preserved.
5. The host-aware proxy serves `/crm` at the CRM hostname root. `/crm` remains available in development and previews.
6. Run the owner-only workflow with controlled contacts, prove real search accounting and original-source verification, prove Resend eligibility/webhooks, prove Zoho reply cancellation, and test Web Push on the installed phone.
7. Keep live prospecting disabled until the owner explicitly activates a selected appropriate channel.

## Verification commands

Use a supported Node 24 LTS runtime. No global Node change is required; a temporary `npx --package=node@24` runtime is sufficient when the local shell uses another version.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npx convex dev --once
```

The automated suite uses isolated in-memory Convex data and test-only auth component seeding. No test auth function is shipped to Convex, and tests never call live AI/email providers. A successful suite/build does not establish live email delivery, OAuth authorization or phone push acceptance.

Official references: [Convex Auth v2](https://docs.convex.dev/auth/convex-auth), [GitHub OAuth setup](https://docs.convex.dev/auth/convex-auth/methods/oauth), [OpenAI web search](https://developers.openai.com/api/docs/guides/tools-web-search), [OpenAI pricing](https://developers.openai.com/api/docs/pricing).

## Starting your sales workflow

1. Sign in at `https://crm.muizrexhepi.com` with the configured GitHub owner account.
2. In Leads, run Discover leads with a specific industry and location, or add/import leads. Open a lead to review evidence and Generate draft.
3. In Settings, enable automatic discovery, research and drafting after reviewing markets, services, timing, daily volume and spending limits. These use OpenAI credits automatically and continue on the server when devices are off.
4. Review drafts in Inbox & approvals. Save edits before approval; unsaved changes block approval and sending. Approval binds to one saved revision.
5. Prospecting remains disconnected. Requested/opted-in messages can use Resend with explicit permission evidence and owner approval. Resume outbound only when ready.
6. Review synchronized replies and next actions, prepare meetings/proposals, and record won/lost outcomes explicitly.

## Verified costs and account limits (2026-11-19)

OpenAI billing showed **$99.85 credit remaining**, expiring 2026-12-18, with no payment method configured. This is a point-in-time observation. The CRM uses direct Responses API billing, including web search; its ledger is an estimate based on returned usage.

Vercel usage was below its displayed included allowances. The Convex team is on its existing Starter plan: across all projects, database storage was approximately **151.2 MB above the included 512 MB**. CRM-filtered usage was 244 calls and 686.68 KB database I/O at that snapshot; analytics can lag. Do not represent the whole account as free. No paid upgrade or new prospecting subscription was purchased. Resend remaining account quota was not verified because its billing dashboard was signed out. Preserve existing team/project plans and unrelated data.

Production custom-domain sign-in and anonymous access rejection are verified. The phone UI was checked at 390 px without page-level overflow. The owner approved source promotion through [PR #1](https://github.com/muizrexhepi/casevia-website/pull/1) on 2026-11-19, retaining `feat/private-sales-crm`. Future deployments from `main` retain the CRM after this approved merge.

## Economical automation update — 2026-11-19

GPT-6 Luna is the default for routine discovery, research and drafts; GPT-6.2 Sol remains an explicit owner choice. New Astra settings and jobs are rejected server-side, while historical ledger entries remain readable. Each queued job uses the model recorded with its spending reservation, even if the owner changes model settings before it runs. Rates: Luna $0.10 input / $0.50 output per million tokens, Sol $2 / $10, plus $0.01 per billable web search request. Both models support Responses structured outputs and built-in web search. Prices verified against the official model documentation on 2026-11-19.

Live controlled Luna discovery completed with two search requests and settled at $0.0218833; a draft completed at $0.0004402. Type check, lint, production build and 38 tests passed, including concurrent Luna reservations, model changes between queue and execution, disabled Astra scheduling, and approval-only automation.

The initial automation request covered discovery, research and qualified drafts for North Macedonia and Switzerland. The later instructions below supersede the original $30/month, five-job and paused-outbound settings.

### Latest owner instructions — 2026-11-19

Requested activation now includes scheduled discovery, new-lead research, qualified draft preparation, eligible follow-up drafts, and automatic queueing of each exact owner-approved message within sending hours. No unapproved message may send. Prospecting remains disconnected and requires an appropriate configured provider plus recipient eligibility. Requested limits: $5/day, **$75/month**, and **20 AI jobs/day**. These are ceilings, not spending targets or guaranteed lead counts. One lead can consume multiple jobs. The subscription benefit renews on eligible billing cycles and unused credit expires; current official terms are at https://developers.openai.com/api/docs/guides/chatgpt-api-credits.

Follow-up drafting now works while outbound is paused and prepares prospecting-channel drafts for eligible prospects, without allowing them through Resend or bypassing approval. Automatic queueing tests prove unapproved drafts remain untouched and repeated sweeps do not create duplicate send intents. Defaults remain approval-first with automation off until activated in owner settings.

### Verified production activation

Saved settings were reloaded and verified: Luna, North Macedonia and Switzerland, $5/day, $75/month, 20 AI jobs/day, all five automation switches enabled, outbound unpaused. Every message still requires its saved revision's owner approval. Production run history confirms completed automatic Luna discovery and research, with approximately $0.091 total CRM usage at the observation and no send intents. Prospecting remains disconnected, so no cold message can send.

Research scheduling moves New leads to Researching and clears legacy New rows with prior research jobs, preventing old entries from blocking the bounded automatic queue. Discovery requires live web search and excludes the latest 250 known domains in its prompt, with server-side deduplication retained. A regression test covers a full page of old research rows followed by a fresh lead. Monthly app accounting uses calendar months; subscription credits renew and expire on the subscription billing cycle. Limits are maximums, not targets, and other applications can share the organization's credit balance.

## Small-business targeting and source recovery — 2026-11-19

The owner rejected enterprise prospects. Settings now includes an editable ideal customer profile: owner-run guesthouses, small boutique hotels, local tour operators and local professional practices in North Macedonia and Switzerland. Prefer one location and a small team; do not invent employee counts or budgets. Exclude enterprises, chains, Big Four firms, national tourism organizations, large luxury hotels, directories and competing web/design agencies.

Discovery uses focused searches and verifies scale evidence against bounded original business pages. Verified small businesses proceed to automatic research; unsupported candidates are held. Research must establish both small-business fit and a specific service opportunity. A separate opportunity score must reach 20/35 before discovered prospects qualify for automatic outreach drafts or sending; a high generic score alone cannot qualify them. Exact source quotes and URLs are stored. Existing booking features must never be described as absent. Public contact details remain unrelated to recipient permission.

Known enterprise discoveries are excluded before AI spending and removed from default active views. The “Include held / excluded” lead view retains their records and audit history. A bounded internal screening pass handles existing discoveries. Inquiries and explicitly requested conversations remain usable, and new inquiries restore their visibility. Production screening excluded three enterprise/national-tourism discoveries.

Research now reads at most 2 MB per original page instead of failing at 200 KB, and can follow at most two same-business About/Contact pages. Oversized bodies are truncated, scripts discarded, partial sources marked, and truncation never proves a feature is absent. DNS pinning, public-address, HTTPS, redirect and timeout controls remain in force. Contacts come from visible text/mailto links, not scripts or image paths, and retain the exact original source URL.

The internal jobs:retryOversizedSources maintenance pass retries only definite failures caused by the former limit, once per failed job and within normal budget controls. Uncertain work is never retried. Prior attempts remain visible as Retried/Closed and no longer inflate the attention count. All sends still require owner approval and an eligible configured provider; prospecting remains disconnected. Limits remain $5/day, $75/month and 20 AI jobs/day on Luna.

54 tests, type check and lint pass, covering enterprise ingestion, a full excluded queue, independent source quotes, weak-opportunity rejection, inquiry restoration, contact extraction, large-page bounds and private-network redirects. Controlled live discovery found three independent-business candidates; their public original sites and live Luna research were checked. Suitability is an evidence-based screening decision, not a promise that a business wants to buy. Production rollout verification is recorded in the release handoff.
