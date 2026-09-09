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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl">🧩</span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Plugins & Extensions Hub
            </h1>
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              WordPress Architecture
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Every @boostengine/* package is a self-contained module. When toggled on, it hooks into
            the Storefront UI, registers backend API routes, and injects custom admin configuration controls.
          </p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl text-center">
          <div className="text-base font-bold text-emerald-400">
            {plugins.filter((p) => p.enabled).length} / {plugins.length}
          </div>
          <div className="text-[10px] uppercase font-semibold text-slate-400">Active Plugins</div>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">Loading modular extensions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className={`p-5 rounded-xl border transition relative flex flex-col justify-between ${
                plugin.enabled
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700/60 flex-shrink-0">
                      {plugin.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-sm">{plugin.name}</h3>
                        <span className="text-[10px] font-mono text-slate-500">v{plugin.version}</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400">@{plugin.id}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePlugin(plugin.id, plugin.enabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
                      plugin.enabled ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        plugin.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">{plugin.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      plugin.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-[11px] font-medium text-slate-400">
                    {plugin.enabled ? 'Active on Storefront' : 'Inactive'}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenSettings(plugin)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition"
                >
                  ⚙️ Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {configuringPlugin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{configuringPlugin.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{configuringPlugin.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">@{configuringPlugin.id}</p>
                </div>
              </div>
              <button
                onClick={() => setConfiguringPlugin(null)}
                className="text-slate-400 hover:text-white text-lg"
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
                  <div key={key} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <label className="block text-slate-300 font-semibold mb-1 font-mono text-[11px]">
                      {key}
                    </label>
                    {isBool ? (
                      <button
                        type="button"
                        onClick={() => setSettingsDraft({ ...settingsDraft, [key]: !val })}
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          val ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
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
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setConfiguringPlugin(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
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
