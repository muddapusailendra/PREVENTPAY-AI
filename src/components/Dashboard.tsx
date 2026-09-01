import React, { useState } from 'react';
import {
  Search,
  Filter,
  Play,
  RotateCcw,
  ShieldAlert,
  Code2,
  Terminal,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { useApp, CustomerWithScore } from '../context/AppContext';
import { ScoreInspectorModal } from './ScoreInspectorModal';
import { ClaudeApiInspectorModal } from './ClaudeApiInspectorModal';
import { AddCustomerModal } from './AddCustomerModal';
import { TrendChart } from './TrendChart';

export const Dashboard: React.FC = () => {
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
    simulatedWeeks,
    simulationLogs,
    simulateOneWeek,
    resetSimulation,
    generateAiExplanation,
    generateAiAction,
    stats,
  } = useApp();

  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    <section id="dashboard" className="py-12 border-t border-[#23304D]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Title & Simulator Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Live Recovery Control Center
              </h2>
              <span className="rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-0.5 text-xs font-semibold text-[#10B981]">
                Real-Time Risk Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Active account risk telemetry & automated pre-billing interventions.
            </p>
          </div>

          {/* Action Simulator Toolbar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 px-3.5 py-2.5 text-xs font-bold text-[#10B981] hover:bg-[#10B981] hover:text-black transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Add Customer</span>
            </button>

            {simulatedWeeks > 0 && (
              <button
                onClick={resetSimulation}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-[#23304D] bg-[#131B2E] px-3.5 py-2.5 text-xs font-semibold text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Data</span>
              </button>
            )}

            <button
              onClick={simulateOneWeek}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-5 py-2.5 text-xs font-extrabold text-black shadow-lg shadow-[#10B981]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4 fill-black" />
              <span>Simulate +1 Week</span>
              {simulatedWeeks > 0 && (
                <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px] text-black">
                  Week {simulatedWeeks}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Simulation Toast Logs */}
        {simulationLogs.length > 0 && (
          <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 p-3 text-xs text-[#10B981] flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2 overflow-hidden">
              <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
              <span className="font-semibold truncate">{simulationLogs[0]}</span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] shrink-0 ml-2">
              {simulationLogs.length} event(s) logged
            </span>
          </div>
        )}

        {/* Top 3 Stat Cards with Trend Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Predicted Revenue at Risk</span>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                Pre-Billing
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              ${stats.revenueAtRisk.toLocaleString()}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">{stats.flaggedCount} subscription accounts flagged</span>
              <span className="text-amber-400 font-semibold flex items-center">
                High Priority
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Failures Prevented</span>
              <span className="rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-bold text-[#10B981] border border-[#10B981]/20">
                Safeguarded
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#10B981] font-mono tracking-tight">
              ${stats.failuresPrevented.toLocaleString()}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">{stats.preventedCount} pre-dunning actions succeeded</span>
              <span className="text-[#10B981] font-semibold flex items-center">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Active Shield
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Recovery Rate</span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                Efficiency
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {stats.recoveryRate}%
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">vs 68% industry dunning retry avg</span>
              <span className="text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> +20.4% Lift
              </span>
            </div>
          </div>
        </div>

        {/* Trend Visualization Section */}
        <TrendChart simulatedWeeks={simulatedWeeks} />

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, company, or email..."
              className="w-full rounded-xl border border-[#23304D] bg-[#0B0F17] pl-10 pr-4 py-2 text-xs text-white placeholder-[#94A3B8] focus:border-[#10B981] focus:outline-none"
            />
          </div>

          {/* Filters & Sorting Group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Risk Tier Filter */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-[#94A3B8] font-medium hidden sm:inline">Tier:</span>
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
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-[#94A3B8] font-medium hidden sm:inline">Status:</span>
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

            {/* Sort Order */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-[#94A3B8] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-xs text-white focus:border-[#10B981] focus:outline-none"
              >
                <option value="score">Highest Risk Score</option>
                <option value="amount">Largest Revenue Amount</option>
                <option value="date">Next Charge Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flagged Accounts Table */}
        <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#23304D] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">Flagged Subscription Accounts</h3>
              <span className="rounded-full bg-[#23304D] px-2.5 py-0.5 text-xs font-semibold text-[#94A3B8]">
                {customers.length} accounts
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] hidden sm:block">
              Click <code className="text-[#10B981]">Inspect Score</code> to review deterministic formula weights
            </p>
          </div>

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
                      No customer accounts matched your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#1A253D]/50 transition-colors group"
                    >
                      {/* Customer & Plan */}
                      <td className="py-4 px-4 sm:px-6">
                        <div>
                          <div className="font-bold text-white text-sm">{c.company}</div>
                          <div className="text-[11px] text-[#94A3B8] font-sans">
                            {c.name} • <span className="font-mono text-slate-400">{c.cardBrand} **{c.cardLast4}</span> (Exp {c.cardExpiryDate})
                          </div>
                          <div className="text-[10px] text-[#10B981] font-semibold mt-0.5">
                            {c.planName}
                          </div>
                        </div>
                      </td>

                      {/* Risk Level Badge */}
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
                              <Send className="h-3 w-3" />
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
                            <Code2 className="h-3.5 w-3.5 text-[#10B981]" />
                            <span className="hidden lg:inline">Inspect Score</span>
                          </button>

                          <button
                            onClick={() => handleInspectClaudeApi(c)}
                            title="View Claude API Request Payload"
                            className="inline-flex items-center space-x-1 rounded-lg border border-[#23304D] bg-[#0B0F17] px-2.5 py-1.5 text-[11px] font-semibold text-[#94A3B8] hover:border-purple-400 hover:text-white transition-all"
                          >
                            <Terminal className="h-3.5 w-3.5 text-purple-400" />
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
      </div>

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
    </section>
  );
};
