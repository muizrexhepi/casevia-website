# CRM implementation progress

## Current release status — 2026-11-19

**Live:** https://crm.muizrexhepi.com. Convex production is `nautical-tapir-784`; Vercel production is `knuckleclots-projects/casevia-io`. Custom-domain HTTPS and real owner sign-in are verified. Anonymous production backend access returns `Sign in required`.

Production has no test leads. All five workspace views were checked at 390 px without page-level horizontal overflow. The manifest, icons and safe service worker support phone installation; physical phone notification permission/delivery remains a device action.

38 focused tests, type check, lint and the production build pass, including after incorporating the latest existing portfolio commits from upstream main. The release preserves those changes. Signed Resend sent/delivered events, controlled owner delivery, real OpenAI discovery/research/drafts, preview contact capture/deduplication/notification, and matched Zoho reply import are verified. Zoho completed healthy sweeps in both environments after server-only token reuse was added.

Automatic discovery/research/drafting start off, outbound starts paused, and prospecting remains disconnected. To activate, review Settings targets/knowledge/budgets, enable the desired switches under Settings → Automation, and Save settings. Default limits: $5/day, $30/month, 5 accepted/pending AI jobs/day. Exact saved revisions still require approval.

OpenAI showed $99.85 grant remaining, expiring 2026-12-18, with no payment method configured. API key expires 2026-12-19. The existing Convex team already exceeds included storage across projects; do not represent the whole account as free. No paid upgrade or prospecting subscription was purchased.

The owner explicitly approved merging [PR #1](https://github.com/muizrexhepi/casevia-website/pull/1) into `main` on 2026-11-19 while retaining `feat/private-sales-crm`. The earlier source-promotion approval gate is resolved. PR #1 is the release record; future main-branch deployments include the CRM once merged.

The chronological checkpoints below record implementation decisions and earlier states.


Branch: `feat/private-sales-crm`. Source: existing Next.js 16 / React 19 / npm portfolio.

## Repository assessment
The public website uses App Router, local Inter/Manrope fonts, Base UI primitives, and a Resend contact route. There was no persistent backend or authentication. Public pages and their existing notifications must remain functional.

## Implementation sequence
1. Dedicated Convex development project, maintained owner authentication, private routing, schema, contact capture.
2. Lead management, evidence-based research, qualification, drafts, and pipeline.
3. Provider eligibility, immutable approvals, durable send intents, Zoho replies, cancellation.
4. Server schedules, atomic usage reservations, audit history, notifications.
5. PWA, proposals, funnel metrics, production preparation and verification.

## Account verification (2026-11-19)
- Created **only** `mickamuiz/muiz-sales-crm`, development deployment `exciting-scorpion-834`.
- OpenAI signed-in billing page: organization **Personal**, ID `org-40APOTJxuKpbOGVE6XtalXzi`; remaining credit **$100**, displayed expiration **2026-12-18**. This is a point-in-time observation, not a live balance integration.
- No purchases or billing changes were made. Production rollout and the CRM subdomain were subsequently explicitly authorized. Live prospecting remains disabled.
- Current stable Convex Auth is v2, component-based. Following current official docs rather than older v1 examples.

## Verification / blockers
Implementation in progress. Secrets and OAuth configuration are tracked in CRM_SETUP.md. Live AI requests remain disabled until credentials and application spending controls are configured.

## Working checkpoint (2026-11-19, active implementation)

Implemented owner-only Convex Auth v2, schema and persistent CRUD, deduplication, contact capture, research/draft jobs with atomic reservations, provider gates and revision approvals, send-intent recovery, signed webhooks, Zoho polling adapter, server sweeps, notifications, PWA, all six responsive views, and setup docs. Production build uses the supported Webpack compiler because Turbopack's child-process port binding is denied in this local environment.

- 26 focused checks passed, including all screen renderings and a full persisted controlled-provider workflow. Additional delivery-event ordering test added afterward.
- Type check, lint and production build passed. Production npm dependency audit: zero advisories. Remaining advisories are in development CLI dependencies.
- Real GitHub owner sign-in and real cloud lead persistence passed using the browser.
- Created GitHub OAuth app 4035276 (Muiz Private Sales CRM — Development) and an isolated OpenAI project `proj_4XxmxiUUEjaaps7JQE0LyROv`. User explicitly approved credential creation and read-only GitHub profile/email consent. New OpenAI key expires 2026-12-19 and is restricted to Responses API. Secrets are only in ignored local configuration and Convex server environments.
- First research attempts were rejected before model execution because OpenAI does not accept JSON Schema `format: uri`. Both reservations settled at zero; transport schema now omits this keyword while Zod still validates returned URLs. Live retry remains to verify.
- The user explicitly authorized deploying all work to production and configuring `crm.muizrexhepi.com` after checks pass; do not ask for production/DNS approval again.
- CLI initially belonged to another Vercel account. User approved connecting the CLI to the existing signed-in `knuckleclot` account; login succeeded. Correct team: `knuckleclots-projects`; correct source/production project: **casevia-io**, serving www.muizrexhepi.com. Checkout is now linked to it. Preserve unrelated projects.
- `crm.muizrexhepi.com` is attached to casevia-io; Vercel DNS requirements and Namecheap record configuration remain in progress. Namecheap is signed in. Existing root/www/SPF/verification/MX records were inspected and must be preserved. Zoho data center is EU (`mx.zoho.eu`, mx2 and mx3).
- Convex production deployment is **nautical-tapir-784**. Approved GitHub/OpenAI credentials and immutable owner ID are configured; backend code, independent capture/VAPID setup, production callback and final deployment remain to finish.
- Existing Resend sending key was safely retrieved using only Vercel's single-variable decryption endpoint and configured in CRM dev/prod. An attempted full production-env pull was rejected by automatic approval review before execution; the scoped alternative succeeded. No unrelated secret was decrypted or saved.
- Initial empty preview project `muiz-sales-crm-preview` was created in the previously signed-in Vercel team `mojseus-projects`, with only CRM dev config. It has not been deployed and is not the production destination.

Remaining: verify live OpenAI research/discovery/drafts and spending; configure signed live Resend events and controlled send; finish Zoho authorization if accessible; production secrets/callback, domain DNS, Vercel preview/production deployment; run final checks, mobile review, docs and Git checkpoint.

## Production rollout checkpoint (2026-11-19)

- Convex production functions, schema, indexes, authentication components and workpools deployed to `nautical-tapir-784`. Independent production inquiry signing and push credentials are stored securely.
- GitHub production callback saved. CRM CNAME saved in Namecheap and Vercel reports configured correctly/verified. Existing website and Zoho mail records preserved.
- Dedicated OpenAI Responses API key works. Live original-source research and a draft run were exercised; usage includes actual search request counts. Invalid URI transport formatting and empty hypothesis citations were corrected.
- Signed Resend webhooks are configured separately in development and production using the existing approved key.
- 30 focused tests, type check, lint, and Node 24 production build pass.
- Zoho read-only client authorization approved by owner; setup in progress. Vercel branch preview and final frontend rollout remain in progress.

## Live verification and final promotion

- Live OpenAI discovery, research and draft jobs completed; original-source retrieval and usage/search accounting verified. Billing subsequently showed $99.85 remaining promotional credit.
- Hosted Vercel preview `https://casevia-kfio8fen6-knuckleclots-projects.vercel.app` passed real owner sign-in. The public contact form saved/deduplicated a development inquiry and delivered its existing owner notification.
- One exact approved test revision was delivered through Resend to the owner-controlled business Inbox. Signed `email.sent` and `email.delivered` events were persisted. Outbound was paused again afterward.
- Zoho read-only account/Inbox access and matched reply import verified. Initial backfill exposed refresh throttling; fixed with a server-only access-token cache, persisted leases, bounded exponential backoff, and explicit recovery.
- 33 tests, type check, lint and production build pass. Source checkpoint pushed on development branch.
- Production Convex is deployed. Final Vercel frontend promotion and live domain/mobile verification are in progress.
- Cost caveat reported: existing Convex team storage already exceeds the included allowance across projects. CRM usage is small; no plan upgrade or billing change was made.

## Economical model and automation activation — 2026-11-19

Owner requested automatic discovery, research and drafting for North Macedonia and Switzerland within existing limits, with approval required before sending. Added Luna as the economical default and retained Sol as an explicit stronger option. Astra is removed from choices and blocked for new settings/jobs. Reserved model is now pinned per job, preventing a queued Luna reservation from later executing with a more expensive model after a settings change.

38 tests, type check, lint and production build pass. Live Luna discovery and draft generation pass with token/search costs settled. Production rollout and requested setting activation follow verification. Preserve outbound pause, automatic sending off, $5/day, $30/month and 5 AI jobs/day.

### Latest owner instructions — 2026-11-19

Requested activation now includes scheduled discovery, new-lead research, qualified draft preparation, eligible follow-up drafts, and automatic queueing of each exact owner-approved message within sending hours. No unapproved message may send. Prospecting remains disconnected and requires an appropriate configured provider plus recipient eligibility. Requested limits: $5/day, **$75/month**, and **20 AI jobs/day**. These are ceilings, not spending targets or guaranteed lead counts. One lead can consume multiple jobs. The subscription benefit renews on eligible billing cycles and unused credit expires; current official terms are at https://developers.openai.com/api/docs/guides/chatgpt-api-credits.

Follow-up drafting now works while outbound is paused and prepares prospecting-channel drafts for eligible prospects, without allowing them through Resend or bypassing approval. Automatic queueing tests prove unapproved drafts remain untouched and repeated sweeps do not create duplicate send intents. Defaults remain approval-first with automation off until activated in owner settings.
