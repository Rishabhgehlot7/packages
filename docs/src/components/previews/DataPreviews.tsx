import React, { useState } from 'react';
import {
  Table,
  DataTable,
  StatsCard,
  DateRangePicker,
  ExportButton,
  Filter,
  Sort,
  AreaChart,
  BarChart,
  DonutChart,
  Sparkline,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const TablePreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '600px' }}>
    <Table
      columns={[
        { key: 'orderId', header: 'Order ID' },
        { key: 'customer', header: 'Customer' },
        { key: 'status', header: 'Status' },
        { key: 'total', header: 'Total' }
      ]}
      data={[
        { orderId: '#98401', customer: 'Rahul Sharma', status: 'Shipped', total: '₹1,999' },
        { orderId: '#98402', customer: 'Aditi Rao', status: 'Delivered', total: '₹3,499' },
        { orderId: '#98403', customer: 'Pooja Verma', status: 'Processing', total: '₹899' }
      ]}
    />
  </div>
);

export const DataTablePreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '680px' }}>
    <DataTable
      columns={[
        { key: 'title', header: 'Product Item', sortable: true },
        { key: 'stock', header: 'Inventory', sortable: true },
        { key: 'price', header: 'Price', sortable: true }
      ]}
      data={[
        { title: 'Oversized Cotton Tee (L)', stock: 45, price: '₹999' },
        { title: 'Cargo Joggers (32)', stock: 12, price: '₹1,499' },
        { title: 'Vintage Denim Jacket (M)', stock: 8, price: '₹2,999' },
        { title: 'Linen Casual Shirt (XL)', stock: 24, price: '₹1,299' },
        { title: 'Graphic Hoodie (M)', stock: 19, price: '₹1,899' }
      ]}
      selectable
      onSelectionChange={(selected) => onShowToast(`Selected ${selected.length} products`)}
      searchable
      exportable
      exportFilename="inventory-catalog.csv"
      stickyHeader
      maxHeight="320px"
    />
  </div>
);

export const StatsCardPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', width: '100%', maxWidth: '500px' }}>
    <StatsCard
      title="Daily Revenue"
      value="₹78,420"
      trend={{ value: 18.2, isPositive: true }}
      description="vs yesterday"
    />
    <StatsCard
      title="Return Rate"
      value="2.4%"
      trend={{ value: 0.8, isPositive: false }}
      description="industry average: 6%"
    />
  </div>
);

export const DateRangePickerPreview: React.FC<PreviewProps> = () => {
  const [dateRange, setDateRange] = useState({ startDate: '2026-09-01', endDate: '2026-09-18' });
  return (
    <div style={{ maxWidth: '340px' }}>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />
    </div>
  );
};

export const ExportButtonPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <ExportButton format="csv" onExport={(fmt) => onShowToast(`Exporting ${fmt.toUpperCase()} file`)} />
    <ExportButton format="xlsx" onExport={(fmt) => onShowToast(`Exporting ${fmt.toUpperCase()} file`)} />
  </div>
);

export const FilterPreview: React.FC<PreviewProps> = () => {
  const [filter, setFilter] = useState<string[]>(['tshirts']);
  return (
    <Filter
      label="Product Category"
      options={[
        { label: 'T-Shirts & Tops', value: 'tshirts', count: 42 },
        { label: 'Jeans & Denims', value: 'jeans', count: 18 },
        { label: 'Hoodies & Jackets', value: 'hoodies', count: 9 }
      ]}
      selectedValues={filter}
      onChange={setFilter}
    />
  );
};

export const SortPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [sortKey, setSortKey] = useState('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  return (
    <Sort
      options={[
        { label: 'Price: Low to High', value: 'price' },
        { label: 'Customer Rating', value: 'rating' },
        { label: 'Newest Arrivals', value: 'newest' }
      ]}
      currentValue={sortKey}
      currentDirection={sortDir}
      onChange={(val, dir) => {
        setSortKey(val);
        setSortDir(dir);
        onShowToast(`Sorted by ${val} (${dir})`);
      }}
    />
  );
};

export const AreaChartPreview: React.FC<PreviewProps> = () => {
  const weeklyData = [
    { label: 'Mon', value: 12400, secondaryValue: 9800 },
    { label: 'Tue', value: 18900, secondaryValue: 12400 },
    { label: 'Wed', value: 15600, secondaryValue: 14200 },
    { label: 'Thu', value: 24800, secondaryValue: 17100 },
    { label: 'Fri', value: 31200, secondaryValue: 22400 },
    { label: 'Sat', value: 42500, secondaryValue: 28900 },
    { label: 'Sun', value: 38900, secondaryValue: 26500 },
  ];
  return (
    <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto' }}>
      <AreaChart
        title="Store Revenue Analytics"
        subtitle="Comparing this week vs last week gross merchandise value"
        data={weeklyData}
        valuePrefix="₹"
        primaryLabel="This Week"
        secondaryLabel="Last Week"
        color="#3b82f6"
      />
    </div>
  );
};

export const BarChartPreview: React.FC<PreviewProps> = () => {
  const monthlyOrders = [
    { label: 'Jan', value: 450, secondaryValue: 320 },
    { label: 'Feb', value: 580, secondaryValue: 410 },
    { label: 'Mar', value: 720, secondaryValue: 500 },
    { label: 'Apr', value: 890, secondaryValue: 640 },
    { label: 'May', value: 1100, secondaryValue: 780 },
    { label: 'Jun', value: 1350, secondaryValue: 920 },
  ];
  return (
    <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto' }}>
      <BarChart
        title="Monthly Order Volume"
        subtitle="Completed deliveries comparison (2026 vs 2025)"
        data={monthlyOrders}
        primaryLabel="2026"
        secondaryLabel="2025"
        color="#10b981"
        secondaryColor="#94a3b8"
      />
    </div>
  );
};

export const DonutChartPreview: React.FC<PreviewProps> = () => {
  const paymentMix = [
    { label: 'UPI / QR', value: 680, color: '#3b82f6' },
    { label: 'Cash on Delivery', value: 240, color: '#f59e0b' },
    { label: 'Credit/Debit Cards', value: 150, color: '#10b981' },
    { label: 'NetBanking & EMI', value: 80, color: '#8b5cf6' },
  ];
  return (
    <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
      <DonutChart
        title="Payment Methods Distribution"
        subtitle="Order settlement breakdown by payment gateways"
        data={paymentMix}
        centerLabel="Orders"
        centerValue="1,150"
      />
    </div>
  );
};

export const SparklinePreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: 'var(--boost-surface)',
      borderRadius: '12px',
      border: '1px solid var(--boost-border)'
    }}>
      <div>
        <span style={{ fontSize: '12px', color: 'var(--boost-text-muted)' }}>Daily Conversions (Rising)</span>
        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--boost-text)' }}>3,842</div>
      </div>
      <Sparkline data={[12, 16, 14, 22, 19, 28, 38]} height={38} width={140} autoColor />
    </div>

    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: 'var(--boost-surface)',
      borderRadius: '12px',
      border: '1px solid var(--boost-border)'
    }}>
      <div>
        <span style={{ fontSize: '12px', color: 'var(--boost-text-muted)' }}>Bounce Rate (Dropping)</span>
        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--boost-text)' }}>24.2%</div>
      </div>
      <Sparkline data={[45, 42, 38, 35, 30, 28, 24]} height={38} width={140} autoColor />
    </div>
  </div>
);

export const DataPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'Table': return <TablePreview onShowToast={onShowToast} />;
    case 'DataTable': return <DataTablePreview onShowToast={onShowToast} />;
    case 'StatsCard': return <StatsCardPreview onShowToast={onShowToast} />;
    case 'DateRangePicker': return <DateRangePickerPreview onShowToast={onShowToast} />;
    case 'ExportButton': return <ExportButtonPreview onShowToast={onShowToast} />;
    case 'Filter': return <FilterPreview onShowToast={onShowToast} />;
    case 'Sort': return <SortPreview onShowToast={onShowToast} />;
    case 'AreaChart': return <AreaChartPreview onShowToast={onShowToast} />;
    case 'BarChart': return <BarChartPreview onShowToast={onShowToast} />;
    case 'DonutChart': return <DonutChartPreview onShowToast={onShowToast} />;
    case 'Sparkline': return <SparklinePreview onShowToast={onShowToast} />;
    default: return null;
  }
};
