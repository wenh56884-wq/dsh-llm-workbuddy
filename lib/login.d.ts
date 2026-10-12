/**
 * The browser-OAuth login flow, start to persisted credential.
 *
 * No API key is ever asked for: the handshake mints a `state`, the user signs
 * in in a normal browser, and the tokens are polled out of the service against
 * that state. The only thing the user does is click through a login page.
 *
 * @module dsh-llm-workbuddy-cn/login
 */
import type { WorkBuddySiteId } from './constants.js';
import type { Account, AuthToken } from './types.js';
import type { WorkBuddyStorage } from './storage.js';
/** What a completed login produced. */
export interface LoginResult {
    storage: WorkBuddyStorage;
    nickname: string;
}
/**
 * Build the durable credential from freshly issued tokens and the account
 * facts.
 *
 * Shared by the CLI flow and the Web auth service so the two cannot drift on
 * the storage shape: both write exactly this object.
 * @param site - the deployment the tokens were issued by.
 * @param token - tokens issued once the browser login completed.
 * @param account - the signed-in account the tokens were issued for.
 * @returns the credential to persist.
 */
export declare function buildStorage(site: WorkBuddySiteId, token: AuthToken, account: Account): WorkBuddyStorage;
/** Hooks the caller supplies to drive the flow's user interaction. */
export interface LoginHooks {
    /** Called with the URL the user must open. */
    onUrl?: (url: string) => void;
    /** Whether to try opening the browser automatically. */
    openBrowser?: boolean;
    /**
     * Deployment to sign in to; an unknown value falls back to the default.
     */
    site?: WorkBuddySiteId;
}
/**
 * Run the whole browser-login flow.
 * @param hooks - user-interaction hooks, including the deployment to sign in to.
 * @param signal - optional cancellation.
 * @returns the persisted credential and the signed-in nickname.
 * @throws Error when the handshake fails, the user does not finish in time, or
 *   the account cannot be read.
 */
export declare function login(hooks?: LoginHooks, signal?: AbortSignal): Promise<LoginResult>;
//# sourceMappingURL=login.d.ts.map