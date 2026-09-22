'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BoostReturnsManager } from '../engine';
import { ReturnRequest, ReturnItem, ReturnType, RefundMethod, PickupAddress, ReturnPolicy } from '../types';

const ReturnsContext = createContext<{ manager: BoostReturnsManager } | null>(null);
function useCtx() { const c = useContext(ReturnsContext); if (!c) throw new Error('Use inside <BoostReturnsProvider>'); return c; }

export function BoostReturnsProvider({ policy, children }: { policy?: Partial<ReturnPolicy>; children: React.ReactNode }) {
  const [manager] = useState(() => new BoostReturnsManager(policy));
  return <ReturnsContext.Provider value={{ manager }}>{children}</ReturnsContext.Provider>;
}

export function useReturns() { return useCtx().manager; }

export function useCustomerReturns(customerId: string) {
  const { manager } = useCtx();
  const [returns, setReturns] = useState<ReturnRequest[]>(() => manager.getReturnsByCustomer(customerId));
  useEffect(() => {
    const refresh = ({ customerId: cid }: { customerId: string }) => {
      if (cid === customerId) setReturns(manager.getReturnsByCustomer(customerId));
    };
    manager.on('return:created', refresh);
    manager.on('return:approved', ({ returnId }) => setReturns(manager.getReturnsByCustomer(customerId)));
    return () => { manager.removeAllListeners('return:created'); };
  }, [manager, customerId]);

  const createReturn = useCallback((params: { orderId: string; items: ReturnItem[]; type?: ReturnType; refundMethod?: RefundMethod; pickupAddress?: PickupAddress }) =>
    manager.createReturn({ ...params, customerId }), [manager, customerId]);

  return { returns, createReturn };
}

export function useReturnStatus(returnId: string) {
  const { manager } = useCtx();
  const [returnReq, setReturnReq] = useState<ReturnRequest | undefined>(() => manager.getReturn(returnId));
  useEffect(() => {
    const refresh = ({ returnId: rid }: { returnId: string }) => { if (rid === returnId) setReturnReq(manager.getReturn(returnId)); };
    const events = ['return:approved','return:rejected','return:pickup_scheduled','return:picked_up','return:received','return:refunded'];
    events.forEach(e => manager.on(e, refresh));
    return () => { events.forEach(e => manager.off(e, refresh)); };
  }, [manager, returnId]);
  return returnReq;
}

export function useReturnsStats() {
  const { manager } = useCtx();
  const [stats, setStats] = useState(() => manager.getStats());
  useEffect(() => {
    const refresh = () => setStats(manager.getStats());
    const events = ['return:created','return:refunded','return:rejected'];
    events.forEach(e => manager.on(e, refresh));
    return () => { events.forEach(e => manager.off(e, refresh)); };
  }, [manager]);
  return stats;
}
