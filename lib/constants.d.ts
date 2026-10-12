/**
 * Fixed WorkBuddy service facts.
 *
 * These are protocol constants rather than user configuration: the endpoint is
 * where the OAuth handshake and the model catalog both live, and the version
 * strings are what the service expects a plugin client to identify itself as.
 *
 * @module dsh-llm-workbuddy-cn/constants
 */
/** The provider route this plugin registers on `ctx.llm`. */
export declare const WORKBUDDY_PROVIDER = "workbuddy";
/** Display name shown in model selectors and settings surfaces. */
export declare const WORKBUDDY_DISPLAY_NAME = "WorkBuddy";
/**
 * The WorkBuddy deployments this plugin can sign in to, by service root.
 *
 * The two hosts run the same service but hold *separate accounts*, so the
 * site is picked at sign-in and recorded with the credential.
 */
export declare const WORKBUDDY_SITES: {
    readonly cn: "https://www.workbuddy.cn";
    readonly intl: "https://www.workbuddy.ai";
};
/** One of the deployments in {@link WORKBUDDY_SITES}. */
export type WorkBuddySiteId = keyof typeof WORKBUDDY_SITES;
/** The site assumed when a credential does not name one. */
export declare const DEFAULT_SITE_ID: WorkBuddySiteId;
/**
 * Whether a value names a known site.
 *
 * Site ids arrive from disk and over RPC, so an unknown one is possible.
 * @param value - the candidate site id.
 * @returns true when the value is a known site id.
 */
export declare function isSiteId(value: unknown): value is WorkBuddySiteId;
/**
 * Resolve a value to a usable site, falling back to {@link DEFAULT_SITE_ID}.
 * @param value - the candidate site id.
 * @returns the value when known, otherwise the default site.
 */
export declare function resolveSite(value: unknown): WorkBuddySiteId;
/**
 * The service root for a site.
 * @param site - the site id.
 * @returns the endpoint origin, with no trailing slash.
 */
export declare function endpointOf(site: WorkBuddySiteId): string;
/** WorkBuddy client version this plugin reports to the service. */
export declare const WORKBUDDY_APP_VERSION = "5.7.2";
/** WorkBuddy CLI agent version the product token carries. */
export declare const WORKBUDDY_CLI_VERSION = "2.156.0";
/**
 * The product token every request identifies itself as — the chat plane, the
 * meter read, and the catalog read alike.
 *
 * This is protocol, not branding: `/v3/config` keys its listing per product
 * name and refuses a request that carries no product token at all (code
 * 12403, "check ua, get coding copilot version error"), and the listing it
 * returns changes with the token. Measured against both deployments, the
 * WorkBuddy agent below is the one served the fullest list — 56 models on
 * `www.workbuddy.cn` and 29 on `www.workbuddy.ai`, against 22 and 12 for the
 * CodeBuddy IDE agent — so both sites send it.
 */
export declare const WORKBUDDY_USER_AGENT = "WorkBuddy/5.7.2 CLI/2.156.0";
/**
 * Context capacity assumed for a model the catalog does not describe at all.
 *
 * This is a convention, not a WorkBuddy-provided figure: the service discloses
 * `maxAllowedSize` per model and offers no global default to fall back on.
 * Listed models are therefore never sized from this — an entry that withholds
 * its capacity is dropped from the listing instead. It applies only to an id
 * named explicitly that the catalog does not list, where something must be
 * assumed to resolve the route at all.
 */
export declare const DEFAULT_CONTEXT_WINDOW = 128000;
/** Output cap assumed for an unlisted model; a convention, as above. */
export declare const DEFAULT_MAX_TOKENS = 8192;
/** Default maximum provider idle time while one stream read is outstanding. */
export declare const DEFAULT_STREAM_IDLE_TIMEOUT_MS = 300000;
/** How long the browser login flow waits for the user to finish, in ms. */
export declare const LOGIN_TIMEOUT_MS: number;
/** Poll interval while waiting for the browser login to complete, in ms. */
export declare const LOGIN_POLL_INTERVAL_MS = 1000;
/** Browser login not finished. */
export declare const CODE_AUTH_PENDING = 11217;
/** No quota available. */
export declare const CODE_NO_QUOTA = 14018;
/** No team quota available. */
export declare const CODE_NO_TEAM_QUOTA = 14019;
//# sourceMappingURL=constants.d.ts.map