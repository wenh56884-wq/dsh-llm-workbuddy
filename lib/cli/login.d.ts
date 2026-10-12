#!/usr/bin/env node
/**
 * `dsh-workbuddy-login`: sign in to WorkBuddy through the browser, then write
 * the credential where the plugin reads it.
 *
 * Deliberately a separate entry point rather than an in-harness prompt: the
 * flow needs a browser and a human, and a running agent must not block a model
 * call waiting for one. A harness already running picks the credential up on
 * its next request without a restart.
 *
 * Usage:
 *   dsh-workbuddy-login                 sign in to the default site (cn)
 *   dsh-workbuddy-login --site intl     sign in to the international site
 *   dsh-workbuddy-login --status        show who is signed in
 *   dsh-workbuddy-login --logout        remove the stored credential
 *   dsh-workbuddy-login --no-open       print the URL without opening a browser
 *
 * @module dsh-llm-workbuddy-cn/cli/login
 */
export {};
//# sourceMappingURL=login.d.ts.map