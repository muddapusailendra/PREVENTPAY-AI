import React, { useState } from 'react';
import { UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    planName: 'Enterprise SaaS',
    amount: 1500,
    historicalAvgAmount: 1200,
    nextChargeDate: '2026-09-06',
    cardExpiryDate: '09/26',
    cardBrand: 'Visa',
    cardLast4: '4321',
    hasBackupPayment: false,
    failuresLast90Days: 1,
    daysSinceLastFailure: 14,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email) return;

    addCustomer({
      ...formData,
      amount: Number(formData.amount),
      historicalAvgAmount: Number(formData.historicalAvgAmount),
      failuresLast90Days: Number(formData.failuresLast90Days),
      daysSinceLastFailure: formData.daysSinceLastFailure ? Number(formData.daysSinceLastFailure) : null,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23304D]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add Custom Dataset Record</h3>
              <p className="text-xs text-[#94A3B8]">Input subscription data & risk signals to score live</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white">✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-white mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="Cyberdyne Systems"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Contact Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Connor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-white mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="sarah@cyberdyne.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Plan Name</label>
              <input
                type="text"
                placeholder="Enterprise Scale"
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-white mb-1">Charge Amount ($)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Historical Avg ($)</label>
              <input
                type="number"
                value={formData.historicalAvgAmount}
                onChange={(e) => setFormData({ ...formData, historicalAvgAmount: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Next Charge Date</label>
              <input
                type="date"
                value={formData.nextChargeDate}
                onChange={(e) => setFormData({ ...formData, nextChargeDate: e.target.value })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-white mb-1">Card Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="09/26"
                value={formData.cardExpiryDate}
                onChange={(e) => setFormData({ ...formData, cardExpiryDate: e.target.value })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Card Brand & Last4</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Visa"
                  value={formData.cardBrand}
                  onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
                  className="w-2/3 rounded-lg border border-[#23304D] bg-[#0B0F17] px-2 py-2 text-white focus:border-[#10B981] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="4242"
                  value={formData.cardLast4}
                  onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
                  className="w-1/3 rounded-lg border border-[#23304D] bg-[#0B0F17] px-2 py-2 text-white focus:border-[#10B981] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Backup Payment?</label>
              <select
                value={formData.hasBackupPayment ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, hasBackupPayment: e.target.value === 'yes' })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              >
                <option value="no">No Backup Card</option>
                <option value="yes">Backup Card Configured</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-white mb-1">Failures in Past 90 Days</label>
              <input
                type="number"
                min="0"
                value={formData.failuresLast90Days}
                onChange={(e) => setFormData({ ...formData, failuresLast90Days: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-white mb-1">Days Since Last Failure</label>
              <input
                type="number"
                placeholder="14"
                value={formData.daysSinceLastFailure}
                onChange={(e) => setFormData({ ...formData, daysSinceLastFailure: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#23304D] bg-[#0B0F17] px-3 py-2 text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-[#23304D]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs text-[#94A3B8] hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#10B981] px-5 py-2 text-xs font-bold text-black hover:bg-[#059669] flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Calculate Risk Score & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
