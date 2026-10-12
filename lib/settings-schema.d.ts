/**
 * Durable preference fields the Web client edits.
 *
 * Only the Host composes these into its plugin Config (as volatile fields);
 * the browser receives the serialized envelope through the settings transport.
 *
 * @module dsh-llm-workbuddy-cn/settings-schema
 */
import z from '@deepseek-ai/schemastery';
import type { WorkBuddySettings } from './settings.js';
/**
 * Bounds live in the schema (not a `validate` hook) so configuration forms can
 * render them and bad values are refused at the write. `customLimit` carries
 * no default: an absent field resolves to `undefined`, keeping "follow the
 * meter's limit" expressible.
 */
export declare const SettingsFields: {
    [K in keyof WorkBuddySettings]-?: z<WorkBuddySettings[K]>;
};
//# sourceMappingURL=settings-schema.d.ts.map