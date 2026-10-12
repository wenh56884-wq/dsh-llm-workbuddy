/**
 * Wire shapes this plugin reads, on two unrelated protocols.
 *
 * The WorkBuddy control plane (`/v2/plugin/auth/*`, `/v3/config`) wraps every
 * reply in `{code, msg, requestId, data}` and is NOT OpenAI-compatible — which
 * is the reason this plugin exists rather than a plain OpenAI-compatible route.
 * The chat plane (`/v2/chat/completions`) is OpenAI-compatible, so its chunk
 * shape is the familiar one.
 *
 * @module dsh-llm-workbuddy-cn/types
 */
/**
 * Normalize a catalog `credits` label to `xN` / `xN.NN`.
 *
 * The service occasionally ships decorated values (`"x0.34 credits"`), and
 * those must not reach the picker verbatim. An unparseable or empty label
 * reads as absent.
 * @param credits - the raw catalog label.
 * @returns the normalized `xN` label, or `undefined` when it carries no number.
 */
export function normalizeCredits(credits) {
    if (credits === undefined)
        return undefined;
    const match = /(\d+(?:\.\d+)?)/.exec(credits);
    return match === null ? undefined : `x${match[1]}`;
}
/**
 * Whether the catalog disclosed the capacities the harness requires.
 *
 * The harness needs a positive `contextWindow` and output cap for every model
 * it offers, and WorkBuddy omits both on entries that are not chat models
 * (completion, rewrite/jump, image generation). Inventing numbers for those
 * would put unusable models in the picker sized by guesswork, so callers drop
 * them instead. Kept here, beside the wire type, so the listing and the resolve
 * path cannot disagree about which entries are offerable.
 * @param model - one catalog entry.
 * @returns true when both capacities are present and positive.
 */
export function hasDisclosedCapacity(model) {
    return model.maxAllowedSize !== undefined && model.maxAllowedSize > 0
        && model.maxOutputTokens !== undefined && model.maxOutputTokens > 0;
}
/**
 * The models the config's conversation agent names, in its declared order —
 * the list the official clients offer, in that order. The `craft` agent is
 * preferred, falling back to `cli`; only when neither names any model does
 * the full catalog apply.
 * @param config - the config read.
 * @returns the whitelist by id, or `undefined` for every model.
 */
export function cliModels(config) {
    const agents = [
        config.agents?.find(agent => agent.name === 'craft'),
        config.agents?.find(agent => agent.name === 'cli'),
    ];
    const declared = agents.filter((agent) => agent?.models !== undefined && agent.models.length > 0);
    const agent = declared[0];
    if (agent === undefined)
        return undefined;
    const byId = new Map(config.models.map(model => [model.id, model]));
    const offered = new Map();
    for (const id of agent.models) {
        const model = byId.get(id);
        if (model !== undefined && !offered.has(id))
            offered.set(id, model);
    }
    return offered;
}
/**
 * Minutes-past-midnight of one "HH:mm" window edge, or undefined when the
 * value is malformed. Hours run 0–23 and minutes 0–59.
 */
function timeToMinutes(value) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value);
    const hours = match === null ? undefined : Number.parseInt(match[1] ?? '', 10);
    const minutes = match === null ? undefined : Number.parseInt(match[2] ?? '', 10);
    if (hours === undefined || Number.isNaN(hours) || minutes === undefined || Number.isNaN(minutes))
        return undefined;
    if (hours > 23 || minutes > 59)
        return undefined;
    return 60 * hours + minutes;
}
/**
 * Whether `now` (minutes past midnight) is inside one `[start, end)` window.
 * A zero-length window covers the whole day, and a window whose end is earlier
 * than its start wraps past midnight.
 */
function inDailyWindow(now, start, end) {
    if (start === end)
        return true;
    if (end > start)
        return now >= start && now < end;
    return now >= start || now < end;
}
/**
 * Minutes past midnight right now in `timezone` (IANA), falling back to the
 * local clock when the timezone is unknown to `Intl`.
 */
function nowMinutesIn(timezone) {
    let text;
    try {
        // `hourCycle: 'h23'` keeps midnight at "00:00" — plain `hour12: false`
        // renders "24:00" on some ICU builds, which would read as minute 1440.
        text = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
            ...(timezone === undefined ? {} : { timeZone: timezone }),
        }).format(new Date());
    }
    catch {
        text = '';
    }
    const match = /^(\d{2}):(\d{2})$/.exec(text);
    if (match === null) {
        const local = new Date();
        return 60 * local.getHours() + local.getMinutes();
    }
    return 60 * Number.parseInt(match[1] ?? '0', 10) + Number.parseInt(match[2] ?? '0', 10);
}
/**
 * Whether one promotion's schedule currently covers the moment: a disabled
 * promotion never runs; a missing schedule always does; `validFrom`/`validUntil`
 * bound the whole promotion by absolute instant, and `daily` windows are
 * `[start, end)` ranges in the schedule's timezone (a malformed window edge
 * drops that window).
 * @param promotion - one promotion entry.
 * @param now - the instant to test against (defaults to the current time).
 * @returns true when the promotion is active.
 */
export function isPromotionActive(promotion, now = Date.now()) {
    if (promotion.enabled === false)
        return false;
    const schedule = promotion.schedule;
    if (schedule === undefined)
        return true;
    if (schedule.validFrom !== undefined) {
        const from = Date.parse(schedule.validFrom);
        if (!Number.isNaN(from) && now < from)
            return false;
    }
    if (schedule.validUntil !== undefined) {
        const until = Date.parse(schedule.validUntil);
        if (!Number.isNaN(until) && now >= until)
            return false;
    }
    if (schedule.daily !== undefined && schedule.daily.length > 0) {
        const nowMinutes = nowMinutesIn(schedule.timezone);
        const inSomeWindow = schedule.daily.some((window) => {
            const start = timeToMinutes(window.start);
            const end = timeToMinutes(window.end);
            return start !== undefined && end !== undefined && inDailyWindow(nowMinutes, start, end);
        });
        if (!inSomeWindow)
            return false;
    }
    return true;
}
//# sourceMappingURL=types.js.map