/**
 * Serialize harness messages into a WorkBuddy (OpenAI-compatible) chat request.
 *
 * Tool results arrive as first-class `role: 'tool'` messages and expand into
 * their own wire entries; images serialize as base64 data-URL content parts.
 * Offloaded image occurrences project to placeholder text, and a request
 * exceeding its image budget fails with `IMAGE_OFFLOAD_REQUIRED` so the
 * harness offloads durably and retries.
 *
 * @module dsh-llm-workbuddy-cn/serialize
 */
import type { GenerateOptions, RequestMessage } from '@deepseek-ai/dsh-llm';
import type { ImageAttachmentRef, ImageRequestTarget, RequestImageAttachment } from '@deepseek-ai/dsh-attachment';
import type { WireMessage, WireRequest } from './types.js';
/** The attachment-store face image serialization reads bytes through. */
export interface AttachmentReader {
    readImageRequest(ref: ImageAttachmentRef, target: ImageRequestTarget, signal?: AbortSignal): Promise<RequestImageAttachment>;
}
/**
 * Per-request image limits; the service publishes no budget, so these are
 * conservative caps. Exceeding either fails with `IMAGE_OFFLOAD_REQUIRED`.
 */
export interface ImageRequestLimits {
    /** Maximum number of images in one request. */
    maxImages: number;
    /** Maximum total encoded image bytes (base64-expanded) in one request. */
    maxBytes: number;
}
/** Default image limits: 20 inline images, 20 MiB of base64 payload. */
export declare const DEFAULT_IMAGE_REQUEST_LIMITS: ImageRequestLimits;
/**
 * Serialize the projected conversation in order.
 *
 * Tool results remain `role: 'tool'` messages, including their image parts.
 * Earlier user images forward into the last user message for compatibility
 * with services that only honor image content there.
 * @param messages - the projected conversation (no offloaded occurrences).
 * @param supportsImages - whether the selected model declared image input.
 * @param images - request versions for every image reference, keyed by id.
 * @returns the wire messages.
 */
export declare function serializeMessages(messages: readonly RequestMessage[], supportsImages: boolean, images?: ReadonlyMap<string, RequestImageAttachment>): WireMessage[];
/**
 * Build the chat-completions request body. Always streaming with usage
 * reporting; absent options are omitted rather than sent as null so the
 * provider's own defaults apply.
 * @param options - the assembled harness request.
 * @param supportsImages - whether the selected model declared image input.
 * @param attachments - the durable attachment store, when images may occur.
 * @param reasoningSummary - the model's catalog thinking-summary level.
 * @param temperature - the model's catalog sampling temperature, used only
 *   when the caller expressed no preference.
 * @param limits - per-request image limits; defaults when omitted.
 * @returns the request body.
 */
export declare function serializeRequest(options: GenerateOptions, supportsImages: boolean, attachments?: AttachmentReader, reasoningSummary?: string, temperature?: number, limits?: ImageRequestLimits): Promise<WireRequest>;
//# sourceMappingURL=serialize.d.ts.map