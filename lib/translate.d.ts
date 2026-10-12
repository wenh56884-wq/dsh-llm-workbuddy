/**
 * Translate WorkBuddy SSE payloads into the harness `StreamChunk` protocol.
 *
 * One open block per text, reasoning, and tool-call index, with indexes
 * allocated in first-seen order. `block-end`, `usage`, and `finish` are all
 * deferred to the `[DONE]` sentinel: that is what satisfies the protocol's two
 * hard obligations — usage strictly before finish, and nothing at all after
 * finish — including for providers that send a trailing usage-only chunk.
 *
 * @module dsh-llm-workbuddy-cn/translate
 */
import type { FinishReason, StreamChunk, TokenUsage } from '@deepseek-ai/dsh-llm';
import type { WireUsage } from './types.js';
/** The subset of a harness Tool definition needed to repair wire arguments. */
interface ToolDefinition {
    name: string;
    parameters: Record<string, unknown>;
}
/**
 * Repair WorkBuddy's occasional double encoding of unconstrained Tool fields.
 *
 * A property schema with no `type` is valid JSON Schema and means that its
 * value may have any JSON type. WorkBuddy can nevertheless render an object or
 * array chosen for such a field as a JSON string. Decode exactly that shape;
 * typed and otherwise constrained fields, scalar strings, and malformed JSON
 * remain byte-for-byte untouched.
 */
export declare function normalizeToolArguments(name: string, argumentsText: string, tools: readonly ToolDefinition[]): string;
/**
 * Map the wire `finish_reason` vocabulary onto the harness one.
 * @param reason - the wire value.
 * @returns the mapped reason; anything unrecognized becomes an error finish
 *   carrying the uppercased wire value as its code, so a new provider reason
 *   surfaces as itself instead of being silently reported as a clean stop.
 */
export declare function mapFinishReason(reason: string): FinishReason;
/**
 * Map wire usage onto the harness's disjoint counts.
 *
 * OpenAI-compatible `prompt_tokens` includes cache hits, while the harness
 * convention reports uncached input separately, so cache reads are subtracted.
 * @param usage - the wire usage block.
 * @returns disjoint token counts.
 */
export declare function mapUsage(usage: WireUsage): TokenUsage;
/**
 * Consume `[DONE]`-terminated SSE payloads and yield harness chunks.
 * @param payloads - payloads from `parseSse`.
 * @param tools - original Tool schemas used to repair WorkBuddy wire arguments.
 * @returns deltas as they arrive, with block ends, usage, and finish flushed at `[DONE]`.
 * @throws LlmError `MALFORMED_RESPONSE` on unparseable JSON, `STREAM_CLOSED`
 *   when the payload source ends without the sentinel.
 */
export declare function translate(payloads: AsyncIterable<string>, tools?: readonly ToolDefinition[]): AsyncGenerator<StreamChunk>;
export {};
//# sourceMappingURL=translate.d.ts.map