import React from 'react';
import { XCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const WhyDifferent: React.FC = () => {
  const comparisons = [
    {
      feature: 'Execution Timing',
      traditional: 'Reactive — triggers retry sequences only AFTER payment fails',
      preventPay: 'Predictive — identifies risk 7-14 days BEFORE billing day',
    },
    {
      feature: 'AI Transparency',
      traditional: 'Black-box automated retries with zero explainability for finance teams',
      preventPay: 'Explainable AI — clear weighted rules & plain English reasons for every score',
    },
    {
      feature: 'Customer Action',
      traditional: 'Generic dunning emails demanding card updates post-decline',
      preventPay: 'Personalized recovery — 1-click update tokens, Apple Pay links, & card updater triggers',
    },
    {
      feature: 'Revenue Impact',
      traditional: '60-68% recovery rate; high customer churn from failed authorization friction',
      preventPay: '88.4% revenue safeguard rate; friction eliminated before charge attempt',
    },
    {
      feature: 'Developer Inspection',
      traditional: 'Hardcoded proprietary logic with no inspectable formula',
      preventPay: 'Open scoreRisk algorithm with full unit test suite & live API telemetry',
    },
  ];

  return (
    <section id="why-different" className="py-16 border-t border-[#23304D]/60 bg-[#0B0F17]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#10B981]">Comparative Architecture</h2>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Why PreventPay AI is Different
          </p>
          <p className="mt-3 text-sm text-[#94A3B8]">
            Comparing legacy dunning tools to our predictive, explainable revenue agent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Dunning Tools */}
          <div className="rounded-2xl border border-red-500/20 bg-[#131B2E]/60 p-6 shadow-xl relative">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#23304D]">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Traditional Dunning Tools</h3>
                <p className="text-xs text-red-400 font-medium">Reactive Post-Failure Retries</p>
              </div>
            </div>

            <div className="space-y-6">
              {comparisons.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-xs font-bold uppercase text-[#94A3B8]">{c.feature}</span>
                  <p className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    {c.traditional}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PreventPay AI */}
          <div className="rounded-2xl border border-[#10B981]/40 bg-[#131B2E] p-6 shadow-2xl relative overflow-hidden ring-1 ring-[#10B981]/30">
            <div className="absolute top-0 right-0 bg-[#10B981] text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
              Hackathon Paradigm
            </div>

            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#23304D]">
              <div className="h-10 w-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  PreventPay AI <Sparkles className="h-4 w-4 text-[#10B981]" />
                </h3>
                <p className="text-xs text-[#10B981] font-medium">Predictive Pre-Billing Safeguard</p>
              </div>
            </div>

            <div className="space-y-6">
              {comparisons.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-xs font-bold uppercase text-[#10B981]">{c.feature}</span>
                  <p className="text-xs text-white font-medium flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                    {c.preventPay}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
