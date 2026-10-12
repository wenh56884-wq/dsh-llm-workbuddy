/**
 * Browser/Host contract for the private WorkBuddy RPC channel.
 *
 * This module is runtime-neutral: both halves import the channel constant and
 * share these data-only request/response types without pulling Host code into
 * the browser bundle.
 */
/** Logical RPC channel owned by the WorkBuddy authentication service. */
export const WORKBUDDY_AUTH_CHANNEL = '/workbuddy';
//# sourceMappingURL=protocol.js.map