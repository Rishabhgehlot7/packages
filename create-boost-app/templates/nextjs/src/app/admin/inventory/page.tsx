'use client';

import React, { useState } from 'react';
import { PRODUCTS, StoreProduct } from '../../../data/products';
import { createBoostInventory, BoostInventory } from '@boostengine/inventory';
import {
  Boxes,
  Warehouse,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

interface WarehouseStock {
  id: string;
  name: string;
  city: string;
  stock: number;
}

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [inventoryState, setInventoryState] = useState(
    PRODUCTS.map((p) => ({
      ...p,
      warehouses: [
        { id: 'wh-mum', name: 'Bhiwandi Fulfillment Center', city: 'Mumbai', stock: Math.floor((p.inventoryCount || 50) * 0.6) },
        { id: 'wh-del', name: 'Gurugram Logistics Hub', city: 'Delhi NCR', stock: Math.floor((p.inventoryCount || 50) * 0.4) },
      ],
      safetyBuffer: 5,
      reservedCount: Math.floor(Math.random() * 4),
    }))
  );

  const totalUnits = inventoryState.reduce((sum, p) => sum + (p.inventoryCount || 0), 0);
  const lowStockCount = inventoryState.filter((p) => (p.inventoryCount || 0) <= 10).length;
  const reservedUnits = inventoryState.reduce((sum, p) => sum + p.reservedCount, 0);

  const filteredProducts = inventoryState.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStock = (productId: string, whId: string, newStock: number) => {
    setInventoryState((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedWh = p.warehouses.map((wh) => (wh.id === whId ? { ...wh, stock: Math.max(0, newStock) } : wh));
        const total = updatedWh.reduce((s, w) => s + w.stock, 0);
        return { ...p, warehouses: updatedWh, inventoryCount: total };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-7 h-7 text-indigo-600" /> Multi-Warehouse Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time stock reservation, multi-node warehouse allocations, and low-stock replenishment alerts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total On-Hand Units</span>
            <Warehouse className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{totalUnits.toLocaleString('en-IN')}</div>
          <p className="text-xs text-gray-400">Across 2 Active Fulfillment Hubs</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">15-Min Active Reservations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{reservedUnits} units</div>
          <p className="text-xs text-gray-400">Locked in customer checkout carts</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-red-600">{lowStockCount} SKUs</div>
          <p className="text-xs text-gray-400">Inventory below safety buffer threshold (≤10)</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKU, Product Title, or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Warehouses</option>
          <option value="wh-mum">Mumbai FC</option>
          <option value="wh-del">Delhi NCR Hub</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 border-b border-gray-200 dark:border-zinc-800 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Bhiwandi (Mumbai)</th>
                <th className="py-3.5 px-4">Gurugram (Delhi)</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Cart Reserved</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {filteredProducts.map((p) => {
                const total = p.inventoryCount || 0;
                const isLow = total <= 10;
                const isOos = total === 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <img
                        src={p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-zinc-700"
                      />
                      <div>
                        <div className="font-bold line-clamp-1">{p.title}</div>
                        <span className="text-[10px] font-mono text-gray-400">SKU-{p.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-medium">{p.category}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={p.warehouses[0].stock}
                        onChange={(e) => handleUpdateStock(p.id, 'wh-mum', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-center font-bold text-gray-900 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={p.warehouses[1].stock}
                        onChange={(e) => handleUpdateStock(p.id, 'wh-del', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-center font-bold text-gray-900 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-sm text-gray-900 dark:text-white">
                      {total}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-600 font-bold">
                      {p.reservedCount > 0 ? `${p.reservedCount} units` : '0'}
                    </td>
                    <td className="py-3 px-4">
                      {isOos ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                          Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
