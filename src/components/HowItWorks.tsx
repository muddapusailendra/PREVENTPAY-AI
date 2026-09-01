import React from 'react';
import { Search, BrainCircuit, Send, BarChart3 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Continuous Risk Scanning',
      description: 'AI monitors card expiration dates, historical payment failures, billing drift, and missing secondary payment methods 7-14 days prior to billing.',
      icon: Search,
      badge: 'Signal Detection',
    },
    {
      number: '02',
      title: 'Plain-Language AI Reasoning',
      description: 'Generates transparent, human-readable explanations using weighted risk rules and Claude AI so risk decisions are never a black box.',
      icon: BrainCircuit,
      badge: 'Explainable AI',
    },
    {
      number: '03',
      title: 'Pre-Failure Action Trigger',
      description: 'Automates 1-click card update tokens via SMS/email, pre-authorizes backup cards, and triggers card updater networks before charges drop.',
      icon: Send,
      badge: 'Proactive Recovery',
    },
    {
      number: '04',
      title: 'Real-Time Revenue Analytics',
      description: 'Tracks prevented revenue vs. recovered vs. lost charges on a live dashboard with stateful simulation capability for hackathon evaluation.',
      icon: BarChart3,
      badge: 'Live Dashboard',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 border-t border-[#23304D]/60 bg-[#0B0F17]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#10B981]">Architecture & Process</h2>
          <p className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            How PreventPay AI Works
          </p>
          <p className="mt-3 text-sm text-[#94A3B8]">
            Transforming reactive dunning into a predictive, automated revenue shield in 4 steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl hover:border-[#10B981]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold text-[#10B981] font-mono">{step.number}</span>
                    <span className="rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#10B981]">
                      {step.badge}
                    </span>
                  </div>

                  <div className="h-10 w-10 rounded-xl bg-[#23304D]/50 flex items-center justify-center text-white mb-4 group-hover:bg-[#10B981] group-hover:text-black transition-colors">
                    <IconComp className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
