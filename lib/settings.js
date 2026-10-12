/**
 * Durable preference contract shared by both halves: the Host registers the
 * namespace schema, the browser binds the same namespace. The section is flat
 * because `set`/`unset` address top-level fields only.
 *
 * @module dsh-llm-workbuddy-cn/settings
 */
/** Settings namespace this plugin owns in the user-settings document. */
export const WORKBUDDY_SETTINGS_NAMESPACE = 'llm-workbuddy';
/** Field: whether the sidebar foot renders the allowance indicator. */
export const SHOW_USAGE_FIELD = 'showUsage';
/** Field: optional custom quota cap, overriding the meter's reported limit. */
export const CUSTOM_LIMIT_FIELD = 'customLimit';
/** Field: unit the custom quota cap is entered and displayed in. */
export const CUSTOM_LIMIT_UNIT_FIELD = 'customLimitUnit';
/** Field: used-percentage at which the indicator fill turns the danger color. */
export const DANGER_PCT_FIELD = 'dangerPct';
/** Default for {@link SHOW_USAGE_FIELD}: the indicator shows unless hidden. */
export const DEFAULT_SHOW_USAGE = true;
/** Default for {@link DANGER_PCT_FIELD}. */
export const DEFAULT_DANGER_PCT = 90;
/**
 * Smallest accepted {@link CUSTOM_LIMIT_FIELD}.
 *
 * Zero is a real budget of zero — distinct from an absent field ("follow the
 * meter") — so the browser renders an unset cap as an empty input and a zero
 * cap as `0`.
 */
export const CUSTOM_LIMIT_MIN = 0;
/** Every {@link CreditUnit}, in the order a selector offers them. */
export const CREDIT_UNITS = ['credit', 'cny', 'usd'];
/** Default for {@link CUSTOM_LIMIT_UNIT_FIELD}: the meter's own unit. */
export const DEFAULT_CREDIT_UNIT = 'credit';
/** Whether a value is one of {@link CREDIT_UNITS}. */
export function isCreditUnit(value) {
    return typeof value === 'string' && CREDIT_UNITS.includes(value);
}
/** Smallest accepted {@link DANGER_PCT_FIELD}. */
export const DANGER_PCT_MIN = 1;
/** Largest accepted {@link DANGER_PCT_FIELD}. */
export const DANGER_PCT_MAX = 100;
//# sourceMappingURL=settings.js.map