import { UIComponentItem } from '../../types';

export const dataData: UIComponentItem[] = [
  {
    id: 'Table',
    name: 'Table',
    category: 'data',
    description: 'Responsive data table with striped rows, borders, compact view, and custom cell formatters.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add table',
    codeSnippet: `import { Table } from '@boostengine/ui';

export function OrdersTable() {
  return (
    <Table
      columns={[
        { key: 'id', header: 'Order ID' },
        { key: 'customer', header: 'Customer' },
        { key: 'total', header: 'Amount' }
      ]}
      data={[
        { id: '#1001', customer: 'Rahul Sharma', total: '₹1,999' },
        { id: '#1002', customer: 'Pooja Verma', total: '₹2,499' }
      ]}
    />
  );
}`,
    props: [
      { name: 'columns', type: 'TableColumn[]', default: '[]', description: 'Column headers and keys' },
      { name: 'data', type: 'any[]', default: '[]', description: 'Table rows data' }
    ]
  },
  {
    id: 'DataTable',
    name: 'DataTable',
    category: 'data',
    description: 'Enterprise data table with multi-row checkbox selection, column sorting, search filter, sticky headers, 1-click CSV export, and client/server pagination.',
    badge: 'Enterprise • v2.0.0',
    cliCommand: 'npx boost-ui add data-table',
    codeSnippet: `import { DataTable, DataTableColumn } from '@boostengine/ui';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  stock: number;
  price: string;
}

const columns: DataTableColumn<Product>[] = [
  { key: 'name', header: 'Product Name', sortable: true },
  { key: 'stock', header: 'Inventory Units', sortable: true },
  { key: 'price', header: 'Unit Price', sortable: true }
];

export function InventoryManager() {
  const [selected, setSelected] = useState<Product[]>([]);

  return (
    <DataTable
      columns={columns}
      data={[
        { id: '1', name: 'Oversized Cotton Tee (L)', stock: 45, price: '₹999' },
        { id: '2', name: 'Vintage Denim Jacket (M)', stock: 12, price: '₹2,999' },
        { id: '3', name: 'Relaxed Cargo Pants (32)', stock: 28, price: '₹1,499' }
      ]}
      selectable
      onSelectionChange={setSelected}
      searchable
      exportable
      exportFilename="inventory-report.csv"
      stickyHeader
      maxHeight="420px"
    />
  );
}`,
    props: [
      { name: 'columns', type: 'DataTableColumn<T>[]', default: '[]', description: 'Column definitions with key, header/title, sortable, and render functions' },
      { name: 'data', type: 'T[]', default: '[]', description: 'Array of data records' },
      { name: 'selectable', type: 'boolean', default: 'false', description: 'Enables multi-row selection with checkboxes and select-all in header' },
      { name: 'selectedRows', type: 'T[]', default: 'undefined', description: 'Controlled array of currently selected rows' },
      { name: 'onSelectionChange', type: '(selected: T[]) => void', default: 'undefined', description: 'Callback fired when selected rows change' },
      { name: 'searchable', type: 'boolean', default: 'false', description: 'Includes real-time keyword search input filter' },
      { name: 'searchPlaceholder', type: 'string', default: "'Search records...'", description: 'Placeholder for search input' },
      { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Fixes table header during vertical scrolling' },
      { name: 'maxHeight', type: 'string | number', default: 'undefined', description: 'Scrollable container height constraint (e.g. 400px)' },
      { name: 'exportable', type: 'boolean', default: 'false', description: 'Enables 1-click CSV export button' },
      { name: 'exportFilename', type: 'string', default: "'export.csv'", description: 'File name for exported CSV' },
      { name: 'pageSize', type: 'number', default: '10', description: 'Number of rows displayed per page' },
      { name: 'manualPagination', type: 'boolean', default: 'false', description: 'Enables server-side pagination mode' },
      { name: 'totalCount', type: 'number', default: 'undefined', description: 'Total count for server-side pagination' },
      { name: 'page', type: 'number', default: 'undefined', description: 'Controlled active page index' },
      { name: 'onPageChange', type: '(page: number) => void', default: 'undefined', description: 'Callback fired when page index changes' },
      { name: 'stylePreset', type: 'UIStylePreset', default: 'undefined', description: 'Per-component style preset override' }
    ]
  },
  {
    id: 'StatsCard',
    name: 'StatsCard',
    category: 'data',
    description: 'Metric KPI card with numeric value, trend indicator percentage, and SVG icon slot.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add stats-card',
    codeSnippet: `import { StatsCard } from '@boostengine/ui';

export function RevenueMetric() {
  return (
    <StatsCard
      title="Monthly Revenue"
      value="₹4,82,900"
      trend={{ value: 14.5, isPositive: true }}
      description="vs. previous 30 days"
    />
  );
}`,
    props: [
      { name: 'value', type: 'string | number', default: "''", description: 'Main KPI metric figure' },
      { name: 'trend', type: '{ value: number; isPositive: boolean }', default: 'undefined', description: 'Percentage change' }
    ]
  },
  {
    id: 'DateRangePicker',
    name: 'DateRangePicker',
    category: 'data',
    description: 'Dual-date range selector for analytics reports with start and end date controls.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add date-range-picker',
    codeSnippet: `import { DateRangePicker } from '@boostengine/ui';
import { useState } from 'react';

export function FilterRange() {
  const [range, setRange] = useState({ startDate: '2026-09-01', endDate: '2026-09-18' });
  return <DateRangePicker value={range} onChange={setRange} />;
}`,
    props: [
      { name: 'value', type: 'DateRange', default: '{ startDate: "", endDate: "" }', description: 'Selected start and end date' }
    ]
  },
  {
    id: 'ExportButton',
    name: 'ExportButton',
    category: 'data',
    description: 'Action button with SVG download icon for exporting datasets to CSV, Excel, or JSON.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add export-button',
    codeSnippet: `import { ExportButton } from '@boostengine/ui';

export function ExportOrders() {
  return (
    <ExportButton
      format="csv"
      onExport={(format) => console.log('Exporting as:', format)}
    />
  );
}`,
    props: [
      { name: 'format', type: "'csv' | 'xlsx' | 'pdf' | 'json'", default: "'csv'", description: 'Target file format' }
    ]
  },
  {
    id: 'Filter',
    name: 'Filter',
    category: 'data',
    description: 'Filter button with dropdown checkboxes, active item counter badge, and clear-all action.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add filter',
    codeSnippet: `import { Filter } from '@boostengine/ui';
import { useState } from 'react';

export function CategoryFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Filter
      label="Category"
      options={[
        { label: 'T-Shirts', value: 'tshirts', count: 42 },
        { label: 'Hoodies', value: 'hoodies', count: 18 }
      ]}
      selectedValues={selected}
      onChange={setSelected}
    />
  );
}`,
    props: [
      { name: 'options', type: 'FilterOption[]', default: '[]', description: 'List of filter options' }
    ]
  },
  {
    id: 'Sort',
    name: 'Sort',
    category: 'data',
    description: 'Sort selector dropdown with asc/desc direction toggle button and SVG sorting arrows.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add sort',
    codeSnippet: `import { Sort } from '@boostengine/ui';
import { useState } from 'react';

export function ProductSorting() {
  const [sortKey, setSortKey] = useState('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  return (
    <Sort
      options={[
        { label: 'Price', value: 'price' },
        { label: 'Popularity', value: 'popularity' },
        { label: 'Rating', value: 'rating' }
      ]}
      currentValue={sortKey}
      currentDirection={sortDir}
      onChange={(key, dir) => {
        setSortKey(key);
        setSortDir(dir);
      }}
    />
  );
}`,
    props: [
      { name: 'options', type: 'SortOption[]', default: '[]', description: 'Sorting criteria options' }
    ]
  },
  {
    id: 'AreaChart',
    name: 'AreaChart',
    category: 'data',
    description: 'Zero-dependency responsive SVG area and trend chart with gradient fill, gridlines, and interactive hover tooltips for revenue and sales metrics.',
    badge: 'New in v1.6.0',
    cliCommand: 'npx boost-ui add area-chart',
    codeSnippet: `import { AreaChart } from '@boostengine/ui';

export function RevenueTrend() {
  const data = [
    { label: 'Mon', value: 12400, secondaryValue: 9800 },
    { label: 'Tue', value: 18900, secondaryValue: 12400 },
    { label: 'Wed', value: 15600, secondaryValue: 14200 },
    { label: 'Thu', value: 24800, secondaryValue: 17100 },
    { label: 'Fri', value: 31200, secondaryValue: 22400 },
    { label: 'Sat', value: 42500, secondaryValue: 28900 },
    { label: 'Sun', value: 38900, secondaryValue: 26500 },
  ];

  return (
    <AreaChart
      title="Weekly Revenue"
      subtitle="Total revenue generated compared to last week"
      data={data}
      valuePrefix="₹"
      primaryLabel="This Week"
      secondaryLabel="Last Week"
      color="#3b82f6"
    />
  );
}`,
    props: [
      { name: 'data', type: 'ChartDataPoint[]', default: '[]', description: 'Array of data points with label, value, and optional secondaryValue' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Chart title heading' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Subtext or metric explanation' },
      { name: 'valuePrefix', type: 'string', default: "''", description: 'Prefix for formatted numbers (e.g. ₹ or $)' },
      { name: 'color', type: 'string', default: "'#3b82f6'", description: 'Primary line and area gradient accent color' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Render background horizontal guide lines' }
    ]
  },
  {
    id: 'BarChart',
    name: 'BarChart',
    category: 'data',
    description: 'Zero-dependency responsive SVG bar chart with rounded tops, auto-scaling Y axis, comparison bars, and interactive hover tooltips.',
    badge: 'New in v1.6.0',
    cliCommand: 'npx boost-ui add bar-chart',
    codeSnippet: `import { BarChart } from '@boostengine/ui';

export function OrdersComparison() {
  const data = [
    { label: 'Jan', value: 450, secondaryValue: 320 },
    { label: 'Feb', value: 580, secondaryValue: 410 },
    { label: 'Mar', value: 720, secondaryValue: 500 },
    { label: 'Apr', value: 890, secondaryValue: 640 },
    { label: 'May', value: 1100, secondaryValue: 780 },
    { label: 'Jun', value: 1350, secondaryValue: 920 },
  ];

  return (
    <BarChart
      title="Monthly Orders"
      subtitle="Orders received vs previous period"
      data={data}
      color="#10b981"
      secondaryColor="#94a3b8"
      primaryLabel="2026"
      secondaryLabel="2025"
    />
  );
}`,
    props: [
      { name: 'data', type: 'BarChartDataPoint[]', default: '[]', description: 'Array of items with label, value, and optional secondaryValue' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Card title' },
      { name: 'color', type: 'string', default: "'#3b82f6'", description: 'Primary bar color' },
      { name: 'secondaryColor', type: 'string', default: "'#94a3b8'", description: 'Comparison bar color' }
    ]
  },
  {
    id: 'DonutChart',
    name: 'DonutChart',
    category: 'data',
    description: 'Zero-dependency SVG donut/pie chart with percentage arcs, center metrics, hover slice expansion, and interactive legend.',
    badge: 'New in v1.6.0',
    cliCommand: 'npx boost-ui add donut-chart',
    codeSnippet: `import { DonutChart } from '@boostengine/ui';

export function PaymentDistribution() {
  const data = [
    { label: 'UPI', value: 680, color: '#3b82f6' },
    { label: 'COD', value: 240, color: '#f59e0b' },
    { label: 'Cards', value: 150, color: '#10b981' },
    { label: 'NetBanking', value: 80, color: '#8b5cf6' },
  ];

  return (
    <DonutChart
      title="Payment Method Breakdown"
      subtitle="Orders categorized by customer payment choice"
      data={data}
      centerLabel="Orders"
      centerValue="1,150"
    />
  );
}`,
    props: [
      { name: 'data', type: 'DonutDataPoint[]', default: '[]', description: 'Array of categories with label, value, and custom color' },
      { name: 'innerRadiusRatio', type: 'number', default: '0.65', description: 'Hole size ratio (0 for solid Pie, 0.65 for Donut)' },
      { name: 'centerLabel', type: 'string', default: "'Total'", description: 'Label displayed inside donut center hole' },
      { name: 'centerValue', type: 'string', default: 'undefined', description: 'Total value displayed in center' }
    ]
  },
  {
    id: 'Sparkline',
    name: 'Sparkline',
    category: 'data',
    description: 'Ultra-compact SVG micro-trend line chart for embedding into KPI cards, tables, and product analytics.',
    badge: 'New in v1.6.0',
    cliCommand: 'npx boost-ui add sparkline',
    codeSnippet: `import { Sparkline } from '@boostengine/ui';

export function MetricWithTrend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Daily Visitors</span>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>8,420</div>
      </div>
      <Sparkline data={[12, 18, 14, 22, 19, 28, 35]} height={32} />
    </div>
  );
}`,
    props: [
      { name: 'data', type: 'number[]', default: '[]', description: 'Array of numeric values' },
      { name: 'autoColor', type: 'boolean', default: 'true', description: 'Automatically green for upward trend, red for downward trend' },
      { name: 'height', type: 'number', default: '36', description: 'Height in pixels' }
    ]
  }
];
