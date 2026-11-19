/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as automation from "../automation.js";
import type * as crm from "../crm.js";
import type * as crons from "../crons.js";
import type * as defaults from "../defaults.js";
import type * as delivery from "../delivery.js";
import type * as email from "../email.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as integrations from "../integrations.js";
import type * as jobs from "../jobs.js";
import type * as notifications from "../notifications.js";
import type * as outbound from "../outbound.js";
import type * as publicConfig from "../publicConfig.js";
import type * as push from "../push.js";
import type * as targeting from "../targeting.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";
import type * as webhooks from "../webhooks.js";
import type * as zoho from "../zoho.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  automation: typeof automation;
  crm: typeof crm;
  crons: typeof crons;
  defaults: typeof defaults;
  delivery: typeof delivery;
  email: typeof email;
  helpers: typeof helpers;
  http: typeof http;
  integrations: typeof integrations;
  jobs: typeof jobs;
  notifications: typeof notifications;
  outbound: typeof outbound;
  publicConfig: typeof publicConfig;
  push: typeof push;
  targeting: typeof targeting;
  users: typeof users;
  validators: typeof validators;
  webhooks: typeof webhooks;
  zoho: typeof zoho;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  auth: import("@convex-dev/auth/_generated/component.js").ComponentApi<"auth">;
  authGithub: import("@convex-dev/auth/components/github/_generated/component.js").ComponentApi<"authGithub">;
  aiPool: import("@convex-dev/workpool/_generated/component.js").ComponentApi<"aiPool">;
  emailPool: import("@convex-dev/workpool/_generated/component.js").ComponentApi<"emailPool">;
};
