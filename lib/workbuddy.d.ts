/**
 * WorkBuddy control-plane client: the browser-OAuth handshake, token refresh,
 * and the non-OpenAI model catalog.
 *
 * Every call here speaks the `{code, msg, data}` envelope rather than HTTP
 * status alone, so a 200 carrying a non-zero `code` is a failure and is
 * reported as one. This module is transport-only: it holds no state and makes
 * no policy decisions, which keeps the login flow, the adapter, and the CLI
 * able to share it.
 *
 * @module dsh-llm-workbuddy-cn/workbuddy
 */
import type { WorkBuddySiteId } from './constants.js';
import type { Account, AuthState, AuthToken, WorkBuddyConfig } from './types.js';
/** The identity facts WorkBuddy requires on every authenticated request. */
export interface WorkBuddyIdentity {
    accessToken: string;
    domain: string;
    uid: string;
    enterpriseId?: string;
    departmentFullName?: string;
    /** Deployment this credential belongs to. */
    site: WorkBuddySiteId;
}
/**
 * Start a browser-login handshake.
 * @param site - the deployment to sign in to.
 * @param signal - optional cancellation.
 * @returns the handshake state and the URL the user must open.
 * @throws Error when the service refuses or answers an unusable body.
 */
export declare function requestAuthState(site: WorkBuddySiteId, signal?: AbortSignal): Promise<AuthState>;
/**
 * Poll until the user finishes signing in in the browser.
 *
 * The service reports "not finished yet" as code {@link CODE_AUTH_PENDING},
 * which is the one code that continues the loop; anything else is a decided
 * outcome and ends it. A transport error also ends it, because a handshake
 * whose state may already be spent must not be retried silently.
 * @param site - the deployment the handshake was started against.
 * @param state - the handshake id from {@link requestAuthState}.
 * @param signal - optional cancellation.
 * @returns the issued tokens, or `undefined` when the login failed or timed out.
 */
export declare function pollAuthToken(site: WorkBuddySiteId, state: string, signal?: AbortSignal): Promise<AuthToken | undefined>;
/**
 * Read the signed-in account, whose uid and enterprise id become required
 * headers on every later request.
 * @param site - the deployment the handshake was started against.
 * @param state - the handshake id the tokens were issued for.
 * @param accessToken - the freshly issued access token.
 * @param domain - the tenant domain the tokens were issued for.
 * @returns the account facts.
 * @throws Error when the service refuses or answers an unusable body.
 */
export declare function getLoginAccount(site: WorkBuddySiteId, state: string, accessToken: string, domain: string, signal?: AbortSignal): Promise<Account>;
/** Why a token refresh produced no new tokens. */
export type RefreshFailure = 
/** The service refused the refresh token: it is spent, revoked, or wrong. */
'rejected'
/**
 * The refresh request never reached a verdict — a transport fault, or a 5xx
 * from a gateway in front of the service. The stored credential may be
 * perfectly good, so this must not be reported as "sign in again".
 */
 | 'unreachable';
/** A refresh attempt's outcome: new tokens, or why none were issued. */
export type RefreshResult = {
    ok: true;
    token: AuthToken;
} | {
    ok: false;
    reason: RefreshFailure;
};
/**
 * Exchange a refresh token for a new access token.
 *
 * A refusal and an unreachable service are kept distinct: the caller renders
 * "sign in again" for the first, but retrying is the remedy for the second, and
 * conflating them would tell a user with a healthy credential to re-authenticate
 * because their Wi-Fi blinked. Only a decided, non-retryable answer — a 4xx
 * other than 408/429, or a 200 envelope carrying a non-zero code — counts as
 * `rejected`; every other failure is `unreachable`.
 * @param identity - the current identity, including the access token being replaced.
 * @param refreshToken - the refresh token to spend.
 * @param signal - optional cancellation.
 * @returns the new tokens, or the reason none were issued.
 */
export declare function refreshAccessToken(identity: WorkBuddyIdentity, refreshToken: string, signal?: AbortSignal): Promise<RefreshResult>;
/** The catalog read failed at the transport or HTTP boundary. */
export declare class ConfigRequestError extends Error {
    readonly status?: number | undefined;
    constructor(detail: string, status?: number | undefined, options?: ErrorOptions);
}
/**
 * Read the WorkBuddy model catalog.
 *
 * This is the non-OpenAI-compatible half of the service and the reason this
 * plugin cannot be replaced by a generic OpenAI-compatible route: the reply
 * discloses per-model capability flags and sizes that a `GET /models` listing
 * does not.
 * @param identity - the signed-in identity.
 * @param signal - optional cancellation.
 * @returns the catalog.
 * @throws ConfigRequestError when the service refuses or answers an unusable
 *   body; its `status` is set for an HTTP refusal so the caller can tell an
 *   authentication rejection from a transient outage.
 */
export declare function getConfig(identity: WorkBuddyIdentity, signal?: AbortSignal): Promise<WorkBuddyConfig>;
//# sourceMappingURL=workbuddy.d.ts.map