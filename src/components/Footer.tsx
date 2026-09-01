import React from 'react';
import { ShieldAlert, Github, Award, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#23304D] bg-[#0B0F17] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Track Details */}
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-black">
              <ShieldAlert className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white">PreventPay AI</span>
                <span className="rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 text-[10px] font-bold text-[#10B981]">
                  AI Revenue Recovery Track
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Predictive, Explainable Revenue Recovery Agent for Subscription Businesses.
              </p>
            </div>
          </div>

          {/* Hackathon Credentials & Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs text-[#94A3B8]">
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Built for Hackathon Submission</span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="#hero"
              className="flex items-center space-x-1 text-[#10B981] hover:underline font-semibold"
            >
              <span>Back to Top ↑</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#23304D]/40 text-center text-[11px] text-[#94A3B8]">
          <p>© {new Date().getFullYear()} PreventPay AI Team. All risk scores calculated dynamically client-side & via Express backend API.</p>
        </div>
      </div>
    </footer>
  );
};
