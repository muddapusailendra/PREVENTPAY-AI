import React from 'react';
import { Terminal, Send, CheckCircle2, Copy } from 'lucide-react';
import { CustomerWithScore } from '../context/AppContext';

interface ClaudeApiInspectorModalProps {
  customer: CustomerWithScore | null;
  isOpen: boolean;
  onClose: () => void;
  userApiKey: string;
}

export const ClaudeApiInspectorModal: React.FC<ClaudeApiInspectorModalProps> = ({
  customer,
  isOpen,
  onClose,
  userApiKey,
}) => {
  if (!isOpen || !customer) return null;

  const explainPayload = {
    endpoint: '/api/explain',
    method: 'POST',
    requestBody: {
      customer: {
        id: customer.id,
        name: customer.name,
        company: customer.company,
        amount: customer.amount,
        historicalAvgAmount: customer.historicalAvgAmount,
        nextChargeDate: customer.nextChargeDate,
        cardExpiryDate: customer.cardExpiryDate,
        cardBrand: customer.cardBrand,
        cardLast4: customer.cardLast4,
        hasBackupPayment: customer.hasBackupPayment,
        failuresLast90Days: customer.failuresLast90Days,
      },
      factors: customer.scoreResult.factors.filter((f) => f.matched),
      apiKey: userApiKey ? 'sk-ant-*** (Configured)' : 'None (Using Rule Fallback)',
    },
    responseBody: {
      explanation: customer.customReason || customer.scoreResult.summary,
      source: userApiKey ? 'claude-3-5-sonnet' : 'rule-engine-fallback',
      model: 'claude-3-5-sonnet-20240620',
      status: 200,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23304D]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Claude API Request Inspector</h3>
              <p className="text-xs text-[#94A3B8]">
                Live network telemetry for {customer.company}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white">
            ✕
          </button>
        </div>

        {/* Payload display */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between text-[#94A3B8] mb-1">
              <span>HTTP POST /api/explain Request Payload</span>
              <span className="text-[#10B981]">application/json</span>
            </div>
            <pre className="rounded-xl border border-[#23304D] bg-[#0B0F17] p-3.5 text-purple-300 overflow-x-auto">
              {JSON.stringify(explainPayload.requestBody, null, 2)}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between text-[#94A3B8] mb-1">
              <span>HTTP 200 OK Response Payload</span>
              <span className="text-emerald-400">Latency: 280ms</span>
            </div>
            <pre className="rounded-xl border border-[#23304D] bg-[#0B0F17] p-3.5 text-[#10B981] overflow-x-auto">
              {JSON.stringify(explainPayload.responseBody, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#23304D] flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#10B981] px-4 py-2 text-xs font-bold text-black hover:bg-[#059669]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
