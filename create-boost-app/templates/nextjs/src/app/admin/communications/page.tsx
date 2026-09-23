'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Smartphone,
  Send,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Settings,
  Flame,
} from 'lucide-react';
import { Card, Button, Badge } from '@boostengine/ui';

interface AutomationTrigger {
  id: string;
  name: string;
  channel: 'whatsapp' | 'sms' | 'email';
  triggerEvent: string;
  delayMinutes: number;
  status: 'active' | 'paused';
  totalSent: number;
  openRate: string;
  conversionRate: string;
  couponCode?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  category: 'ORDER_DISPATCH' | 'ABANDONED_CART' | 'RETURN_APPROVED' | 'PROMOTIONAL';
  channel: 'whatsapp' | 'sms' | 'email';
  body: string;
  variables: string[];
}

export default function AdminCommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'automations' | 'templates' | 'broadcast'>('automations');

  const [automations, setAutomations] = useState<AutomationTrigger[]>([
    {
      id: 'auto-1',
      name: 'High-Intent Cart Abandonment Nudge (WhatsApp)',
      channel: 'whatsapp',
      triggerEvent: 'Cart abandoned > 30 mins',
      delayMinutes: 30,
      status: 'active',
      totalSent: 1240,
      openRate: '92.4%',
      conversionRate: '16.8%',
      couponCode: 'RECOVER5',
    },
    {
      id: 'auto-2',
      name: 'Order Dispatched with Live AWB Tracking Link',
      channel: 'whatsapp',
      triggerEvent: 'AWB generated & Manifested',
      delayMinutes: 0,
      status: 'active',
      totalSent: 4890,
      openRate: '98.1%',
      conversionRate: 'N/A',
    },
    {
      id: 'auto-3',
      name: '24hr Final Abandoned Recovery (SMS + Deep Link)',
      channel: 'sms',
      triggerEvent: 'Cart unrecovered after 24 hrs',
      delayMinutes: 1440,
      status: 'active',
      totalSent: 820,
      openRate: '68.0%',
      conversionRate: '8.2%',
      couponCode: 'VIPCOMEBACK',
    },
    {
      id: 'auto-4',
      name: 'Doorstep Return QC & Refund Notification',
      channel: 'email',
      triggerEvent: 'Return QC Passed',
      delayMinutes: 0,
      status: 'active',
      totalSent: 340,
      openRate: '84.5%',
      conversionRate: 'N/A',
    },
  ]);

  const [templates] = useState<MessageTemplate[]>([
    {
      id: 'tpl-1',
      name: 'WhatsApp Abandoned Cart with 5% Discount',
      category: 'ABANDONED_CART',
      channel: 'whatsapp',
      body: 'Hi {{customer_name}}! 👋 You left {{item_count}} item(s) in your cart. Complete your order now and use coupon {{coupon_code}} for an extra 5% off! Tap to checkout: {{checkout_url}}',
      variables: ['customer_name', 'item_count', 'coupon_code', 'checkout_url'],
    },
    {
      id: 'tpl-2',
      name: 'WhatsApp Live Dispatch & Tracking',
      category: 'ORDER_DISPATCH',
      channel: 'whatsapp',
      body: 'Great news {{customer_name}}! 🚀 Your order #{{order_id}} has been dispatched via {{courier_name}} (AWB: {{awb_code}}). Track live: {{tracking_url}}',
      variables: ['customer_name', 'order_id', 'courier_name', 'awb_code', 'tracking_url'],
    },
    {
      id: 'tpl-3',
      name: 'SMS Doorstep Return Approval & Refund',
      category: 'RETURN_APPROVED',
      channel: 'sms',
      body: 'BoostStore: Your return for #{{order_id}} has passed QC. ₹{{refund_amount}} has been refunded to your original payment mode (Ref: {{refund_arn}}).',
      variables: ['order_id', 'refund_amount', 'refund_arn'],
    },
  ]);

  const [testMobile, setTestMobile] = useState('+91 98765 43210');
  const [testSent, setTestSent] = useState(false);

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Omnichannel Communications</h1>
            <Badge variant="primary" size="sm">Powered by @boostengine/communications</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automate WhatsApp, SMS, and Email customer notifications, abandoned checkout recovery, and live dispatch alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Settings className="w-3.5 h-3.5" />}>
            API Credentials
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create Automation Flow
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Delivery Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">98.9%</span>
            <span className="text-xs font-bold text-emerald-600">6,130 Sent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Direct via WhatsApp Business Cloud API</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cart Recovery Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹3,42,800</span>
            <span className="text-xs font-bold text-indigo-600">+19.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">208 carts converted back to paid orders</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SMS Gateway Balance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">42,500</span>
            <span className="text-xs font-bold text-purple-600">Credits</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">DLT Approved Sender ID: BOOSTN</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Message Read Time</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">2.4 mins</span>
            <span className="text-xs font-bold text-amber-600">Ultra Fast</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Customers open WhatsApp in under 3 mins</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('automations')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'automations' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Automated Workflows ({automations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'templates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Message Templates ({templates.length})</span>
        </button>
      </div>

      {/* Tab: Automations */}
      {activeTab === 'automations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {automations.map((auto) => (
              <Card key={auto.id} className="p-5 border-slate-200 hover:border-indigo-200 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl mt-0.5 ${
                      auto.channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-600' :
                      auto.channel === 'sms' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {auto.channel === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                      {auto.channel === 'sms' && <Smartphone className="w-5 h-5" />}
                      {auto.channel === 'email' && <Mail className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{auto.name}</h3>
                        <Badge variant={auto.status === 'active' ? 'success' : 'default'} size="sm">
                          {auto.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Trigger: <span className="font-semibold text-slate-700">{auto.triggerEvent}</span>
                        {auto.couponCode && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono font-bold text-[10px]">
                            🎁 {auto.couponCode}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={auto.status === 'active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => {
                        setAutomations(prev =>
                          prev.map(a => a.id === auto.id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a)
                        );
                      }}
                    >
                      {auto.status === 'active' ? 'Pause Trigger' : 'Resume Trigger'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Channel</span>
                    <span className="font-bold text-slate-800 uppercase">{auto.channel}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Sent</span>
                    <span className="font-bold text-slate-800">{auto.totalSent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Read / Open Rate</span>
                    <span className="font-bold text-emerald-600">{auto.openRate}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Conversion Rate</span>
                    <span className="font-bold text-indigo-600">{auto.conversionRate}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Templates */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="p-5 border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{tpl.name}</h3>
                    <Badge variant="primary" size="sm">{tpl.channel.toUpperCase()}</Badge>
                  </div>
                  <Badge variant="default" size="sm">{tpl.category}</Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl font-sans text-xs text-slate-700 leading-relaxed border border-slate-200">
                  {tpl.body}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Variables:</span>
                  {tpl.variables.map((v) => (
                    <span key={v} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] rounded border border-indigo-200">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Test Sandbox Panel */}
          <div>
            <Card className="p-5 border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Send className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Sandbox Test Dispatch</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Template:</label>
                  <select className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white">
                    <option>WhatsApp Abandoned Cart with 5% Discount</option>
                    <option>WhatsApp Live Dispatch & Tracking</option>
                    <option>SMS Doorstep Return Approval & Refund</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Test Recipient Phone (+91):</label>
                  <input
                    type="text"
                    value={testMobile}
                    onChange={(e) => setTestMobile(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleSendTest}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  {testSent ? 'Sent to Phone!' : 'Send WhatsApp Test Message'}
                </Button>

                {testSent && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Test payload delivered successfully!</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
