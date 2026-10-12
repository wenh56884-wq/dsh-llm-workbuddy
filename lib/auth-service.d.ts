/**
 * Host-side OAuth service exposed to the Web client over a private RPC channel.
 *
 * The browser login is long-running (it waits for a human to finish signing
 * in), so it is split across RPC endpoints: `startLogin` mints the handshake
 * and returns the URL the user must open, `pollLogin` checks whether that
 * handshake has completed, and `cancelLogin` releases one the user abandoned
 * before it commits a credential. `status` and `logout` are the read/clear
 * pair the settings page drives the rest of the time.
 *
 * The channel is registered through `ctx.connection.rpc.handle` when the host
 * allows it; on dsh 0.1.5-rc.1 that path throws (see the constructor), so an
 * equivalent prefix route is registered on `ctx.webServer` directly, reusing
 * the connection service's public trust fence. Both carry the same
 * `client-request`/`server-response` JSON envelopes, so the client half needs
 * no changes.
 *
 * @module dsh-llm-workbuddy-cn/auth-service
 */
import type { Context } from '@deepseek-ai/cordis';
import type { WorkBuddySiteId } from './constants.js';
import type { WorkBuddySession } from './session.js';
import type { MessageLocale } from './locale.js';
import type { WorkBuddyAuthStatus, WorkBuddyLoginPoll, WorkBuddyLoginStart, WorkBuddyModelsResult, WorkBuddyUsageResult } from './protocol.js';
export { WORKBUDDY_AUTH_CHANNEL } from './protocol.js';
export type { WorkBuddyAuthStatus, WorkBuddyLoginPoll, WorkBuddyLoginStart, WorkBuddyModelEntry, WorkBuddyModelsResult, WorkBuddyPromotionView, WorkBuddyUsageResult, WorkBuddyUsageWindow, } from './protocol.js';
/**
 * The WorkBuddy auth RPC service.
 *
 * A handshake is started by `startLogin`, polled to completion by `pollLogin`
 * (or released early by `cancelLogin`), and its credential is picked up by the
 * adapter's `WorkBuddySession` on its next request — so a login completed
 * through the UI reaches a running harness without a restart. `logout` cancels
 * any in-flight handshake first, then clears the file and invalidates the
 * session cache.
 */
export declare class WorkBuddyAuthService {
    private readonly session?;
    private readonly locale?;
    /** In-flight handshakes by state id. */
    private readonly pending;
    constructor(ctx: Context, session?: WorkBuddySession | undefined, locale?: MessageLocale | undefined);
    /**
     * Serve one fallback-route RPC request.
     *
     * Mirrors the connection service's own HTTP adapter: the same trust fence,
     * the same `client-request`/`server-response` JSON envelopes, the same
     * 404/405/415-shaped answers for a non-RPC probe.
     * @param connection - the host connection service (for the trust fence).
     * @param req - the incoming node:http request.
     * @param res - the response to write.
     */
    private handleFallbackRequest;
    /** Write one `server-response` envelope. */
    private writeResponse;
    /** Route one RPC endpoint to its handler. */
    private dispatch;
    /**
     * Read the stored credential without requiring one.
     *
     * A stored file is not sufficient for `loggedIn: true`: a session whose
     * access and refresh tokens have both expired reads as signed in but fails
     * every request, which leaves the settings page claiming an account while the
     * model list is empty and no error is shown. The credential is therefore
     * probed for usability, and an unusable one reports `loggedIn: false` so the
     * page offers the sign-in affordance. An unreachable service still reports
     * signed in — the credential was not refused.
     * @returns the current auth status; `loggedIn` is false when nothing usable is stored.
     */
    status(): Promise<WorkBuddyAuthStatus>;
    /**
     * Start a browser-login handshake.
     * @param site - the deployment to sign in to.
     * @returns the URL the user must open.
     */
    startLogin(site: WorkBuddySiteId): Promise<WorkBuddyLoginStart>;
    /**
     * Check whether a started handshake has completed.
     * @param state - the handshake id from `startLogin`.
     * @returns whether the login completed and the credential was persisted.
     */
    pollLogin(state: string): Promise<WorkBuddyLoginPoll>;
    /**
     * Cancel a started browser-login handshake.
     *
     * The entry is dropped first so no later `pollLogin` attaches to it, and the
     * run is awaited rather than merely signalled: `abort()` only requests
     * cancellation, so returning early would report a cancel while the run may
     * still be writing a credential.
     * @param state - the handshake id from `startLogin`.
     */
    cancelLogin(state: string): Promise<void>;
    /**
     * Cancel every in-flight handshake and await them all.
     *
     * `logout` needs this: a run still in flight would otherwise persist its
     * credential *after* the store was cleared.
     */
    private cancelAllLogins;
    /** Remove the stored credential. */
    logout(): Promise<void>;
    /**
     * Read the WorkBuddy usage snapshot for the settings surface.
     *
     * Delegates to the session, which resolves a refreshed identity before the
     * meter read and never throws on a meter outage. A signed-out account is
     * reported as `loggedIn: false` with empty windows so the client can hide
     * the affordance rather than render a broken bar.
     * @returns the usage projection, or a signed-out shape when nothing is stored.
     */
    usage(): Promise<WorkBuddyUsageResult>;
    /**
     * Read the WorkBuddy model catalog with its display facts (credits, tags,
     * locale descriptions) for the model selector.
     *
     * Bypasses the session's catalog TTL: this endpoint is called when the user
     * opens the model menu, which is exactly the moment a server-side add or
     * delete must become visible rather than up to five minutes later. The read
     * is single-flighted and floor-limited inside the session, so a burst of
     * opens costs at most one config request. When the read changes the catalog,
     * the session notifies the plugin, which republishes `llm/adapters-updated`
     * so the harness catalog the client renders its groups from is dropped and
     * refetched too — otherwise the enriched rows here would update while the
     * group list stayed stale.
     *
     * Only models with disclosed capacities are shipped — the same offerability
     * rule `listModels` applies, so the client's enriched rows align with the
     * rows the harness catalog already renders.
     * @returns the enriched catalog, or a signed-out shape when nothing usable is stored.
     */
    models(): Promise<WorkBuddyModelsResult>;
    /**
     * Drive one handshake to a persisted credential.
     *
     * Reuses `buildStorage` so the on-disk shape is identical to the CLI login.
     * Returns `undefined` on any failure so the client's poll resolves
     * `done: false` and may retry from `startLogin`.
     *
     * The signal cancels the in-flight reads, narrowing the window in which a
     * cancel can still commit: an abort that lands after the check below cannot
     * stop the write, so the closing guarantee is not this check but the callers
     * — `cancelLogin` and `logout` await this run before reporting, and the
     * client re-reads `status` rather than assuming the cancel won.
     */
    private runLogin;
}
//# sourceMappingURL=auth-service.d.ts.map