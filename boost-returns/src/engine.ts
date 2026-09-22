import { EventEmitter } from 'events';
import {
  ReturnRequest, ReturnItem, ReturnStatus, ReturnType, RefundMethod,
  ReturnPolicy, PickupAddress, PickupSchedule, ReturnTimeline,
  ReturnsStats, DEFAULT_RETURN_POLICY,
} from './types';

function uuid(): string { return 'RMA-' + Math.random().toString(36).slice(2, 10).toUpperCase(); }

// ─── BoostReturnsManager ──────────────────────────────────────────────────────

export class BoostReturnsManager extends EventEmitter {
  private returns = new Map<string, ReturnRequest>();
  readonly policy : ReturnPolicy;

  constructor(policy: Partial<ReturnPolicy> = {}) {
    super();
    this.policy = { ...DEFAULT_RETURN_POLICY, ...policy };
  }

  // ── Create Return ─────────────────────────────────────────────────────────

  createReturn(params: {
    orderId: string;
    customerId: string;
    items: ReturnItem[];
    type?: ReturnType;
    refundMethod?: RefundMethod;
    pickupAddress?: PickupAddress;
  }): ReturnRequest {
    const { orderId, customerId, items, type = 'return', refundMethod = 'original_payment', pickupAddress } = params;

    const refundAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const initialStatus: ReturnStatus = this.policy.autoApprove ? 'approved' : 'requested';

    const request: ReturnRequest = {
      id: uuid(),
      orderId, customerId, type,
      status: initialStatus,
      items,
      refundAmount: Math.min(refundAmount, refundAmount * (this.policy.maxRefundPct / 100)),
      refundMethod,
      pickupAddress,
      timeline: [{ status: initialStatus, timestamp: new Date() }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.returns.set(request.id, request);
    this.emit('return:created', { returnId: request.id, orderId, customerId });
    if (this.policy.autoApprove) {
      this.emit('return:approved', { returnId: request.id, refundAmount: request.refundAmount });
    }
    return request;
  }

  // ── Status Transitions ────────────────────────────────────────────────────

  approveReturn(returnId: string, adminNote?: string): ReturnRequest {
    const r = this._get(returnId);
    return this._transition(r, 'approved', adminNote, () =>
      this.emit('return:approved', { returnId, refundAmount: r.refundAmount })
    );
  }

  rejectReturn(returnId: string, reason: string): ReturnRequest {
    const r = this._get(returnId);
    r.adminNote = reason;
    return this._transition(r, 'rejected', reason, () =>
      this.emit('return:rejected', { returnId, reason })
    );
  }

  schedulePickup(returnId: string, pickup: PickupSchedule): ReturnRequest {
    const r = this._get(returnId);
    r.pickup = pickup;
    return this._transition(r, 'pickup_scheduled', `Pickup via ${pickup.provider ?? 'provider'}`, () =>
      this.emit('return:pickup_scheduled', { returnId, pickup })
    );
  }

  markPickedUp(returnId: string, awbNumber?: string): ReturnRequest {
    const r = this._get(returnId);
    if (r.pickup && awbNumber) r.pickup.awbNumber = awbNumber;
    if (r.pickup) r.pickup.pickedUpAt = new Date();
    return this._transition(r, 'picked_up', 'Item picked up by courier', () =>
      this.emit('return:picked_up', { returnId })
    );
  }

  markReceived(returnId: string): ReturnRequest {
    const r = this._get(returnId);
    return this._transition(r, 'received', 'Item received at warehouse', () =>
      this.emit('return:received', { returnId })
    );
  }

  processRefund(returnId: string, method?: RefundMethod): ReturnRequest {
    const r = this._get(returnId);
    if (method) r.refundMethod = method;
    return this._transition(r, 'refunded', `Refund processed via ${r.refundMethod}`, () =>
      this.emit('return:refunded', { returnId, refundAmount: r.refundAmount, method: r.refundMethod })
    );
  }

  dispatchExchange(returnId: string, exchangeOrderId: string): ReturnRequest {
    const r = this._get(returnId);
    r.exchangeOrderId = exchangeOrderId;
    return this._transition(r, 'exchange_dispatched', `Exchange order ${exchangeOrderId} dispatched`, () =>
      this.emit('return:exchange_dispatched', { returnId, exchangeOrderId })
    );
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  getReturn(returnId: string): ReturnRequest | undefined {
    return this.returns.get(returnId);
  }

  getReturnsByOrder(orderId: string): ReturnRequest[] {
    return Array.from(this.returns.values()).filter(r => r.orderId === orderId);
  }

  getReturnsByCustomer(customerId: string): ReturnRequest[] {
    return Array.from(this.returns.values()).filter(r => r.customerId === customerId);
  }

  getAllReturns(): ReturnRequest[] {
    return Array.from(this.returns.values());
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  getStats(): ReturnsStats {
    const all   = this.getAllReturns();
    const byStatus = {} as Record<ReturnStatus, number>;
    const reasonCount: Record<string, number> = {};

    for (const r of all) {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      for (const item of r.items) {
        reasonCount[item.reason] = (reasonCount[item.reason] || 0) + 1;
      }
    }

    const refunded      = all.filter(r => r.status === 'refunded');
    const totalRefunded = refunded.reduce((s, r) => s + r.refundAmount, 0);
    const avgDays       = refunded.length
      ? refunded.reduce((s, r) => s + ((r.updatedAt.getTime() - r.createdAt.getTime()) / 86400_000), 0) / refunded.length
      : 0;

    return {
      total: all.length, byStatus, totalRefunded,
      avgProcessingDays: Math.round(avgDays * 10) / 10,
      topReasons: Object.entries(reasonCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({ reason: reason as any, count })),
    };
  }

  // ── Sync ─────────────────────────────────────────────────────────────────

  sync(returns: ReturnRequest[]): void {
    returns.forEach(r => this.returns.set(r.id, r));
  }

  export(): ReturnRequest[] { return this.getAllReturns(); }

  // ── Private ───────────────────────────────────────────────────────────────

  private _get(id: string): ReturnRequest {
    const r = this.returns.get(id);
    if (!r) throw new Error(`Return ${id} not found`);
    return r;
  }

  private _transition(r: ReturnRequest, status: ReturnStatus, note?: string, onEvent?: () => void): ReturnRequest {
    r.status    = status;
    r.updatedAt = new Date();
    const entry: ReturnTimeline = { status, timestamp: new Date() };
    if (note) entry.note = note;
    r.timeline.push(entry);
    onEvent?.();
    return r;
  }
}
