import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CustomerPaymentData, scoreRisk, ScoreResult, RiskTier } from '../services/scoreRisk';
import { INITIAL_MOCK_CUSTOMERS } from '../data/mockCustomers';

export interface CustomerWithScore extends CustomerPaymentData {
  scoreResult: ScoreResult;
  isAiLoading?: boolean;
}

export interface AppContextType {
  customers: CustomerWithScore[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRiskTier: string;
  setSelectedRiskTier: (tier: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: 'score' | 'amount' | 'date';
  setSortBy: (sort: 'score' | 'amount' | 'date') => void;
  
  // Inspection Modals
  activeCustomer: CustomerWithScore | null;
  setActiveCustomer: (c: CustomerWithScore | null) => void;
  isScoreInspectorOpen: boolean;
  setIsScoreInspectorOpen: (open: boolean) => void;
  isClaudeApiInspectorOpen: boolean;
  setIsClaudeApiInspectorOpen: (open: boolean) => void;
  
  // Claude API Key state
  userApiKey: string;
  setUserApiKey: (key: string) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;

  // Simulation Engine
  simulatedWeeks: number;
  simulationLogs: string[];
  simulateOneWeek: () => void;
  resetSimulation: () => void;
  addCustomer: (customerData: Omit<CustomerPaymentData, 'id' | 'status'>) => void;

  // AI Trigger actions
  generateAiExplanation: (customerId: string) => Promise<void>;
  generateAiAction: (customerId: string) => Promise<void>;

  // Calculated Stats
  stats: {
    revenueAtRisk: number;
    failuresPrevented: number;
    recoveredRevenue: number;
    recoveryRate: number;
    flaggedCount: number;
    preventedCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawCustomers, setRawCustomers] = useState<CustomerPaymentData[]>(INITIAL_MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskTier, setSelectedRiskTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'amount' | 'date'>('score');

  const [activeCustomer, setActiveCustomer] = useState<CustomerWithScore | null>(null);
  const [isScoreInspectorOpen, setIsScoreInspectorOpen] = useState(false);
  const [isClaudeApiInspectorOpen, setIsClaudeApiInspectorOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('preventpay_claude_key') || '');

  const [simulatedWeeks, setSimulatedWeeks] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('preventpay_claude_key', userApiKey);
  }, [userApiKey]);

  // Compute live scores for all customers
  const customersWithScores = useMemo(() => {
    return rawCustomers.map((cust) => {
      const scoreResult = scoreRisk(cust);
      return {
        ...cust,
        scoreResult,
      };
    });
  }, [rawCustomers]);

  // Filtered & Sorted Customer List
  const filteredCustomers = useMemo(() => {
    return customersWithScores
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTier =
          selectedRiskTier === 'ALL' || c.scoreResult.tier === selectedRiskTier;

        const matchesStatus =
          selectedStatus === 'ALL' || c.status === selectedStatus;

        return matchesSearch && matchesTier && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.scoreResult.score - a.scoreResult.score;
        if (sortBy === 'amount') return b.amount - a.amount;
        if (sortBy === 'date') return new Date(a.nextChargeDate).getTime() - new Date(b.nextChargeDate).getTime();
        return 0;
      });
  }, [customersWithScores, searchQuery, selectedRiskTier, selectedStatus, sortBy]);

  // Calculate live aggregate stats
  const stats = useMemo(() => {
    let atRisk = 0;
    let prevented = 0;
    let recovered = 0;
    let flaggedCount = 0;
    let preventedCount = 0;

    customersWithScores.forEach((c) => {
      if (c.status === 'Flagged' || c.status === 'Action Sent') {
        atRisk += c.amount;
        flaggedCount++;
      } else if (c.status === 'Prevented') {
        prevented += c.amount;
        preventedCount++;
      } else if (c.status === 'Recovered') {
        recovered += c.amount;
      }
    });

    const totalTarget = atRisk + prevented + recovered;
    const rate = totalTarget > 0 ? ((prevented + recovered) / totalTarget) * 100 : 88.4;

    return {
      revenueAtRisk: atRisk,
      failuresPrevented: prevented,
      recoveredRevenue: recovered,
      recoveryRate: parseFloat(rate.toFixed(1)),
      flaggedCount,
      preventedCount,
    };
  }, [customersWithScores]);

  // 1-Week State Simulation Engine
  const simulateOneWeek = () => {
    const nextWeek = simulatedWeeks + 1;
    const newLogs: string[] = [];

    setRawCustomers((prev) =>
      prev.map((c) => {
        // Advance charge date by 7 days
        const prevDate = new Date(c.nextChargeDate);
        prevDate.setDate(prevDate.getDate() + 7);
        const nextChargeDate = prevDate.toISOString().split('T')[0];

        // Evolving logic: Flagged accounts transition based on risk tier & intervention
        if (c.status === 'Flagged' || c.status === 'Action Sent') {
          const scoreObj = scoreRisk(c);

          // 70% of Flagged convert to Prevented if Action Sent or moderate risk
          if (c.status === 'Action Sent' || scoreObj.tier === 'MODERATE' || scoreObj.tier === 'HIGH') {
            const rand = Math.random();
            if (rand > 0.25) {
              newLogs.push(`Simulated Week ${nextWeek}: ${c.company} card updated via pre-dunning link. Prevented $${c.amount.toLocaleString()} loss.`);
              return {
                ...c,
                status: 'Prevented',
                hasBackupPayment: true,
                cardExpiryDate: '12/28', // Updated card
                nextChargeDate,
              };
            } else {
              newLogs.push(`Simulated Week ${nextWeek}: ${c.company} charge failed on first attempt but recovered via smart retry. Recovered $${c.amount.toLocaleString()}.`);
              return {
                ...c,
                status: 'Recovered',
                failuresLast90Days: c.failuresLast90Days + 1,
                nextChargeDate,
              };
            }
          } else if (scoreObj.tier === 'CRITICAL') {
            const rand = Math.random();
            if (rand > 0.40) {
              newLogs.push(`Simulated Week ${nextWeek}: ${c.company} updated card following urgent SMS. Prevented $${c.amount.toLocaleString()} loss.`);
              return {
                ...c,
                status: 'Prevented',
                hasBackupPayment: true,
                cardExpiryDate: '11/28',
                nextChargeDate,
              };
            } else {
              newLogs.push(`Simulated Week ${nextWeek}: ${c.company} payment failed. $${c.amount.toLocaleString()} churned.`);
              return {
                ...c,
                status: 'Lost',
                nextChargeDate,
              };
            }
          }
        } else if (c.status === 'Prevented') {
          // Keep prevented or refresh
          return {
            ...c,
            nextChargeDate,
          };
        }

        return { ...c, nextChargeDate };
      })
    );

    setSimulatedWeeks(nextWeek);
    if (newLogs.length > 0) {
      setSimulationLogs((prev) => [...newLogs, ...prev]);
    } else {
      setSimulationLogs((prev) => [`Simulated Week ${nextWeek}: Ran risk engine check across all accounts.`, ...prev]);
    }
  };

  const resetSimulation = () => {
    setRawCustomers(INITIAL_MOCK_CUSTOMERS);
    setSimulatedWeeks(0);
    setSimulationLogs([]);
  };

  const addCustomer = (newCustData: Omit<CustomerPaymentData, 'id' | 'status'>) => {
    const newCustomer: CustomerPaymentData = {
      ...newCustData,
      id: `cust_${Date.now()}`,
      status: 'Flagged',
    };

    setRawCustomers((prev) => [newCustomer, ...prev]);
    setSimulationLogs((prev) => [
      `Added new customer account "${newCustomer.company}" ($${newCustomer.amount.toLocaleString()}/mo). Risk score calculated dynamically.`,
      ...prev,
    ]);
  };

  // Live Backend AI Calls
  const generateAiExplanation = async (customerId: string) => {
    const cust = customersWithScores.find((c) => c.id === customerId);
    if (!cust) return;

    setRawCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, customReason: 'Generating explanation with Claude AI...' } : c))
    );

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: cust,
          factors: cust.scoreResult.factors,
          apiKey: userApiKey,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setRawCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? { ...c, customReason: data.explanation } : c))
        );
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  const generateAiAction = async (customerId: string) => {
    const cust = customersWithScores.find((c) => c.id === customerId);
    if (!cust) return;

    try {
      const res = await fetch('/api/recommend-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: cust,
          explanation: cust.customReason || cust.scoreResult.summary,
          apiKey: userApiKey,
        }),
      });

      const data = await res.json();
      if (data.action) {
        setRawCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId
              ? { ...c, recommendedAction: data.action, status: 'Action Sent' }
              : c
          )
        );
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        customers: filteredCustomers,
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
        addCustomer,
        generateAiExplanation,
        generateAiAction,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
