/**
 * Tencent WorkBuddy provider plugin for DeepSeek Harness.
 *
 * Registers one `workbuddy` route on `ctx.llm`, authorized by a browser OAuth
 * login rather than an API key, and serving the models WorkBuddy's own
 * (non-OpenAI) catalog endpoint reports.
 *
 * @module dsh-llm-workbuddy-cn
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { RetryPolicyConfig } from '@deepseek-ai/dsh-llm';
import type { WorkBuddyConnectionOptions } from './adapter.js';
import type { CreditUnit } from './settings.js';
export { WorkBuddyAdapter, httpErrorCode } from './adapter.js';
export type { WorkBuddyAdapterOptions, WorkBuddyConnectionOptions } from './adapter.js';
export { WorkBuddyAuthService, WORKBUDDY_AUTH_CHANNEL } from './auth-service.js';
export type { WorkBuddyAuthStatus, WorkBuddyLoginStart, WorkBuddyLoginPoll, WorkBuddyModelEntry, WorkBuddyModelsResult, WorkBuddyPromotionView, WorkBuddyUsageResult, WorkBuddyUsageWindow, } from './auth-service.js';
export { WorkBuddySession, NotLoggedInError, SessionUnavailableError } from './session.js';
export { login } from './login.js';
export type { LoginHooks, LoginResult } from './login.js';
export { clearStorage, getStoragePath, loadStorage, saveStorage } from './storage.js';
export type { WorkBuddyStorage } from './storage.js';
export { fetchUsage, fetchPersonalUsage, fetchEnterpriseUsage, parseUsage } from './usage.js';
export type { UsageSnapshot, UsageWindow } from './usage.js';
export { ConfigRequestError } from './workbuddy.js';
export type { RefreshFailure, RefreshResult } from './workbuddy.js';
export * from './constants.js';
export { hasDisclosedCapacity } from './types.js';
export type * from './types.js';
export { MessageLocale, prefersChinese, wordingKeys } from './locale.js';
export { WORKBUDDY_SETTINGS_NAMESPACE, CREDIT_UNITS, CUSTOM_LIMIT_FIELD, CUSTOM_LIMIT_MIN, CUSTOM_LIMIT_UNIT_FIELD, DANGER_PCT_FIELD, DANGER_PCT_MAX, DANGER_PCT_MIN, DEFAULT_CREDIT_UNIT, DEFAULT_DANGER_PCT, DEFAULT_SHOW_USAGE, SHOW_USAGE_FIELD, isCreditUnit, } from './settings.js';
export type { WorkBuddySettings, WorkBuddySettingsField, CreditUnit } from './settings.js';
export { SettingsFields } from './settings-schema.js';
export { usedPercent } from './quota.js';
/** Cordis plugin name. */
export declare const name = "llm-workbuddy";
/** This plugin needs the LLM seam to register its route on. */
export declare const inject: string[];
/**
 * Plugin config. Route facts are ordinary entry config; the three usage
 * preference fields are `volatile`, so the Web settings forms own their
 * durable storage and edits apply without a reload.
 */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    /** Chat endpoint base override; omit to follow the credential's site. */
    baseURL: z<string, string, "plain">;
    /** Context capacity for a model the catalog does not size. */
    defaultContextWindow: z<number, number, "plain">;
    /** Per-request output cap for a model the catalog does not cap. */
    defaultMaxTokens: z<number, number, "plain">;
    /** Maximum provider idle time while one stream read is outstanding. */
    streamIdleTimeoutMs: z<number, number, "plain">;
    /** Provider-owned retry policy; omission selects the harness defaults. */
    retryPolicy: z<RetryPolicyConfig>;
    showUsage: z<boolean, boolean, "volatile">;
    customLimit: z<number | undefined, number | undefined, "volatile">;
    customLimitUnit: z<CreditUnit, CreditUnit, "volatile">;
    dangerPct: z<number, number, "volatile">;
}>>, Schemastery.ObjectT<NoInfer<{
    /** Chat endpoint base override; omit to follow the credential's site. */
    baseURL: z<string, string, "plain">;
    /** Context capacity for a model the catalog does not size. */
    defaultContextWindow: z<number, number, "plain">;
    /** Per-request output cap for a model the catalog does not cap. */
    defaultMaxTokens: z<number, number, "plain">;
    /** Maximum provider idle time while one stream read is outstanding. */
    streamIdleTimeoutMs: z<number, number, "plain">;
    /** Provider-owned retry policy; omission selects the harness defaults. */
    retryPolicy: z<RetryPolicyConfig>;
    showUsage: z<boolean, boolean, "volatile">;
    customLimit: z<number | undefined, number | undefined, "volatile">;
    customLimitUnit: z<CreditUnit, CreditUnit, "volatile">;
    dangerPct: z<number, number, "volatile">;
}>>, "plain">;
/** Untyped mirror of {@link Config}'s fields; see the field docs there. */
export interface Config {
    baseURL?: string;
    defaultContextWindow?: number;
    defaultMaxTokens?: number;
    streamIdleTimeoutMs?: number;
    retryPolicy?: RetryPolicyConfig;
    showUsage?: boolean;
    customLimit?: number;
    customLimitUnit?: CreditUnit;
    dangerPct?: number;
}
/**
 * Validate and complete the raw config. Programmatic construction can bypass
 * any schema, so bounds are judged here and a bad value fails at load with the
 * field named, rather than mid-request.
 */
export declare function resolveConnectionOptions(config?: Config): WorkBuddyConnectionOptions;
/** Mount the plugin: resolve config, then register the route. */
export declare function apply(ctx: Context, config?: Config): void;
//# sourceMappingURL=index.d.ts.map