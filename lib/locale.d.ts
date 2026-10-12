/**
 * The language the Web client is displaying, as last reported by it.
 *
 * The client resolves its locale itself and that result exists only client-side,
 * so the host cannot derive it: the browser reports the tag over this plugin's
 * RPC channel and every host-side wording decision reads it back from here.
 *
 * @module dsh-llm-workbuddy-cn/locale
 */
export declare class MessageLocale {
    private reported;
    /** Record the resolved tag, or clear it when the client sent none. */
    report(tag: unknown): void;
    /** The tag in effect, or undefined while the client has reported none. */
    tag(): string | undefined;
}
/**
 * Whether the Chinese wording should win. WorkBuddy discloses exactly two
 * wordings per field, so any `zh` tag prefers it — Simplified, Traditional, and
 * regional alike; every other tag, and an unreported one, reads English.
 *
 * Not {@link Intl.Locale}: the tag arrives from the network and `Intl.Locale`
 * throws on malformed input, which would drop the copy this reading selects.
 * @param language - the reported tag; `undefined` before the first report.
 */
export declare function prefersChinese(language: string | undefined): boolean;
/**
 * The `displayMsg` keys one tag may name, best first.
 *
 * Failure envelopes are the one place WorkBuddy discloses three wordings: a
 * language pack selects the Traditional Chinese one by region (`zh-TW`, `zh-HK`,
 * `zh-MO`), so those ids have to reach the `zh-hant` key.
 * @param language - the reported tag; `undefined` before the first report.
 */
export declare function wordingKeys(language: string | undefined): readonly string[];
//# sourceMappingURL=locale.d.ts.map