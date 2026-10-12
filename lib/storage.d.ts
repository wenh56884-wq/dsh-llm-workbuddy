/**
 * Durable OAuth token storage, owner-only on disk.
 *
 * The store lives in the harness home (`$DSH_HOME`, resolved via the same
 * `@deepseek-ai/dsh-home-paths` the harness uses) rather than in the plugin
 * package, so a reinstall does not sign the user out. Writes are atomic
 * (write-temp-then-rename) because the login CLI and a running harness can
 * both write: a torn file would strand the user with an unreadable credential
 * and no way to tell that from "never logged in".
 *
 * @module dsh-llm-workbuddy-cn/storage
 */
import type { WorkBuddySiteId } from './constants.js';
/** The persisted shape; `auth` and `account` are always written together. */
export interface WorkBuddyStorage {
    /**
     * The deployment this credential was issued by; a file predating sites has
     * none and {@link loadStorage} fills in the default.
     */
    site: WorkBuddySiteId;
    auth: {
        accessToken: string;
        /** Absolute expiry in epoch ms. */
        expiresAt: number;
        refreshToken: string;
        /** Absolute refresh-token expiry in epoch ms. */
        refreshExpiresAt: number;
        domain: string;
    };
    account: {
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
    };
}
/**
 * Absolute path of the credential file.
 *
 * Resolved through `@deepseek-ai/dsh-home-paths` so it tracks the harness's
 * own home precedence (configured path > `$DSH_HOME` > `~/.dsh`) and never
 * diverges into a separately-computed home. `DSH_WORKBUDDY_AUTH_FILE`
 * remains as an explicit escape hatch for tests and relocations.
 */
export declare function getStoragePath(): string;
/**
 * Read the stored credential.
 *
 * Before any byte is read, the file's mode is checked: a credential that
 * other users on the host could read is treated as absent rather than used,
 * so a file that lost its owner-only mode (a bad manual chmod, a copy from
 * elsewhere) is never loaded. Treating it as absent also self-heals — the
 * next login rewrites the file with `0o600`.
 * @returns the credential, or `undefined` when absent or unusable. A missing
 *   file, a corrupt one, and an insecurely-permissioned one are deliberately
 *   the same answer: all mean "there is nothing safe here to authenticate
 *   with", and the login flow is the fix for each.
 */
export declare function loadStorage(): Promise<WorkBuddyStorage | undefined>;
/**
 * Write the credential atomically with owner-only permissions.
 * @param storage - the credential to persist.
 */
export declare function saveStorage(storage: WorkBuddyStorage): Promise<void>;
/** Remove the stored credential, if any. */
export declare function clearStorage(): Promise<void>;
//# sourceMappingURL=storage.d.ts.map