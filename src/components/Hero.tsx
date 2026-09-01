import React from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { stats } = useApp();

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#10B981]/10 via-[#3B82F6]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Track Tag Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3.5 py-1 text-xs font-semibold text-[#10B981] mb-6 shadow-sm">
            <Zap className="h-3.5 w-3.5" />
            <span>AI Revenue Recovery Hackathon Project</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Stop losing revenue to failed payments <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#6EE7B7]">before they happen.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-[#94A3B8] font-normal leading-relaxed">
            PreventPay AI predicts upcoming subscription payment failures using card & behavior risk signals, explains the root cause in plain English, and executes automated recovery actions before the charge drops.
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-7 py-3.5 text-sm font-bold text-black shadow-xl shadow-[#10B981]/20 hover:scale-[1.02] transition-transform"
            >
              View Live Dashboard
              <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#23304D] bg-[#131B2E] px-7 py-3.5 text-sm font-semibold text-white hover:border-white/20 hover:bg-[#1A253D] transition-all"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Animated Stat Strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Stat Card 1 */}
          <div className="rounded-2xl border border-[#23304D] bg-[#131B2E]/80 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-[#10B981]/40 transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Revenue at Risk</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
              ${stats.revenueAtRisk.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-amber-400">
              <span>{stats.flaggedCount} flagged subscription accounts</span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="rounded-2xl border border-[#23304D] bg-[#131B2E]/80 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-[#10B981]/40 transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Failures Prevented</span>
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            </div>
            <div className="text-3xl font-extrabold text-[#10B981] tracking-tight font-mono">
              ${stats.failuresPrevented.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-[#10B981]">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              <span>{stats.preventedCount} pre-dunning actions succeeded</span>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="rounded-2xl border border-[#23304D] bg-[#131B2E]/80 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-[#10B981]/40 transition-all">
            <div className="flex items-center justify-between text-[#94A3B8] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Recovery Rate</span>
              <TrendingUp className="h-4 w-4 text-[#3B82F6]" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {stats.recoveryRate}%
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-emerald-400">
              <span>+14.2% higher vs post-failure retries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
