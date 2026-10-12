/**
 * The signed-in session: token freshness and the cached model catalog.
 *
 * One object owns both because they share a failure mode — an expired token
 * makes the catalog unreadable — and because both must be resolved before a
 * request can be built. Refresh is single-flighted: the adapter resolves the
 * identity once per stream call and the catalog once per listing, so without
 * coalescing a burst of concurrent calls would each spend the refresh token
 * and all but one would be racing to write the file.
 *
 * @module dsh-llm-workbuddy-cn/session
 */
import type { WorkBuddyIdentity } from './workbuddy.js';
import type { UsageSnapshot } from './usage.js';
import type { WorkBuddyModel, WorkBuddyModelPromotion } from './types.js';
/** Raised when nothing is signed in; carries the remedy in its message. */
export declare class NotLoggedInError extends Error {
    constructor(detail: string);
}
/**
 * Raised when the credential could not be validated because the service was
 * unreachable, so the stored session may well still be valid.
 *
 * Deliberately separate from {@link NotLoggedInError}: the remedy is to retry,
 * not to sign in again, and the adapter maps this to the retryable `TRANSPORT`
 * code rather than the terminal `MISSING_CREDENTIAL` one. Reporting a network
 * blip as an expired login would send a correctly-signed-in user through a
 * pointless browser handshake.
 */
export declare class SessionUnavailableError extends Error {
    constructor(detail: string, options?: ErrorOptions);
}
/** A logger surface compatible with cordis's, so the session can be used bare. */
export interface SessionLogger {
    warn: (message: unknown) => void;
    error: (message: unknown) => void;
}
/**
 * Owns the stored credential for one plugin instance.
 *
 * The credential is re-read from disk when absent from memory, which is what
 * lets `dsh-workbuddy-login` sign a *running* harness in without a restart.
 */
export declare class WorkBuddySession {
    private readonly logger?;
    private storage;
    /** In-flight disk read, shared so concurrent callers read the file once. */
    private storageRead;
    /** Retires in-flight disk reads when the cached credential is dropped. */
    private storageGeneration;
    private refreshing;
    private catalog;
    private catalogRead;
    /**
     * Digest of the last catalog ever read, kept across {@link invalidate} so a
     * credential change (a login as a different account) still announces the
     * catalog it replaces. A token refresh invalidates the cache but leaves this
     * alone, so the unchanged catalog announces nothing.
     */
    private lastFingerprint;
    /**
     * Change listeners, fired after a read whose content differs from the last
     * one. Registered by the plugin so a catalog edit reaches the client without
     * a restart; the session itself stays transport-only and knows nothing about
     * cordis events.
     */
    private readonly catalogListeners;
    constructor(logger?: SessionLogger | undefined);
    /**
     * Observe catalog content changes.
     * @param listener - called after a read that changed the catalog.
     * @returns the disposer that stops observing.
     */
    onCatalogChange(listener: () => void): () => void;
    private emitCatalogChange;
    /**
     * Announce that whatever catalog consumers hold is no longer authoritative.
     *
     * Used when the *account* changes rather than the content — a sign-in or
     * sign-out replaces every model without a content diff to observe — so the
     * client drops the previous account's list instead of keeping it until some
     * later read happens to differ.
     */
    announceCatalogChange(): void;
    /**
     * Forget the in-memory credential and catalog, forcing a re-read from disk.
     *
     * Bumping the generation retires any disk read already in flight: it must not
     * install the snapshot it started from after this point, or a 401-triggered
     * invalidation could be undone by a read that was already underway.
     */
    invalidate(): void;
    private identityOf;
    /**
     * The stored credential, read from disk on first use and after invalidation.
     * @throws NotLoggedInError when nothing is stored.
     */
    private require;
    /**
     * Read the credential from disk, sharing one in-flight read and never
     * clobbering a newer value.
     *
     * The naive `this.storage ??= await loadStorage()` is wrong under
     * concurrency: the null check runs *before* the await while the assignment
     * runs after it, so a slow disk read can land after a token refresh has
     * already installed fresh tokens and overwrite them with the stale snapshot
     * it started from. The next caller then sees an expired access token again
     * and spends the refresh token a second time — and since WorkBuddy rotates
     * refresh tokens, replaying the spent one can end the session outright.
     *
     * The result is therefore adopted only if nothing newer arrived while the
     * read was in flight, and concurrent callers share the one read.
     * @returns the credential, or `undefined` when none is stored.
     */
    private load;
    /** Whether a credential exists at all, without requiring one. */
    isLoggedIn(): Promise<boolean>;
    /** The signed-in nickname, when a credential exists. */
    nickname(): Promise<string | undefined>;
    /**
     * A usable identity, refreshing the access token when it is at or near
     * expiry. Concurrent callers share one refresh.
     * @returns the identity to authenticate a request with.
     * @throws NotLoggedInError when nothing is stored, or when the refresh token
     *   has itself expired and only a new browser login can recover.
     */
    identity(): Promise<WorkBuddyIdentity>;
    /**
     * Whether the stored credential can still authenticate a request.
     *
     * A stored file is not the same as a usable session: an expired access token
     * with an expired refresh token leaves a credential that reads as signed in
     * but fails every call. Surfaces that report login state use this instead of
     * {@link isLoggedIn} so they do not claim "signed in" while the model list is
     * empty.
     *
     * Resolving an identity is a pure local check when the access token is still
     * fresh (no network), and spends the refresh token only when it is at or near
     * expiry — the same work the next request would do anyway, and it is
     * single-flighted. An unreachable service is reported as `true`: the
     * credential was not refused, and flipping a user to "signed out" because the
     * network blipped would be wrong.
     * @returns true when a request could be authenticated (or might, if the
     *   service is merely unreachable).
     */
    isUsable(): Promise<boolean>;
    private refresh;
    /**
     * The headers every authenticated WorkBuddy request carries.
     * @param resolved - an already-resolved identity to build headers for; pass
     *   one just resolved, so a concurrent login or logout cannot pair this
     *   identity's site with the other credential's token.
     * @returns the identity headers, with the session refreshed if needed.
     */
    authHeaders(resolved?: WorkBuddyIdentity): Promise<Record<string, string>>;
    /**
     * The WorkBuddy model catalog, cached briefly and shared between concurrent
     * readers.
     * @param signal - optional cancellation for the underlying read.
     * @returns the catalog models in service order.
     */
    models(signal?: AbortSignal): Promise<readonly WorkBuddyModel[]>;
    /**
     * The catalog plus its scheduled promotions, both cached together under the
     * same TTL and single-flight as the model list.
     * @param signal - optional cancellation for the underlying read.
     * @returns the models and the promotions in service order.
     */
    catalogData(signal?: AbortSignal): Promise<{
        models: readonly WorkBuddyModel[];
        promotions: readonly WorkBuddyModelPromotion[];
    }>;
    /**
     * Read the catalog, optionally bypassing the TTL so a server-side edit is
     * visible immediately rather than up to five minutes later.
     *
     * `force` is what lets an explicit user action — opening the model menu, or
     * the settings page asking for the list — reflect the service's current
     * state. It is rate-limited by {@link CATALOG_FORCE_FLOOR_MS}: a forced read
     * arriving within that window of the last read returns the cached copy,
     * because the catalog cannot have meaningfully changed and each read is a
     * service round-trip.
     *
     * When a read's content differs from the previous one, every registered
     * change listener fires, which is how the plugin republishes
     * `llm/adapters-updated` and makes the client drop its cached groups.
     * @param signal - optional cancellation for the underlying read.
     * @param force - whether to bypass the cache TTL (subject to the floor).
     * @returns the models and the promotions in service order.
     */
    private catalogDataWith;
    private readModels;
    /**
     * The catalog, or an empty list when it cannot be read.
     *
     * Listing models is a browsing action on a settings page, so a failure must
     * degrade to "nothing to show" rather than break the page. The request path
     * uses {@link models} directly and keeps the real failure.
     * @param signal - optional cancellation.
     * @returns the catalog, or an empty list.
     */
    modelsOrEmpty(signal?: AbortSignal): Promise<readonly WorkBuddyModel[]>;
    /**
     * The catalog and promotions, or empty lists when they cannot be read — the
     * advisory-read twin of {@link modelsOrEmpty}.
     * @param signal - optional cancellation.
     * @returns the models and promotions, or empty lists.
     */
    catalogDataOrEmpty(signal?: AbortSignal): Promise<{
        models: readonly WorkBuddyModel[];
        promotions: readonly WorkBuddyModelPromotion[];
    }>;
    /**
     * Force a fresh catalog read for a user-facing surface, never throwing.
     *
     * Bypasses the TTL (subject to the floor) so an explicit action — opening the
     * model menu, or the settings page asking for the list — sees the service's
     * current catalog. Unlike {@link catalogDataOrEmpty}, a failed read returns
     * the last good copy rather than empty lists: this feeds the picker's display
     * enrichment, where a transient blip must not blank every row's tags and
     * credit multiplier down to a bare name. Only a signed-out session, or one
     * that has never read successfully, yields empty lists.
     * @param signal - optional cancellation.
     * @returns the current models and promotions, the last good copy, or empty lists.
     */
    refreshCatalog(signal?: AbortSignal): Promise<{
        models: readonly WorkBuddyModel[];
        promotions: readonly WorkBuddyModelPromotion[];
    }>;
    /**
     * Shared advisory read. `force` bypasses the TTL; `fallbackToLastGood`
     * decides whether a failed read serves the previous snapshot or empty lists.
     */
    private catalogDataOrEmptyWith;
    /**
     * The WorkBuddy usage/quota snapshot, or `undefined` when it cannot be read.
     *
     * Usage is an advisory read on a settings surface, so a meter outage must
     * degrade to "nothing to show" rather than propagate: a {@link NotLoggedInError}
     * surfaces as a signed-out state, and every other failure (transport, parse,
     * expired refresh) resolves to `undefined` after a warning. The identity is
     * resolved through the same single-flight refresh as a chat request, so a
     * concurrent meter read never spends the refresh token twice.
     * @param signal - optional cancellation.
     * @returns the snapshot, or `undefined` when nothing is stored or the meter
     *   plane was unreachable.
     */
    usage(signal?: AbortSignal): Promise<UsageSnapshot | undefined>;
}
//# sourceMappingURL=session.d.ts.map