'use client';

import React, { useEffect, useState } from 'react';
import { BoostPluginConfig } from '../../../data/db';

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState<BoostPluginConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [configuringPlugin, setConfiguringPlugin] = useState<BoostPluginConfig | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<Record<string, any>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  async function loadPlugins() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/plugins');
      const data = await res.json();
      if (data.success) {
        setPlugins(data.data);
      }
    } catch (err) {
      console.error('Failed to load plugins', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlugins();
  }, []);

  async function handleTogglePlugin(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    try {
      setPlugins((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled: newStatus } : p))
      );

      const res = await fetch('/api/admin/plugins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        alert('Failed to toggle plugin: ' + data.error);
        loadPlugins();
      }
    } catch (err) {
      console.error(err);
      loadPlugins();
    }
  }

  function handleOpenSettings(plugin: BoostPluginConfig) {
    setConfiguringPlugin(plugin);
    setSettingsDraft({ ...plugin.settings });
  }

  async function handleSaveSettings() {
    if (!configuringPlugin) return;
    try {
      setSavingSettings(true);
      const res = await fetch('/api/admin/plugins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: configuringPlugin.id,
          settings: settingsDraft,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlugins((prev) =>
          prev.map((p) => (p.id === configuringPlugin.id ? data.data : p))
        );
        setConfiguringPlugin(null);
      } else {
        alert(data.error || 'Failed to update plugin settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving plugin settings');
    } finally {
      setSavingSettings(false);
    }
  }

  const categories = [
    { id: 'all', label: 'All Extensions' },
    { id: 'marketing', label: 'Marketing & SEO' },
    { id: 'operations', label: 'Operations & Invoicing' },
    { id: 'payments', label: 'Payments' },
    { id: 'engagement', label: 'Social & Reviews' },
    { id: 'sales', label: 'Sales & WhatsApp' },
  ];

  const filteredPlugins = plugins.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl">🧩</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Plugins & Extensions Hub
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-indigo-200/80">
              WordPress Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Every @boostengine/* package is a self-contained module. When toggled on, it hooks into
            the Storefront UI, registers backend API routes, and injects custom admin configuration controls.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center shadow-2xs">
          <div className="text-base font-bold text-emerald-600">
            {plugins.filter((p) => p.enabled).length} / {plugins.length}
          </div>
          <div className="text-[10px] uppercase font-semibold text-slate-500">Active Plugins</div>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs font-medium">Loading modular extensions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className={`p-5 rounded-xl border transition relative flex flex-col justify-between shadow-xs ${
                plugin.enabled
                  ? 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-md'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200 flex-shrink-0">
                      {plugin.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-sm">{plugin.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">v{plugin.version}</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600">@{plugin.id}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePlugin(plugin.id, plugin.enabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
                      plugin.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        plugin.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">{plugin.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      plugin.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-[11px] font-medium text-slate-500">
                    {plugin.enabled ? 'Active on Storefront' : 'Inactive'}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenSettings(plugin)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 text-xs font-semibold transition shadow-2xs cursor-pointer"
                >
                  ⚙️ Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {configuringPlugin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{configuringPlugin.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{configuringPlugin.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">@{configuringPlugin.id}</p>
                </div>
              </div>
              <button
                onClick={() => setConfiguringPlugin(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {Object.keys(settingsDraft).map((key) => {
                const val = settingsDraft[key];
                const isBool = typeof val === 'boolean';
                const isNum = typeof val === 'number';

                return (
                  <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="block text-slate-700 font-semibold mb-1 font-mono text-[11px]">
                      {key}
                    </label>
                    {isBool ? (
                      <button
                        type="button"
                        onClick={() => setSettingsDraft({ ...settingsDraft, [key]: !val })}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer shadow-2xs ${
                          val ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {val ? 'Enabled' : 'Disabled'}
                      </button>
                    ) : (
                      <input
                        type={isNum ? 'number' : 'text'}
                        value={val ?? ''}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            [key]: isNum ? Number(e.target.value) : e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setConfiguringPlugin(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-xs"
              >
                {savingSettings ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
