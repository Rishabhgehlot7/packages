import React, { useState } from 'react';
import {
  KPIWidget,
  AreaChart,
  DonutChart,
  DataTable,
  ActivityFeed,
  NotificationCenter,
  ExportButton,
  Filter,
  Badge,
  Button,
} from '@boostengine/ui';
import { Download, RefreshCw, Calendar, Sparkles } from 'lucide-react';

interface DashboardExampleProps {
  onShowToast: (msg: string) => void;
}

export const DashboardExample: React.FC<DashboardExampleProps> = ({ onShowToast }) => {
  const [activeFilter, setActiveFilter] = useState<string[]>([]);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Payment Captured', description: '₹3,499 via PhonePe UPI (Order #98412)', timestamp: '2m ago', read: false },
    { id: '2', title: 'AWB Assigned', description: 'Delhivery tracking #DEL829182 generated', timestamp: '15m ago', read: false },
    { id: '3', title: 'Low Inventory Alert', description: 'Cargo Joggers (32) only 2 units left in Gurugram Hub', timestamp: '1h ago', read: true }
  ]);

  const weeklyGmvData = [
    { label: 'Mon', value: 34200, secondaryValue: 28100 },
    { label: 'Tue', value: 48900, secondaryValue: 39400 },
    { label: 'Wed', value: 42100, secondaryValue: 36200 },
    { label: 'Thu', value: 68400, secondaryValue: 51200 },
    { label: 'Fri', value: 89200, secondaryValue: 64900 },
    { label: 'Sat', value: 114500, secondaryValue: 88400 },
    { label: 'Sun', value: 98200, secondaryValue: 74200 },
  ];

  const paymentBreakdown = [
    { label: 'UPI (GPay / PhonePe)', value: 1240, color: '#3b82f6' },
    { label: 'Cash on Delivery (COD)', value: 410, color: '#f59e0b' },
    { label: 'Credit & Debit Cards', value: 290, color: '#10b981' },
    { label: 'NetBanking & EMI', value: 110, color: '#8b5cf6' },
  ];

  const ordersData = [
    {
      orderId: '#BE-98412',
      customer: 'Priya Sundaram',
      city: 'Bengaluru, KA',
      amount: '₹3,499',
      payment: 'PhonePe UPI',
      status: 'DISPATCHED'
    },
    {
      orderId: '#BE-98411',
      customer: 'Aman Singhania',
      city: 'Mumbai, MH',
      amount: '₹1,299',
      payment: 'Razorpay Card',
      status: 'DELIVERED'
    },
    {
      orderId: '#BE-98410',
      customer: 'Tanvi Deshmukh',
      city: 'Pune, MH',
      amount: '₹2,799',
      payment: 'COD (Delhivery)',
      status: 'IN TRANSIT'
    },
    {
      orderId: '#BE-98409',
      customer: 'Rohan Mehra',
      city: 'New Delhi, DL',
      amount: '₹4,199',
      payment: 'Paytm UPI',
      status: 'PROCESSING'
    },
    {
      orderId: '#BE-98408',
      customer: 'Neha Kapoor',
      city: 'Jaipur, RJ',
      amount: '₹999',
      payment: 'Google Pay',
      status: 'DELIVERED'
    }
  ];

  const activityFeedItems = [
    {
      id: 'act-1',
      user: { name: 'Razorpay Gateway' },
      action: 'settled payout ₹1,84,290 into HDFC Current A/C',
      timestamp: '5m ago',
      statusBadge: { label: 'SETTLED', variant: 'success' as const }
    },
    {
      id: 'act-2',
      user: { name: 'Shiprocket Logistics' },
      action: 'picked up 42 parcels from Okhla Fulfillment Center',
      timestamp: '22m ago',
      statusBadge: { label: 'IN-TRANSIT', variant: 'info' as const }
    },
    {
      id: 'act-3',
      user: { name: 'Fraud Shield AI' },
      action: 'verified OTP for high-risk COD order #BE-98410',
      timestamp: '45m ago',
      statusBadge: { label: 'VERIFIED', variant: 'success' as const }
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--boost-bg, #090d16)', color: 'var(--boost-text, #f8fafc)', minHeight: '100vh', padding: '24px 20px', fontFamily: 'inherit' }}>
      {/* Top Header Bar */}
      <div style={{ maxWidth: '1240px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Executive Merchant Dashboard</h1>
            <Badge variant="success">LIVE SYNC</Badge>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
            Real-time analytics for direct-to-consumer store operations across Indian fulfillment channels.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--boost-border, #334155)',
            fontSize: '13px'
          }}>
            <Calendar size={14} color="#94a3b8" />
            <span>Last 7 Days (Sep 14 - Sep 20)</span>
          </div>

          <NotificationCenter
            notifications={notifications}
            onMarkAllAsRead={() => {
              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              onShowToast('Marked all notifications as read');
            }}
            onClearAll={() => {
              setNotifications([]);
              onShowToast('Cleared notifications');
            }}
            onItemClick={(item) => onShowToast(`Opened: ${item.title}`)}
          />

          <Button size="sm" variant="outline" onClick={() => onShowToast('Dashboard refreshed with latest data!')}>
            <RefreshCw size={14} style={{ marginRight: '6px' }} />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      {/* 4 KPI Metrics Row */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        <KPIWidget
          title="Gross Merchandise Value (GMV)"
          value="₹28,45,200"
          change="+31.4%"
          changePeriod="vs last 7 days"
          subtitle="Net Sales: ₹26.9L"
        />
        <KPIWidget
          title="Return-to-Origin (RTO)"
          value="3.2%"
          change="-1.8%"
          changePeriod="vs industry avg (8.4%)"
          subtitle="Delhivery + Shiprocket"
        />
        <KPIWidget
          title="Total Orders Fulfilled"
          value="1,842"
          change="+14.2%"
          changePeriod="vs previous week"
          subtitle="Avg TAT: 2.1 Days"
        />
        <KPIWidget
          title="Average Order Value (AOV)"
          value="₹1,544"
          change="+8.1%"
          changePeriod="bundle booster"
          subtitle="42% bundle attach rate"
        />
      </div>

      {/* Charts Row */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
          <AreaChart
            title="Revenue Trend & Comparison"
            subtitle="Current week gross sales vs previous period (₹)"
            data={weeklyGmvData}
            valuePrefix="₹"
            primaryLabel="This Week"
            secondaryLabel="Last Week"
            color="#3b82f6"
          />
        </div>

        <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
          <DonutChart
            title="Payment Method Breakdown"
            subtitle="Order settlement distribution by gateway rails"
            data={paymentBreakdown}
            centerLabel="Orders"
            centerValue="2,050"
          />
        </div>
      </div>

      {/* Orders Table & Activity Feed */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Orders DataTable */}
        <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>Recent Customer Shipments</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)' }}>Live dispatch pipeline with courier status</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ExportButton format="csv" onExport={() => onShowToast('Exported Orders CSV')} />
              <ExportButton format="xlsx" onExport={() => onShowToast('Exported Orders XLSX')} />
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'orderId', header: 'Order ID', sortable: true },
              { key: 'customer', header: 'Customer' },
              { key: 'city', header: 'Destination' },
              { key: 'amount', header: 'Amount' },
              { key: 'status', header: 'Status' }
            ]}
            data={ordersData}
          />
        </div>

        {/* Live Activity Feed */}
        <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Logistics & Payment Events</h3>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>● Connected</span>
          </div>

          <ActivityFeed items={activityFeedItems} />
        </div>
      </div>
    </div>
  );
};
