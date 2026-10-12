/**
 * WorkBuddy quota/usage meter: fetch and parse the remaining allowance.
 *
 * WorkBuddy splits its billing plane in two: an enterprise tenant answers
 * `get-enterprise-user-usage` (a single limit/credit pair), while a personal
 * account answers `get-user-resource` (one window per active package). The two
 * shapes share nothing but the authenticated headers every WorkBuddy request
 * carries, so the transport and parsing paths fork once on whether the
 * signed-in account disclosed an `enterpriseId`.
 *
 * Every value that crosses into the Web client is a plain number/string, so
 * the {@link UsageSnapshot} returned here is owned data — no live session
 * object escapes this module.
 *
 * @module dsh-llm-workbuddy-cn/usage
 */
import type { WorkBuddyIdentity } from './workbuddy.js';
/** One metering window: a named allowance and how much of it is spent. */
export interface UsageWindow {
    /** Human-readable package name, when the catalog discloses one. */
    name: string;
    /** Amount already consumed; `undefined` when the plane does not report it. */
    used?: number;
    /**
     * Total allowance for this window; `undefined` only when the plane disclosed
     * no capacity at all. A disclosed `0` is a real budget of zero and is kept.
     */
    limit?: number;
    /**
     * Used as a percentage of `limit`, clamped to [0, 100]. Present whenever a
     * limit was disclosed; a zero budget has no headroom and so reads 100%.
     * `undefined` only when no capacity was disclosed.
     */
    usedPercent?: number;
    /** ISO-ish timestamp the window resets at, when disclosed. */
    resetsAt?: string;
}
/** The parsed usage a settings surface renders. */
export interface UsageSnapshot {
    /** One entry per metering window the plane reported; empty on failure. */
    windows: UsageWindow[];
    /**
     * The figures a single-bar affordance should reflect.
     *
     * Enterprise tenants report exactly one window. A personal account reports one
     * window per active package and draws down a base package plus any granted
     * ones, so this carries the sum across every metered package rather than any
     * single package's figures; `windows` keeps the per-package detail.
     */
    primary?: UsageWindow;
}
/**
 * Parse one meter reply into a snapshot.
 *
 * The personal `Accounts` array is tried under either pointer root first, and
 * the enterprise single-window parse is the fallback when no array matched,
 * regardless of which request path was sent. That order keeps a personal
 * account that happens to carry an `enterpriseId` (or vice versa) parsing the
 * shape it actually answered, rather than the shape its credential suggested
 * it would.
 * @param raw - the parsed reply body.
 * @returns the assembled snapshot, or `undefined` when the body carried nothing parseable.
 */
export declare function parseUsage(raw: unknown): UsageSnapshot | undefined;
/**
 * Fetch the personal account's usage: one window per active package.
 *
 * The request carries the slice-period bounds (today's local day) and the
 * product/status filters the service expects.
 * @param identity - the signed-in identity, refreshed by the session.
 * @param signal - optional cancellation.
 * @returns the parsed snapshot, or `undefined` when the plane was unreachable.
 */
export declare function fetchPersonalUsage(identity: WorkBuddyIdentity, signal?: AbortSignal): Promise<UsageSnapshot | undefined>;
/**
 * Fetch the enterprise tenant's usage: a single `limitNum`/`credit` pair.
 *
 * The enterprise plane takes an empty body and answers under `data`, so the
 * request is just the authenticated POST.
 * @param identity - the signed-in identity, refreshed by the session.
 * @param signal - optional cancellation.
 * @returns the parsed snapshot, or `undefined` when the plane was unreachable.
 */
export declare function fetchEnterpriseUsage(identity: WorkBuddyIdentity, signal?: AbortSignal): Promise<UsageSnapshot | undefined>;
/**
 * Fetch and parse the WorkBuddy usage snapshot, forking on the account kind.
 *
 * Delegates to {@link fetchPersonalUsage} or {@link fetchEnterpriseUsage}
 * depending on whether the signed-in identity disclosed an `enterpriseId`.
 * Every failure mode resolves to `undefined` rather than throwing; the caller
 * decides whether to retry.
 * @param identity - the signed-in identity, refreshed by the session.
 * @param signal - optional cancellation.
 * @returns the parsed snapshot, or `undefined` when the plane was unreachable
 *   or answered an unusable body.
 */
export declare function fetchUsage(identity: WorkBuddyIdentity, signal?: AbortSignal): Promise<UsageSnapshot | undefined>;
//# sourceMappingURL=usage.d.ts.map