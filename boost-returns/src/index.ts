// @boostengine/returns — Main Entry Point
export { BoostReturnsManager } from './engine';
export type {
  ReturnRequest, ReturnItem, ReturnStatus, ReturnType, ReturnReason,
  RefundMethod, ReturnPolicy, PickupAddress, PickupSchedule,
  ReturnTimeline, ReturnsStats, ReturnsEvents,
} from './types';
export { DEFAULT_RETURN_POLICY } from './types';
export { returnsAgentTools } from './agent';
export type { ReturnsAgentToolName } from './agent';
