'use client'
import { useState } from 'react'
import {
  Users, Plug, Bell, Key, Shield, Plus, Trash2,
  Check, RefreshCw, Copy, Eye, EyeOff, ChevronRight,
} from 'lucide-react'
import { AGENTS } from '@/lib/mockData'

type Tab = 'team' | 'integrations' | 'notifications' | 'api'

const INTEGRATION_LIST = [
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    desc: 'Sync leads bidirectionally with HubSpot contacts and deals.',
    logo: '🟠',
    connected: true,
    lastSync: '2026-02-24T09:30:00Z',
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    desc: 'Push leads to Zoho CRM as new contacts automatically.',
    logo: '🔴',
    connected: false,
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business API',
    desc: 'Send automated follow-up messages via official WhatsApp Business API.',
    logo: '🟢',
    connected: true,
    lastSync: '2026-02-24T11:00:00Z',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    desc: 'Auto-fire conversion events when leads are created or status changes.',
    logo: '📊',
    connected: true,
    lastSync: '2026-02-24T11:45:00Z',
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads (Offline Conversions)',
    desc: 'Send closed deals as offline conversion events to Meta for ROAS tracking.',
    logo: '🔵',
    connected: false,
  },
  {
    id: 'slack',
    name: 'Slack Notifications',
    desc: 'Get new lead alerts and hot lead pings in your team Slack channel.',
    logo: '💜',
    connected: true,
    lastSync: '2026-02-24T12:00:00Z',
  },
]

const NOTIFICATION_RULES = [
  { id: 'new-lead', label: 'New lead arrives', channels: ['email', 'slack'], enabled: true },
  { id: 'hot-lead', label: 'Lead score crosses 75', channels: ['email', 'slack', 'whatsapp'], enabled: true },
  { id: 'uncontacted', label: 'Lead uncontacted for 24h', channels: ['email'], enabled: true },
  { id: 'site-visit', label: 'Site visit booked', channels: ['email', 'slack'], enabled: true },
  { id: 'lead-closed', label: 'Deal closed', channels: ['slack'], enabled: true },
  { id: 'daily-summary', label: 'Daily lead summary', channels: ['email'], enabled: false },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('team')
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifRules, setNotifRules] = useState(NOTIFICATION_RULES)
  const [integrations, setIntegrations] = useState(INTEGRATION_LIST)

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Keys', icon: Key },
  ]

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, connected: !i.connected } : i))
  }

  const toggleRule = (id: string) => {
    setNotifRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const apiKey = 'dnx_live_sk_9f2a7c4b8e1d6f3a0c5b2e8f7a4d1c9b'
  const masked = 'dnx_live_sk_•••••••••••••••••••••••••••••••••'

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage team, integrations, and platform configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-all ${
              activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ── Team ────────────────────────────────────────────── */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Team Members</h2>
            <button className="btn-primary-admin text-xs gap-1.5"><Plus className="w-3.5 h-3.5" /> Invite Agent</button>
          </div>
          <div className="content-card overflow-hidden">
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Role</th>
                  <th>Leads Assigned</th>
                  <th>CVR</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((agent) => (
                  <tr key={agent.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center text-white text-xs font-bold">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">{agent.name}</p>
                          <p className="text-[10px] text-gray-400">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${
                        agent.role === 'super-admin' ? 'bg-purple-50 text-purple-700' :
                        agent.role === 'manager' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{agent.role}</span>
                    </td>
                    <td><span className="text-sm font-medium text-gray-700">{agent.leadsAssigned}</span></td>
                    <td>
                      <span className={`font-bold text-sm ${agent.conversionRate >= 30 ? 'text-green-600' : 'text-amber-600'}`}>
                        {agent.conversionRate}%
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button className="btn-secondary-admin text-[11px] py-1 px-2">Edit Role</button>
                        <button className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Permissions */}
          <div className="content-card p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0A1628]" /> Role Permissions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Permission</th>
                    <th className="pb-2 font-medium text-center w-24">Super Admin</th>
                    <th className="pb-2 font-medium text-center w-24">Manager</th>
                    <th className="pb-2 font-medium text-center w-24">Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ['View all leads', true, true, false],
                    ['View own leads only', true, true, true],
                    ['Assign leads', true, true, false],
                    ['Edit properties', true, true, false],
                    ['View analytics', true, true, false],
                    ['Manage campaigns', true, true, false],
                    ['Manage team', true, false, false],
                    ['API key access', true, false, false],
                    ['Export data', true, true, false],
                  ].map(([label, sa, mgr, agent]) => (
                    <tr key={String(label)}>
                      <td className="py-2 text-gray-700">{label}</td>
                      {[sa, mgr, agent].map((v, i) => (
                        <td key={i} className="py-2 text-center">
                          {v ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-300 text-base">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Integrations ─────────────────────────────────────── */}
      {activeTab === 'integrations' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Connect DigiSoft Nexus with your existing tools.</p>
          {integrations.map((intg) => (
            <div key={intg.id} className="content-card p-5 flex items-center gap-4">
              <div className="text-2xl w-10 text-center">{intg.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-gray-800 text-sm">{intg.name}</p>
                  {intg.connected && (
                    <span className="badge bg-green-50 text-green-700 text-[10px]">Connected</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{intg.desc}</p>
                {intg.connected && intg.lastSync && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Last sync: {new Date(intg.lastSync).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {intg.connected && (
                  <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
                <button
                  onClick={() => toggleIntegration(intg.id)}
                  className={`btn-admin text-xs px-4 py-1.5 ${intg.connected ? 'btn-secondary-admin text-red-600 border-red-200 hover:bg-red-50' : 'btn-primary-admin'}`}
                >
                  {intg.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
            <p className="font-semibold mb-1">Phase 7 — CRM Integration</p>
            <p>Full HubSpot and Zoho CRM integration with bidirectional sync, automated deal creation, and pipeline management is coming in Phase 7 of this project.</p>
          </div>
        </div>
      )}

      {/* ── Notifications ────────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="content-card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">Notification Rules</h3>
              <p className="text-xs text-gray-500 mt-0.5">Configure when and how you get notified about lead activity.</p>
            </div>
            <div className="divide-y divide-gray-50">
              {notifRules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{rule.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {rule.channels.map((ch) => (
                        <span key={ch} className="badge bg-gray-100 text-gray-500 text-[10px] capitalize">{ch}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-10 h-5.5 rounded-full transition-all relative ${rule.enabled ? 'bg-[#0A1628]' : 'bg-gray-200'}`}
                    style={{ minWidth: 40, height: 22 }}
                  >
                    <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all`}
                      style={{ width: 18, height: 18, left: rule.enabled ? '50%' : 2 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Notification Channels</h3>
            <div className="space-y-3">
              {[
                { channel: 'Email', placeholder: 'team@digisoftnexus.com', value: 'team@digisoftnexus.com' },
                { channel: 'Slack Webhook', placeholder: 'https://hooks.slack.com/…', value: 'https://hooks.slack.com/services/T0…' },
                { channel: 'WhatsApp Number', placeholder: '+919999999999', value: '+919999999999' },
              ].map(({ channel, placeholder, value }) => (
                <div key={channel}>
                  <label className="label-admin">{channel}</label>
                  <input type="text" defaultValue={value} placeholder={placeholder} className="input-admin" />
                </div>
              ))}
              <button className="btn-primary-admin text-xs">Save Channels</button>
            </div>
          </div>
        </div>
      )}

      {/* ── API Keys ─────────────────────────────────────────── */}
      {activeTab === 'api' && (
        <div className="space-y-4">
          <div className="content-card p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#D4AF37]" /> API Keys
            </h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
              <p className="text-xs text-amber-800 font-semibold mb-0.5">Keep your API key secret</p>
              <p className="text-[11px] text-amber-700">Never expose your API key in client-side code. Use it only on your backend server.</p>
            </div>

            <div>
              <label className="label-admin">Live Secret Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs text-gray-700 overflow-hidden">
                  {showApiKey ? apiKey : masked}
                </div>
                <button onClick={() => setShowApiKey((s) => !s)}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                  {showApiKey ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                </button>
                <button onClick={() => navigator.clipboard.writeText(apiKey)}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="btn-danger-admin text-xs gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Rotate Key
              </button>
              <p className="text-[11px] text-gray-400 mt-2">Rotating the key will invalidate the current key immediately. Update all integrations before rotating.</p>
            </div>
          </div>

          <div className="content-card p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">API Reference</h3>
            <div className="space-y-3">
              {[
                { method: 'POST', endpoint: '/api/leads/capture/', desc: 'Create a new lead (used by all frontend forms)' },
                { method: 'GET', endpoint: '/api/leads/', desc: 'List all leads with pagination and filters' },
                { method: 'PATCH', endpoint: '/api/leads/{id}/', desc: 'Update lead status, assignment, or notes' },
                { method: 'GET', endpoint: '/api/campaigns/', desc: 'List campaigns with performance metrics' },
                { method: 'GET', endpoint: '/api/analytics/funnel/', desc: 'Get conversion funnel data' },
                { method: 'GET', endpoint: '/api/analytics/attribution/', desc: 'Get UTM source attribution breakdown' },
              ].map(({ method, endpoint, desc }) => (
                <div key={endpoint} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className={`badge text-[10px] shrink-0 ${method === 'GET' ? 'bg-blue-50 text-blue-700' : method === 'POST' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {method}
                  </span>
                  <div>
                    <p className="font-mono text-xs text-gray-800">{endpoint}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-3">Full API documentation available at{' '}
              <a href="https://docs.digisoftnexus.com" target="_blank" className="text-[#0A1628] hover:underline">
                docs.digisoftnexus.com
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
