import React from 'react';
import { ShieldAlert, Code2, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { CustomerWithScore } from '../context/AppContext';

interface ScoreInspectorModalProps {
  customer: CustomerWithScore | null;
  isOpen: boolean;
  onClose: () => void;
  onRunAiExplain: (id: string) => void;
}

export const ScoreInspectorModal: React.FC<ScoreInspectorModalProps> = ({
  customer,
  isOpen,
  onClose,
  onRunAiExplain,
}) => {
  if (!isOpen || !customer) return null;

  const { scoreResult } = customer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23304D]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{customer.company}</h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreResult.badgeColor}`}>
                  {scoreResult.tier} RISK ({scoreResult.score}/100)
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                {customer.name} ({customer.email}) • {customer.planName} (${customer.amount.toLocaleString()}/mo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white rounded-lg p-1.5 hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* Summary Callout */}
          <div className="rounded-xl border border-[#23304D] bg-[#0B0F17] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">AI Plain-Language Reasoning</span>
              <button
                onClick={() => onRunAiExplain(customer.id)}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-[#10B981] hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Re-generate via Claude API</span>
              </button>
            </div>
            <p className="text-sm text-white font-medium leading-relaxed">
              "{customer.customReason || scoreResult.summary}"
            </p>
          </div>

          {/* Transparent Scoring Formula Engine */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#10B981]" />
                Transparent Risk Scoring Rules (`scoreRisk`)
              </h4>
              <span className="text-xs text-[#94A3B8] font-mono">
                Computed Score: <strong className="text-white">{scoreResult.score}</strong> / 100
              </span>
            </div>

            <div className="space-y-3">
              {scoreResult.factors.map((factor, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3.5 transition-all ${
                    factor.matched
                      ? 'border-[#10B981]/40 bg-[#10B981]/5'
                      : 'border-[#23304D] bg-[#0B0F17]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {factor.matched ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-[#94A3B8] shrink-0" />
                      )}
                      <span className="text-sm font-bold text-white">{factor.ruleName}</span>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        factor.matched
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                          : 'bg-white/5 text-[#94A3B8]'
                      }`}
                    >
                      +{factor.pointsAdded} / {factor.maxPoints} pts
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-[#94A3B8] font-sans">{factor.description}</p>

                  <div className="mt-2 rounded bg-[#0B0F17] p-2 text-[11px] font-mono text-[#10B981] overflow-x-auto border border-[#23304D]">
                    <code>{factor.codeSnippet}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#23304D] flex justify-between items-center text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-[#10B981]" />
            Inspected by Hackathon Judges via client-side risk engine
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#23304D] px-4 py-2 font-bold text-white hover:bg-[#34466F]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
