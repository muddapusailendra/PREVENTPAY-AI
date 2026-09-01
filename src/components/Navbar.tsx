import React, { useState } from 'react';
import { ShieldAlert, Key, Terminal, Activity, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { userApiKey, setUserApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen, stats } = useApp();
  const [keyInput, setKeyInput] = useState(userApiKey);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setUserApiKey(keyInput.trim());
    setIsApiKeyModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#23304D] bg-[#0B0F17]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] text-black shadow-lg shadow-[#10B981]/20">
              <ShieldAlert className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  PreventPay <span className="text-[#10B981]">AI</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-[#10B981]/10 px-2 py-0.5 text-xs font-semibold text-[#10B981] border border-[#10B981]/30">
                  <Activity className="mr-1 h-3 w-3 animate-pulse" /> Live Agent
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#94A3B8]">Predictive Revenue Safeguard</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#94A3B8]">
            <a href="#hero" className="hover:text-white transition-colors">Overview</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#dashboard" className="text-white font-semibold flex items-center gap-1.5 hover:text-[#10B981] transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              Live Dashboard
            </a>
            <a href="#why-different" className="hover:text-white transition-colors">Why PreventPay</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                userApiKey 
                  ? 'border-[#10B981]/50 bg-[#10B981]/10 text-[#10B981]' 
                  : 'border-[#23304D] bg-[#131B2E] text-[#94A3B8] hover:border-white/20 hover:text-white'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>{userApiKey ? 'Claude API Active' : 'Configure API Key'}</span>
            </button>

            <a
              href="#dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-xs font-bold text-black shadow-lg shadow-[#10B981]/25 hover:brightness-110 transition-all"
            >
              Demo Dashboard
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Claude API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#23304D]">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-[#10B981]" />
                <h3 className="text-lg font-bold text-white">Claude API Key Configuration</h3>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="mt-4 space-y-4">
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                PreventPay AI makes live network calls to Anthropic's Claude API (`/api/explain` & `/api/recommend-action`). 
                Enter your key below for live responses, or leave empty to use our built-in high-quality fallback engine.
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
    </>
  );
};
