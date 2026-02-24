'use client'
import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Phone, MessageCircle, Mail, MapPin,
  User, Clock, Building2, Star, Edit2, CheckCircle,
  Send, Plus, Download, AlertCircle,
} from 'lucide-react'
import {
  LEADS, AGENTS, statusColor, statusLabel, getAgentName, formatINR,
  type LeadStatus, type Lead,
} from '@/lib/mockData'

interface Props { params: { id: string } }

const STATUS_FLOW: LeadStatus[] = ['new', 'contacted', 'site-visit', 'negotiation', 'closed-won', 'closed-lost']

const NOTE_TYPE_ICONS: Record<string, any> = {
  note: Edit2,
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  sitevisit: Building2,
}

const WHATSAPP_TEMPLATES = [
  { label: 'Initial Contact', body: (l: Lead) => `Hi ${l.firstName}! I'm from DigiSoft Nexus. I saw you're interested in ${l.propertyInterest ?? 'a property'}. Can I share some details?` },
  { label: 'Brochure Offer', body: (l: Lead) => `Hi ${l.firstName}, here's the brochure for ${l.propertyInterest ?? 'the property'} 📄 Let me know if you'd like to schedule a site visit.` },
  { label: 'Follow-Up', body: (l: Lead) => `Hi ${l.firstName}, just checking in on your interest in ${l.propertyInterest ?? 'the property'}. Have you had a chance to review the details?` },
  { label: 'Site Visit Invite', body: (l: Lead) => `Hi ${l.firstName}, would you like to visit the site this weekend? Our team can arrange a private tour. When works best for you?` },
]

export default function LeadDetailPage({ params }: Props) {
  const lead = LEADS.find((l) => l.id === params.id)
  if (!lead) notFound()

  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState<'note' | 'call' | 'whatsapp' | 'email' | 'sitevisit'>('note')
  const [notes, setNotes] = useState(lead.notes ?? [])
  const [assignedAgent, setAssignedAgent] = useState(lead.assignedAgent ?? '')
  const [showTemplates, setShowTemplates] = useState(false)

  const agent = AGENTS.find((a) => a.id === assignedAgent)

  const addNote = () => {
    if (!noteText.trim()) return
    const newNote = {
      id: `n${Date.now()}`,
      leadId: lead.id,
      authorId: 'a1',
      authorName: 'You',
      content: noteText.trim(),
      createdAt: new Date().toISOString(),
      type: noteType,
    }
    setNotes((prev) => [newNote, ...prev])
    setNoteText('')
  }

  const scoreColor = lead.score >= 75 ? 'text-green-600' : lead.score >= 50 ? 'text-amber-600' : 'text-gray-500'
  const progressStep = STATUS_FLOW.indexOf(status)

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + header */}
      <div>
        <Link href="/dashboard/leads" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.firstName} {lead.lastName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <a href={`tel:${lead.phone}`} className="text-sm text-gray-600 hover:text-[#0A1628] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {lead.phone}
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="text-sm text-gray-600 hover:text-[#0A1628] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </a>
              )}
              {lead.currentCity && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {lead.currentCity}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank"
              className="btn-secondary-admin gap-1.5 text-xs">
              <MessageCircle className="w-3.5 h-3.5 text-green-600" /> WhatsApp
            </a>
            <a href={`tel:${lead.phone}`} className="btn-primary-admin gap-1.5 text-xs">
              <Phone className="w-3.5 h-3.5" /> Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Status Progress Bar */}
      <div className="content-card p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lead Journey</p>
        <div className="flex items-center gap-2">
          {STATUS_FLOW.filter((s) => s !== 'closed-lost').map((s, i) => {
            const isWon = s === 'closed-won'
            const isCurrent = s === status
            const isPast = STATUS_FLOW.indexOf(s) <= progressStep && status !== 'closed-lost'
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => setStatus(s)}
                  className={`flex-1 text-center text-xs py-2 px-2 rounded-lg font-medium border transition-all ${
                    isCurrent
                      ? isWon ? 'bg-green-500 text-white border-green-500' : 'bg-[#0A1628] text-white border-[#0A1628]'
                      : isPast
                      ? 'bg-gray-100 text-gray-600 border-gray-200'
                      : 'text-gray-400 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {statusLabel(s)}
                </button>
                {i < STATUS_FLOW.filter((s) => s !== 'closed-lost').length - 1 && (
                  <div className={`h-0.5 w-3 shrink-0 ${isPast ? 'bg-gray-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
          <button
            onClick={() => setStatus('closed-lost')}
            className={`text-xs py-2 px-3 rounded-lg font-medium border transition-all ${
              status === 'closed-lost' ? 'bg-red-500 text-white border-red-500' : 'text-red-400 border-red-200 hover:border-red-300'
            }`}
          >
            Lost
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — Lead Info */}
        <div className="space-y-4">
          {/* Score card */}
          <div className="content-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Score</p>
              <span className={`text-3xl font-bold ${scoreColor}`}>{lead.score}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all ${lead.score >= 75 ? 'bg-green-500' : lead.score >= 50 ? 'bg-amber-500' : 'bg-gray-400'}`}
                style={{ width: `${lead.score}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {lead.score >= 75 ? '🔥 Hot lead — prioritise now' : lead.score >= 50 ? '👍 Warm — follow up today' : '❄️ Cold — nurture over time'}
            </p>
          </div>

          {/* Profile Stage */}
          <div className="content-card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Profile Stage</p>
            {[
              { stage: 1, label: 'Name + Email', desc: 'Basic contact captured' },
              { stage: 2, label: 'Phone + Buyer Type', desc: 'Qualified intent' },
              { stage: 3, label: 'Budget + City', desc: 'Financial context' },
              { stage: 4, label: 'Requirements', desc: 'Full profile' },
            ].map(({ stage, label, desc }) => (
              <div key={stage} className={`flex items-start gap-2.5 mb-3 ${stage > lead.profileStage ? 'opacity-30' : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  stage <= lead.profileStage ? 'bg-[#0A1628] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stage <= lead.profileStage ? '✓' : stage}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lead Details */}
          <div className="content-card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</p>
            <div className="space-y-2.5">
              {[
                { icon: Building2, label: 'Interest', value: lead.propertyInterest ?? '—' },
                { icon: Star, label: 'Buyer Type', value: lead.buyerStatus ?? '—' },
                { icon: AlertCircle, label: 'Budget', value: lead.budget ?? '—' },
                { icon: Clock, label: 'Source', value: lead.source.replace(/-/g, ' ') },
                { icon: MapPin, label: 'City', value: lead.currentCity ?? '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-[11px] text-gray-500 w-20 shrink-0">{label}</span>
                  <span className="text-xs text-gray-700 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UTM Attribution */}
          {(lead.utmSource || lead.utmCampaign) && (
            <div className="content-card p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Attribution</p>
              <div className="space-y-1.5">
                {lead.utmSource && <div className="flex justify-between text-xs"><span className="text-gray-500">Source</span><span className="text-gray-700">{lead.utmSource}</span></div>}
                {lead.utmMedium && <div className="flex justify-between text-xs"><span className="text-gray-500">Medium</span><span className="text-gray-700">{lead.utmMedium}</span></div>}
                {lead.utmCampaign && <div className="flex justify-between text-xs"><span className="text-gray-500">Campaign</span><span className="text-gray-700 truncate ml-2">{lead.utmCampaign}</span></div>}
              </div>
            </div>
          )}

          {/* Assignment */}
          <div className="content-card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assigned Agent</p>
            {agent ? (
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center text-white text-xs font-bold">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{agent.name}</p>
                  <p className="text-[11px] text-gray-400">{agent.role} · {agent.conversionRate}% CVR</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-3">Unassigned</p>
            )}
            <select className="select-admin text-xs" value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)}>
              <option value="">Unassigned</option>
              {AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.conversionRate}% CVR)</option>)}
            </select>
          </div>
        </div>

        {/* Right — Activity Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* WhatsApp Templates */}
          <div className="content-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</p>
              <button onClick={() => setShowTemplates((t) => !t)} className="text-xs text-[#0A1628] hover:underline">
                {showTemplates ? 'Hide' : 'Show'} WhatsApp Templates
              </button>
            </div>
            {showTemplates && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {WHATSAPP_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    onClick={() => {
                      const msg = tpl.body(lead)
                      window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
                    }}
                    className="p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 text-left transition-colors"
                  >
                    <p className="text-xs font-semibold text-green-800">{tpl.label}</p>
                    <p className="text-[10px] text-green-600 mt-0.5 line-clamp-2">{tpl.body(lead)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Note */}
          <div className="content-card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Log Activity</p>
            <div className="flex gap-2 mb-3">
              {(['note', 'call', 'whatsapp', 'email', 'sitevisit'] as const).map((t) => {
                const Icon = NOTE_TYPE_ICONS[t]
                return (
                  <button
                    key={t}
                    onClick={() => setNoteType(t)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      noteType === t ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t === 'sitevisit' ? 'Site Visit' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                )
              })}
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note, log a call outcome, record site visit details…"
              rows={3}
              className="input-admin resize-none mb-2"
            />
            <button onClick={addNote} disabled={!noteText.trim()} className="btn-primary-admin text-xs gap-1.5 disabled:opacity-40">
              <Send className="w-3.5 h-3.5" /> Log Activity
            </button>
          </div>

          {/* Timeline */}
          <div className="content-card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Activity Timeline</p>

            {notes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No activity logged yet. Add a note above.</p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => {
                  const Icon = NOTE_TYPE_ICONS[note.type] ?? Edit2
                  const typeColors: Record<string, string> = {
                    call: 'bg-blue-100 text-blue-600',
                    whatsapp: 'bg-green-100 text-green-600',
                    email: 'bg-purple-100 text-purple-600',
                    sitevisit: 'bg-amber-100 text-amber-700',
                    note: 'bg-gray-100 text-gray-600',
                  }
                  return (
                    <div key={note.id} className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${typeColors[note.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-gray-800">{note.authorName}</p>
                          <p className="text-[10px] text-gray-400 shrink-0">
                            {new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{note.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Created / Updated meta */}
          <div className="flex gap-3 text-xs text-gray-400">
            <span>Created: {new Date(lead.createdAt).toLocaleString('en-IN')}</span>
            <span>·</span>
            <span>Updated: {new Date(lead.updatedAt).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
