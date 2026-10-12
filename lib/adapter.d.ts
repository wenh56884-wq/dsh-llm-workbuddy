/**
 * `WorkBuddyAdapter`: fetch + SSE against WorkBuddy's OpenAI-compatible chat
 * route, with identity and the model catalog resolved from the OAuth session.
 *
 * The split matters: the chat plane is OpenAI-compatible, but the catalog plane
 * is not, so models are described from WorkBuddy's own `/v3/config` reply — that
 * is where per-model tool-call, reasoning, image, and size facts come from. No
 * API key exists anywhere in this class; every request is authorized by the
 * browser-minted bearer token the session refreshes.
 *
 * @module dsh-llm-workbuddy-cn/adapter
 */
import { LlmAdapter } from '@deepseek-ai/dsh-llm';
import type { GenerateOptions, LlmModelInfo, LlmProviderInfo, LlmResolvedModelInfo, ResolvedRetryPolicy, StreamChunk } from '@deepseek-ai/dsh-llm';
import { DEFAULT_CONTEXT_WINDOW, DEFAULT_MAX_TOKENS } from './constants.js';
import type { WorkBuddySession } from './session.js';
import type { AttachmentReader } from './serialize.js';
/** Connection facts the registering plugin resolves and the adapter trusts. */
export interface WorkBuddyConnectionOptions {
    /** Chat endpoint base override; omit to follow the credential's site. */
    baseURL?: string;
    /** Context capacity used when the catalog does not size a model. */
    defaultContextWindow: number;
    /** Per-request output cap used when the catalog does not cap a model. */
    defaultMaxTokens: number;
    /** Maximum provider idle time while one stream read is outstanding. */
    streamIdleTimeoutMs: number;
    /** Retry policy captured with the route registration. */
    retryPolicy?: ResolvedRetryPolicy;
}
/** Constructor options: the session plus the per-operation connection thunk. */
export interface WorkBuddyAdapterOptions {
    session: WorkBuddySession;
    options: () => WorkBuddyConnectionOptions;
    /** Resolves the durable attachment store, when the host provides one. */
    resolveAttachments?: () => AttachmentReader | undefined;
    /**
     * The language in effect, asked again on each failure so a change needs no
     * re-registration. A BCP 47 tag; absence means English.
     */
    language?: () => string | undefined;
}
/**
 * Map an HTTP status onto a stable harness error code.
 * @param status - the non-2xx status.
 * @param detail - every error wording the reply carried, when readable.
 * @param code - the service's own numeric error code, when the body carried one.
 * @returns the normalized code.
 */
export declare function httpErrorCode(status: number, detail?: string, code?: number): string;
/**
 * The WorkBuddy adapter. One instance serves the single `workbuddy` route and
 * every model that route's catalog reports.
 */
export declare class WorkBuddyAdapter extends LlmAdapter {
    private readonly config;
    constructor(config: WorkBuddyAdapterOptions);
    providerInfo(provider: string): LlmProviderInfo;
    providerRetryPolicy(_provider: string): ResolvedRetryPolicy | undefined;
    listModels(provider: string): Promise<readonly LlmModelInfo[]>;
    resolveModel(provider: string, model: string, signal?: AbortSignal): Promise<LlmResolvedModelInfo>;
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>;
}
export { DEFAULT_CONTEXT_WINDOW, DEFAULT_MAX_TOKENS };
//# sourceMappingURL=adapter.d.ts.map