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
/** Envelope every WorkBuddy control-plane reply carries. */
export interface ResponseBase {
    code: number;
    msg: string;
    requestId: string;
}
/** A started browser-login handshake. */
export interface AuthState {
    /** Opaque handshake id; correlates the browser session with the token poll. */
    state: string;
    /** URL the user opens to sign in. */
    authUrl: string;
}
export interface AuthStateResponse extends ResponseBase {
    data?: AuthState;
}
/** Tokens issued once the browser login completes. */
export interface AuthToken {
    accessToken: string;
    /** Access-token lifetime in seconds. */
    expiresIn: number;
    refreshToken: string;
    /** Refresh-token lifetime in seconds. */
    refreshExpiresIn: number;
    /** Tenant domain that must be echoed on every later request. */
    domain: string;
}
export interface AuthTokenResponse extends ResponseBase {
    data?: AuthToken;
}
/** The signed-in identity; its fields become required request headers. */
export interface Account {
    uid: string;
    nickname: string;
    /** Tencent user identity number (e.g. QQ openid), when the account discloses one. */
    uin?: string;
    enterpriseId?: string;
    /** Enterprise display name, when the account is an enterprise tenant. */
    enterpriseName?: string;
    /** Enterprise user name (the account's name within the tenant). */
    enterpriseUserName?: string;
    departmentFullName?: string;
}
export interface AccountResponse extends ResponseBase {
    data?: Account;
}
/**
 * Reasoning metadata WorkBuddy discloses for one model. The effort ids are the
 * provider's own vocabulary ("low", "high", "xhigh", "max"); they are passed
 * through verbatim rather than mapped, so a level the catalog adds later needs
 * no code change.
 *
 * `supportedEfforts` is genuinely optional: `auto` ships a reasoning block that
 * declares an active `effort` but no selectable list at all.
 */
export interface WorkBuddyReasoning {
    /** Selectable levels, when this model discloses a choice. */
    supportedEfforts?: string[];
    /** Level applied when the caller picks none. */
    defaultEffort?: string;
    /** Level currently active server-side; a fallback default source. */
    effort?: string;
    /** Whether thinking can be turned off entirely. */
    canDisableThinking?: boolean;
    summary?: string;
}
/**
 * One model as WorkBuddy describes it. This is the WorkBuddy catalog shape,
 * disclosing capability flags and sizes alongside the OpenAI fields.
 */
export interface WorkBuddyModel {
    id: string;
    name: string;
    /** Credit/quota label WorkBuddy shows beside the model name. */
    credits?: string;
    /** Opaque tags ("craft") and `badge:<label>:#<RRGGBB>` colored badges. */
    tags?: string[];
    /** Locale-specific model description, when disclosed. */
    descriptionZh?: string;
    descriptionEn?: string;
    /** Combined request/response context capacity. */
    maxAllowedSize?: number;
    maxOutputTokens?: number;
    /** Sampling temperature this model is served at, when disclosed. */
    temperature?: number;
    supportsImages?: boolean;
    supportsToolCall?: boolean;
    supportsReasoning?: boolean;
    /** Whether thinking cannot be turned off for this model. */
    onlyReasoning?: boolean;
    /** Selectable thinking levels, when disclosed. */
    reasoning?: WorkBuddyReasoning;
}
export interface WorkBuddyConfig {
    models: WorkBuddyModel[];
    /** Declared agents; the `cli` agent's `models` is the offerable set. */
    agents?: {
        name?: string;
        models?: string[];
    }[];
    /** Scheduled promotions that attach a badge and hover text to models. */
    modelPromotions?: WorkBuddyModelPromotion[];
}
/**
 * The price override one promotion may carry: while it runs, the
 * model's rate is shown from here instead of the catalog's own `credits`.
 */
export interface WorkBuddyPromotionDiscount {
    /** Pre-formatted discounted rate, same grammar as `credits` ("x0.5", "0x"). */
    discountedCredits?: string;
    /** Numeric rate multiplier, used when `discountedCredits` is unparseable. */
    factor?: number;
}
/**
 * One scheduled promotion from the WorkBuddy config: a colored badge plus hover
 * text attached to every model in {@link modelIds} while its schedule is
 * active.
 */
export interface WorkBuddyModelPromotion {
    id: string;
    /** Whether the promotion is currently switched on service-side. */
    enabled?: boolean;
    /** Higher wins when several promotions are active on one model. */
    priority?: number;
    modelIds?: string[];
    badge?: {
        /** Hex color the badge pill renders in. */
        color?: string;
        label?: string;
        /**
         * When the badge is shown: "activeOnly" (default) only while the schedule
         * is active; "always" on every schedule state.
         */
        display?: 'activeOnly' | 'always';
    };
    hover?: {
        textZh?: string;
        textEn?: string;
    };
    /** Price override while the promotion runs, when it carries one. */
    discount?: WorkBuddyPromotionDiscount;
    schedule?: {
        /** IANA timezone the daily windows are evaluated in. */
        timezone?: string;
        /** ISO-8601 instant the promotion starts at. */
        validFrom?: string;
        /** ISO-8601 instant the promotion ends at. */
        validUntil?: string;
        /** "HH:mm" windows, inclusive start and exclusive end. */
        daily?: {
            start: string;
            end: string;
        }[];
    };
}
/**
 * Normalize a catalog `credits` label to `xN` / `xN.NN`.
 *
 * The service occasionally ships decorated values (`"x0.34 credits"`), and
 * those must not reach the picker verbatim. An unparseable or empty label
 * reads as absent.
 * @param credits - the raw catalog label.
 * @returns the normalized `xN` label, or `undefined` when it carries no number.
 */
export declare function normalizeCredits(credits: string | undefined): string | undefined;
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
export declare function hasDisclosedCapacity(model: WorkBuddyModel): boolean;
/**
 * The models the config's conversation agent names, in its declared order —
 * the list the official clients offer, in that order. The `craft` agent is
 * preferred, falling back to `cli`; only when neither names any model does
 * the full catalog apply.
 * @param config - the config read.
 * @returns the whitelist by id, or `undefined` for every model.
 */
export declare function cliModels(config: WorkBuddyConfig): Map<string, WorkBuddyModel> | undefined;
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
export declare function isPromotionActive(promotion: WorkBuddyModelPromotion, now?: number): boolean;
export interface ConfigResponse extends ResponseBase {
    data?: WorkBuddyConfig;
}
/**
 * The envelope a non-2xx chat reply carries: the service's control-plane shape,
 * or the OpenAI `{error: {...}}` a custom `baseURL` may speak. The wording is
 * spread across `msg`, `extError`, and `displayMsg`, since a condition can be
 * recognizable from only one of them.
 */
export interface WireError {
    /** Service error code, e.g. 11115. */
    code?: number;
    /** The service's own description of the failure. */
    msg?: string;
    /** The provider fault the service wrapped. */
    extError?: {
        code?: string;
        type?: string;
        message?: string;
        param?: string;
    };
    /** Curated user-facing sentences, keyed by language. */
    displayMsg?: {
        zh?: string;
        en?: string;
        'zh-hant'?: string;
        [language: string]: string | undefined;
    };
    /** OpenAI-compatible envelope. */
    error?: {
        message?: string;
        type?: string;
        code?: string;
        /**
         * WorkBuddy's own nested envelope. A refused chat request answers
         * `{error:{data:{code,msg,requestId}}}` rather than the flat OpenAI shape,
         * so the code that identifies the condition lives in here — reading only
         * the flat fields finds nothing and the envelope looks undescribed.
         */
        data?: {
            code?: number;
            msg?: string;
            requestId?: string;
        };
    };
}
/** Usage block of an OpenAI-compatible stream. */
export interface WireUsage {
    prompt_tokens: number;
    completion_tokens: number;
    prompt_cache_hit_tokens?: number;
    prompt_tokens_details?: {
        cached_tokens?: number;
    };
    completion_tokens_details?: {
        reasoning_tokens?: number;
    };
}
/**
 * One streamed tool-call fragment. `id` and `name` are identity, sent once on
 * the first fragment and repeated as `''`/`null` on continuations; the wire
 * type only claims what a remote encoder does, so all three stay nullable and
 * the consumer decides what an empty value means.
 */
export interface WireToolCall {
    index: number;
    id?: string | null;
    function?: {
        name?: string | null;
        arguments?: string | null;
    };
}
/** One OpenAI-compatible stream chunk. */
export interface WireChunk {
    choices?: {
        delta?: {
            content?: string | null;
            reasoning_content?: string | null;
            reasoning?: string | null;
            tool_calls?: WireToolCall[] | null;
        } | null;
        finish_reason?: string | null;
    }[] | null;
    /**
     * Present but explicitly `null` on every non-final chunk, so consumers must
     * test for null rather than only `undefined`.
     */
    usage?: WireUsage | null;
}
/** One OpenAI-style content part of a multimodal user message. */
export type WireContentPart = {
    type: 'text';
    text: string;
} | {
    type: 'image_url';
    image_url: {
        url: string;
    };
};
/** One wire message sent to the chat endpoint. */
export interface WireMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    /** Plain text, or content parts when the message carries images. */
    content: string | WireContentPart[];
    reasoning_content?: string;
    tool_call_id?: string;
    tool_calls?: {
        id: string;
        type: 'function';
        function: {
            name: string;
            arguments: string;
        };
    }[];
}
/** One tool schema sent to the chat endpoint. */
export interface WireTool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
}
/** The chat-completions request body. */
export interface WireRequest {
    model: string;
    messages: WireMessage[];
    stream: true;
    stream_options?: {
        include_usage: boolean;
    };
    tools?: WireTool[];
    temperature?: number;
    max_tokens?: number;
    stop?: string[];
    /** OpenAI-compatible thinking level; WorkBuddy's own effort vocabulary. */
    reasoning_effort?: string;
    /** Thinking-summary level, sent alongside `reasoning_effort`. */
    reasoning_summary?: string;
}
//# sourceMappingURL=types.d.ts.map