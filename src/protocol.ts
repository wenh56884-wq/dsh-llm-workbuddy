/**
 * Browser/Host contract for the private WorkBuddy RPC channel.
 *
 * This module is runtime-neutral: both halves import the channel constant and
 * share these data-only request/response types without pulling Host code into
 * the browser bundle.
 */

import type { WorkBuddySiteId } from './constants.js'

/** Logical RPC channel owned by the WorkBuddy authentication service. */
export const WORKBUDDY_AUTH_CHANNEL = '/workbuddy'

/** Current WorkBuddy authentication state. */
export interface WorkBuddyAuthStatus {
  loggedIn: boolean
  expired?: boolean
  nickname?: string
  uid?: string
  uin?: string
  domain?: string
  enterpriseId?: string
  enterpriseName?: string
  enterpriseUserName?: string
  departmentFullName?: string
}

/** Browser-login handshake returned by `startLogin`. */
export interface WorkBuddyLoginStart {
  authUrl: string
  state: string
}

/** Browser-login polling result. */
export interface WorkBuddyLoginPoll {
  done: boolean
  nickname?: string
}

/** One client-safe metering window. */
export interface WorkBuddyUsageWindow {
  name: string
  used?: number
  limit?: number
  usedPercent?: number
  resetsAt?: string
}

/** Usage projection returned to the browser. */
export interface WorkBuddyUsageResult {
  loggedIn: boolean
  windows: WorkBuddyUsageWindow[]
  primary?: WorkBuddyUsageWindow
}

/** Client-facing facts for one active model promotion. */
export interface WorkBuddyPromotionView {
  color: string
  label: string
  text?: string
  discountedRate?: string
}

/** One model-catalog entry returned to the browser. */
export interface WorkBuddyModelEntry {
  id: string
  name: string
  credits?: string
  tags?: string[]
  description?: string
  promotion?: WorkBuddyPromotionView
}

/** Model-catalog projection returned to the browser. */
export interface WorkBuddyModelsResult {
  loggedIn: boolean
  models: WorkBuddyModelEntry[]
}

/** Request and response types for every endpoint on the private channel. */
export interface WorkBuddyRpcMap {
  status: { request: Record<string, never>, response: WorkBuddyAuthStatus }
  startLogin: { request: { site: WorkBuddySiteId }, response: WorkBuddyLoginStart }
  pollLogin: { request: { state: string }, response: WorkBuddyLoginPoll }
  cancelLogin: { request: { state: string }, response: void }
  logout: { request: Record<string, never>, response: void }
  usage: { request: Record<string, never>, response: WorkBuddyUsageResult }
  models: { request: Record<string, never>, response: WorkBuddyModelsResult }
  locale: { request: string, response: null }
}

export type WorkBuddyRpcEndpoint = keyof WorkBuddyRpcMap
export type WorkBuddyRpcRequest<K extends WorkBuddyRpcEndpoint> = WorkBuddyRpcMap[K]['request']
export type WorkBuddyRpcResponse<K extends WorkBuddyRpcEndpoint> = WorkBuddyRpcMap[K]['response']
