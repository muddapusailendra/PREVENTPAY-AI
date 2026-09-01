import React, { useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  BrainCircuit,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  Menu,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
  Zap,
  UserPlus,
  Code2,
  Terminal,
  Send,
  Key,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AppProvider, useApp, CustomerWithScore } from './context/AppContext';
import { ScoreInspectorModal } from './components/ScoreInspectorModal';
import { ClaudeApiInspectorModal } from './components/ClaudeApiInspectorModal';
import { AddCustomerModal } from './components/AddCustomerModal';
import { TrendChart } from './components/TrendChart';

const navItems = [
  { label: 'Overview', id: 'overview-section', icon: LayoutDashboard },
  { label: 'Recovery Table', id: 'recovery-table-section', icon: WalletCards, badge: '16' },
  { label: 'Customers', id: 'customers-section', icon: Users },
  { label: 'Transactions', id: 'transactions-section', icon: CreditCard },
];

function MainContent() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    selectedRiskTier,
    setSelectedRiskTier,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    activeCustomer,
    setActiveCustomer,
    isScoreInspectorOpen,
    setIsScoreInspectorOpen,
    isClaudeApiInspectorOpen,
    setIsClaudeApiInspectorOpen,
    userApiKey,
    setUserApiKey,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    simulatedWeeks,
    simulationLogs,
    simulateOneWeek,
    resetSimulation,
    generateAiExplanation,
    generateAiAction,
    stats,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState(userApiKey);

  const handleNavClick = (label: string, id: string) => {
    setActiveNav(label);
    if (mobileOpen) setMobileOpen(false);

    const targetElem = document.getElementById(id);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setUserApiKey(keyInput.trim());
    setIsApiKeyModalOpen(false);
  };

  const handleInspectScore = (customer: CustomerWithScore) => {
    setActiveCustomer(customer);
    setIsScoreInspectorOpen(true);
  };

  const handleInspectClaudeApi = (customer: CustomerWithScore) => {
    setActiveCustomer(customer);
    setIsClaudeApiInspectorOpen(true);
  };

  const handleTriggerAction = async (customerId: string) => {
    setLoadingRowId(customerId);
    await generateAiAction(customerId);
    setLoadingRowId(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F8FAFC]">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#23304D] bg-[#080C14] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] text-black shadow-lg shadow-[#10B981]/20">
              <BrainCircuit className="size-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                PreventPay <span className="text-[#10B981]">AI</span>
              </span>
              <p className="text-[10px] text-[#94A3B8] font-medium">Predictive Revenue Safeguard</p>
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#131B2E] lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[.15em] text-[#94A3B8]">
          Workspace Navigation
        </p>
        <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
          {navItems.map(({ label, id, icon: Icon, badge }) => (
            <button
              key={label}
              onClick={() => handleNavClick(label, id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeNav === label
                  ? 'bg-[#10B981] text-black font-bold shadow-md shadow-[#10B981]/20 scale-[1.02]'
                  : 'text-[#94A3B8] hover:bg-[#131B2E] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-[18px]" />
                {label}
              </span>
              {badge && (
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-mono font-bold ${
                    activeNav === label ? 'bg-black/20 text-black' : 'bg-[#1A253D] text-[#94A3B8]'
                  }`}
                >
                  {customers.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <p className="mt-8 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[.15em] text-[#94A3B8]">
          Manage & API
        </p>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[#94A3B8] hover:bg-[#131B2E] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <Key className="size-[18px] text-[#10B981]" />
              Claude API Key
            </span>
            <span className="text-[10px] font-mono font-bold text-[#10B981]">
              {userApiKey ? 'Active' : 'Config'}
            </span>
          </button>
        </nav>

        {/* AI Insight Card */}
        <div className="mt-auto rounded-2xl border border-[#23304D] bg-[#131B2E] p-4 shadow-xl">
          <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[#10B981]/15 text-[#10B981]">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-white">AI Risk Engine Active</p>
          <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
            Evaluating {stats.flaggedCount} flagged accounts 7-14 days pre-billing.
          </p>
          <button
            onClick={simulateOneWeek}
            className="mt-3 text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1"
          >
            Run +1 Wk Simulation <ArrowUpRight className="size-3" />
          </button>
        </div>

        {/* User Badge */}
        <div className="mt-4 flex items-center gap-3 border-t border-[#23304D] pt-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#10B981] text-xs font-extrabold text-black">
            PP
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">PreventPay Admin</p>
            <p className="truncate text-xs text-[#94A3B8]">Hackathon Submission</p>
          </div>
          <Activity className="size-4 text-[#10B981] animate-pulse" />
        </div>
      </aside>

      {/* Main Section */}
      <section className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#23304D] bg-[#0B0F17]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#131B2E] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-[#94A3B8]">
                  Tuesday, September 1, 2026
                </span>
                <span className="rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-bold text-[#10B981] border border-[#10B981]/30">
                  Live System
                </span>
              </div>
              <h1 className="mt-0.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                PreventPay AI Control Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search account, email..."
                className="w-full rounded-xl border border-[#23304D] bg-[#131B2E] pl-9 pr-3 py-2 text-xs text-white placeholder-[#94A3B8] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            {/* Configure Key Button */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                userApiKey
                  ? 'border-[#10B981]/50 bg-[#10B981]/10 text-[#10B981]'
                  : 'border-[#23304D] bg-[#131B2E] text-[#94A3B8] hover:text-white'
              }`}
            >
              <Key className="size-3.5" />
              <span>{userApiKey ? 'Claude API Connected' : 'Configure API Key'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9 space-y-12">
          {/* Overview Section Target */}
          <div id="overview-section" className="space-y-6 scroll-mt-24">
            {/* Header Banner & Toolbar */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#10B981]">
                  <span className="size-2 rounded-full bg-[#10B981] animate-pulse" /> Live Telemetry Overview
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Predictive Revenue Recovery
                </h2>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  Predicting payment failures 7-14 days before billing with explainable AI reasoning.
                </p>
              </div>

              {/* Action Toolbar Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-2.5 text-xs font-extrabold text-[#10B981] shadow-sm hover:bg-[#10B981] hover:text-black transition-all"
                >
                  <UserPlus className="size-4" /> + Add Customer
                </button>

                {simulatedWeeks > 0 && (
                  <button
                    onClick={resetSimulation}
                    className="flex items-center gap-2 rounded-xl border border-[#23304D] bg-[#131B2E] px-3.5 py-2.5 text-xs font-semibold text-[#94A3B8] hover:text-white transition-all"
                  >
                    <RotateCcw className="size-3.5" /> Reset Simulation
                  </button>
                )}

                <button
                  onClick={simulateOneWeek}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-5 py-2.5 text-xs font-extrabold text-black shadow-lg shadow-[#10B981]/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Play className="size-4 fill-black" /> Simulate +1 Week
                  {simulatedWeeks > 0 && (
                    <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] text-black">
                      Wk {simulatedWeeks}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Simulation Log Toast */}
            {simulationLogs.length > 0 && (
              <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 p-3 text-xs text-[#10B981] flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-2 truncate">
                  <Sparkles className="size-4 shrink-0 animate-pulse" />
                  <span className="font-semibold truncate">{simulationLogs[0]}</span>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8] shrink-0 ml-2">
                  {simulationLogs.length} event(s) logged
                </span>
              </div>
            )}

            {/* 4 Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                label="Failures Prevented"
                value={`$${stats.failuresPrevented.toLocaleString()}`}
                change={`${stats.preventedCount} pre-dunning actions`}
                icon={ShieldCheck}
                accent="text-[#10B981]"
              />
              <Metric
                label="Predicted Revenue at Risk"
                value={`$${stats.revenueAtRisk.toLocaleString()}`}
                change={`${stats.flaggedCount} flagged accounts`}
                icon={DollarSign}
                accent="text-amber-400"
              />
              <Metric
                label="Recovery Rate"
                value={`${stats.recoveryRate}%`}
                change="+20.4% vs post-retry avg"
                icon={Zap}
                accent="text-blue-400"
              />
              <Metric
                label="Active Accounts"
                value={customers.length.toString()}
                change="Scanned pre-billing"
                icon={Users}
                accent="text-purple-400"
              />
            </div>

            {/* Trend Chart & Breakdown Section */}
            <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
              {/* Recharts Area Timeline */}
              <TrendChart simulatedWeeks={simulatedWeeks} />

              {/* Channel Recovery Breakdown Card */}
              <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-5 shadow-xl sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                        Recovery Interventions by Channel
                      </p>
                      <p className="mt-1 text-3xl font-extrabold text-white tracking-tight font-mono">
                        ${(stats.failuresPrevented + stats.recoveredRevenue).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                      <WalletCards className="size-5" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-6">
                    <div
                      className="relative flex size-32 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          'conic-gradient(#10B981 0 68%, #3B82F6 68% 86%, #F59E0B 86% 100%)',
                      }}
                    >
                      <div className="flex size-20 flex-col items-center justify-center rounded-full bg-[#131B2E]">
                        <span className="text-base font-extrabold text-white font-mono">
                          {stats.recoveryRate}%
                        </span>
                        <span className="text-[9px] text-[#94A3B8]">Safeguard</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 text-xs">
                      <Legend color="bg-[#10B981]" label="Card Updater Token" value="68%" />
                      <Legend color="bg-[#3B82F6]" label="Pre-Auth Backup" value="18%" />
                      <Legend color="bg-[#F59E0B]" label="VIP Concierge Alert" value="14%" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#0B0F17] p-3 text-xs text-[#94A3B8] border border-[#23304D]">
                  <Sparkles className="size-4 shrink-0 text-[#10B981]" />
                  <span>Pre-billing card update tokens achieve 68% direct conversion.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Table Section Target */}
          <div id="recovery-table-section" className="rounded-2xl border border-[#23304D] bg-[#131B2E] shadow-2xl overflow-hidden scroll-mt-24">
            {/* Table Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#23304D] p-5 sm:p-6 gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-white">Flagged Subscription Accounts (Recovery Table)</h3>
                  <span className="rounded-full bg-[#10B981]/10 px-2.5 py-0.5 text-xs font-bold text-[#10B981] border border-[#10B981]/30">
                    {customers.length} Accounts
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  Client-side transparent risk scoring algorithm (`scoreRisk`) + live Claude AI endpoints
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedRiskTier}
                  onChange={(e) => setSelectedRiskTier(e.target.value)}
                  className="rounded-xl border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                >
                  <option value="ALL">All Risk Tiers</option>
                  <option value="CRITICAL">Critical (&gt;70)</option>
                  <option value="HIGH">High (40-70)</option>
                  <option value="MODERATE">Moderate (20-40)</option>
                  <option value="LOW">Low (&lt;20)</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-xl border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Action Sent">Action Sent</option>
                  <option value="Prevented">Prevented</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F17]/80 text-[#94A3B8] font-semibold uppercase tracking-wider border-b border-[#23304D]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Customer & Plan</th>
                    <th className="py-3.5 px-4">Risk Level</th>
                    <th className="py-3.5 px-4 min-w-[240px]">AI Plain-Language Reason</th>
                    <th className="py-3.5 px-4 min-w-[220px]">Recommended Action</th>
                    <th className="py-3.5 px-4">Charge Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Technical Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23304D]/60 text-white font-medium">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                        No subscription accounts matched your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#1A253D]/50 transition-colors">
                        {/* Customer & Plan */}
                        <td className="py-4 px-4 sm:px-6">
                          <div>
                            <div className="font-bold text-white text-sm">{c.company}</div>
                            <div className="text-[11px] text-[#94A3B8]">
                              {c.name} • <span className="font-mono text-slate-300">{c.cardBrand} **{c.cardLast4}</span> (Exp {c.cardExpiryDate})
                            </div>
                            <div className="text-[10px] text-[#10B981] font-semibold mt-0.5">
                              {c.planName}
                            </div>
                          </div>
                        </td>

                        {/* Risk Badge */}
                        <td className="py-4 px-4">
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border ${c.scoreResult.badgeColor}`}
                            >
                              {c.scoreResult.tier} ({c.scoreResult.score}/100)
                            </span>
                            <div className="text-[10px] text-[#94A3B8] mt-1">
                              Next Charge: <span className="font-mono text-white">{c.nextChargeDate}</span>
                            </div>
                          </div>
                        </td>

                        {/* AI Reason */}
                        <td className="py-4 px-4">
                          <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
                            {c.customReason || c.scoreResult.summary}
                          </p>
                        </td>

                        {/* Recommended Action */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5">
                            <p className="text-xs text-[#10B981] font-medium leading-normal max-w-xs">
                              {c.recommendedAction || 'Send pre-dunning card update request.'}
                            </p>
                            {c.status === 'Flagged' && (
                              <button
                                onClick={() => handleTriggerAction(c.id)}
                                disabled={loadingRowId === c.id}
                                className="inline-flex items-center space-x-1 rounded-md bg-[#10B981]/15 px-2.5 py-1 text-[11px] font-bold text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-black transition-all"
                              >
                                <Send className="size-3" />
                                <span>{loadingRowId === c.id ? 'Sending Action...' : 'Trigger Action'}</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Charge Amount */}
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-sm text-white">
                            ${c.amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-[#94A3B8]">
                            Avg: ${c.historicalAvgAmount.toLocaleString()}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              c.status === 'Prevented'
                                ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                                : c.status === 'Recovered'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : c.status === 'Action Sent'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                : c.status === 'Lost'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        {/* Technical Inspection Buttons */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleInspectScore(c)}
                              title="View transparent risk formula score breakdown"
                              className="inline-flex items-center space-x-1 rounded-lg border border-[#23304D] bg-[#0B0F17] px-2.5 py-1.5 text-[11px] font-semibold text-[#94A3B8] hover:border-[#10B981] hover:text-white transition-all"
                            >
                              <Code2 className="size-3.5 text-[#10B981]" />
                              <span className="hidden lg:inline">Inspect Score</span>
                            </button>

                            <button
                              onClick={() => handleInspectClaudeApi(c)}
                              title="View Claude API Request Payload"
                              className="inline-flex items-center space-x-1 rounded-lg border border-[#23304D] bg-[#0B0F17] px-2.5 py-1.5 text-[11px] font-semibold text-[#94A3B8] hover:border-purple-400 hover:text-white transition-all"
                            >
                              <Terminal className="size-3.5 text-purple-400" />
                              <span className="hidden lg:inline">Claude API</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customers Section Target */}
          <div id="customers-section" className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between border-b border-[#23304D] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="size-5 text-[#10B981]" /> Customer Risk Roster & Signals
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Detailed breakdown of active subscription accounts scanned pre-billing
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#059669]"
              >
                <UserPlus className="size-4" /> Add Customer Record
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.slice(0, 6).map((cust) => (
                <div key={cust.id} className="rounded-xl border border-[#23304D] bg-[#0B0F17] p-4 space-y-2 hover:border-[#10B981]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{cust.company}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${cust.scoreResult.badgeColor}`}>
                      {cust.scoreResult.tier} ({cust.scoreResult.score})
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{cust.name} ({cust.email})</p>
                  <div className="text-xs text-slate-300 flex justify-between pt-1 border-t border-[#23304D]/60 font-mono">
                    <span>${cust.amount.toLocaleString()}/mo</span>
                    <span>Exp {cust.cardExpiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions & Activity Target */}
          <div id="transactions-section" className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between border-b border-[#23304D] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <CreditCard className="size-5 text-[#3B82F6]" /> Recent Recovery Event Activity
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Real-time transaction logs and automated dunning telemetry
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#23304D]">
              {customers.slice(0, 5).map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="size-8 rounded-full bg-[#1A253D] text-[#10B981] flex items-center justify-center font-bold font-mono">
                      0{idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white">{item.company}</p>
                      <p className="text-[#94A3B8]">{item.recommendedAction || 'Pre-billing card update sent'}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <p className="font-bold text-[#10B981]">+${item.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-[#94A3B8]">Charge: {item.nextChargeDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ScoreInspectorModal
        customer={activeCustomer}
        isOpen={isScoreInspectorOpen}
        onClose={() => setIsScoreInspectorOpen(false)}
        onRunAiExplain={generateAiExplanation}
      />

      <ClaudeApiInspectorModal
        customer={activeCustomer}
        isOpen={isClaudeApiInspectorOpen}
        onClose={() => setIsClaudeApiInspectorOpen(false)}
        userApiKey={userApiKey}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#23304D]">
              <div className="flex items-center space-x-2">
                <Sparkles className="size-5 text-[#10B981]" />
                <h3 className="text-lg font-bold text-white">Claude API Key Configuration</h3>
              </div>
              <button onClick={() => setIsApiKeyModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="mt-4 space-y-4">
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                PreventPay AI calls Anthropic's Claude API (`/api/explain` & `/api/recommend-action`). Enter your API key below for live AI calls or leave blank to use the built-in rule generator fallback.
              </p>

              <div>
                <label className="block text-xs font-medium text-white mb-1">
                  Anthropic API Key (`sk-ant-...`)
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-sm text-white placeholder-[#94A3B8] focus:border-[#10B981] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[#94A3B8] hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#10B981] px-4 py-2 text-xs font-bold text-black hover:bg-[#059669]"
                >
                  Save & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  change,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof DollarSign;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-5 shadow-xl transition-all hover:-translate-y-1 hover:border-[#10B981]/40">
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{label}</p>
        <div className={`flex size-9 items-center justify-center rounded-xl bg-[#1A253D] ${accent}`}>
          <Icon className="size-[18px]" />
        </div>
      </div>
      <p className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold text-[#10B981]">{change}</p>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${color}`} />
      <span className="whitespace-nowrap text-[#94A3B8]">{label}</span>
      <span className="font-bold text-white font-mono ml-auto">{value}</span>
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
