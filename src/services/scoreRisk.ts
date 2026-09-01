export interface CustomerPaymentData {
  id: string;
  name: string;
  email: string;
  company: string;
  planName: string;
  amount: number;
  historicalAvgAmount: number;
  nextChargeDate: string; // ISO date string e.g. "2026-09-06"
  cardExpiryDate: string; // MM/YY format e.g. "09/26"
  cardLast4: string;
  cardBrand: string;
  hasBackupPayment: boolean;
  failuresLast90Days: number;
  daysSinceLastFailure?: number | null; // e.g. 12, or null if no failures
  status: 'Flagged' | 'Action Sent' | 'Prevented' | 'Recovered' | 'Lost';
  customReason?: string;
  recommendedAction?: string;
}

export interface ScoreFactor {
  ruleName: string;
  pointsAdded: number;
  maxPoints: number;
  description: string;
  matched: boolean;
  codeSnippet: string;
}

export type RiskTier = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface ScoreResult {
  score: number; // 0 - 100
  tier: RiskTier;
  badgeColor: string;
  badgeBg: string;
  factors: ScoreFactor[];
  summary: string;
}

/**
 * Calculates a deterministic risk score (0-100) for a customer's upcoming payment.
 * Explicit weighted rules:
 * 1. Card Expiry: Within 7 days (+40), 14 days (+25), 30 days (+10)
 * 2. Failure History: 2+ failures in last 90 days (+30), 1 failure (+15)
 * 3. Failure Recency: Days since last failure < 15 days (+20)
 * 4. Billing Drift / Amount Variance: Amount > 20% above historical avg (+15)
 * 5. Payment Redundancy: No backup payment method on file (+15)
 */
export function scoreRisk(customer: CustomerPaymentData, currentDateStr?: string): ScoreResult {
  const currentDate = currentDateStr ? new Date(currentDateStr) : new Date("2026-09-01");
  const factors: ScoreFactor[] = [];
  let totalScore = 0;

  // Rule 1: Card Expiry Date Evaluation
  const [expMonth, expYearShort] = customer.cardExpiryDate.split('/').map(n => parseInt(n, 10));
  const fullExpYear = 2000 + expYearShort;
  // End of expiry month
  const expiryDate = new Date(fullExpYear, expMonth, 0); 
  const nextCharge = new Date(customer.nextChargeDate);
  
  const diffTime = expiryDate.getTime() - nextCharge.getTime();
  const daysUntilExp = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let expiryPoints = 0;
  let expiryDesc = "";
  if (daysUntilExp <= 7 && daysUntilExp >= -30) {
    expiryPoints = 40;
    expiryDesc = `Card expires in ${daysUntilExp <= 0 ? '0' : daysUntilExp} days (before or at charge date)`;
  } else if (daysUntilExp <= 14) {
    expiryPoints = 25;
    expiryDesc = `Card expires within 14 days of charge date`;
  } else if (daysUntilExp <= 30) {
    expiryPoints = 10;
    expiryDesc = `Card expires within 30 days`;
  } else {
    expiryDesc = `Card is valid for ${daysUntilExp} days`;
  }

  factors.push({
    ruleName: 'Card Expiration Signal',
    pointsAdded: expiryPoints,
    maxPoints: 40,
    description: expiryDesc,
    matched: expiryPoints > 0,
    codeSnippet: `if (daysUntilExp <= 7) score += 40; else if (daysUntilExp <= 14) score += 25;`
  });
  totalScore += expiryPoints;

  // Rule 2: Failure History (Last 90 Days)
  let failHistoryPoints = 0;
  let failHistoryDesc = "";
  if (customer.failuresLast90Days >= 2) {
    failHistoryPoints = 30;
    failHistoryDesc = `${customer.failuresLast90Days} payment failures recorded in the past 90 days`;
  } else if (customer.failuresLast90Days === 1) {
    failHistoryPoints = 15;
    failHistoryDesc = `1 payment failure recorded in the past 90 days`;
  } else {
    failHistoryDesc = `Clean payment history in past 90 days`;
  }

  factors.push({
    ruleName: '90-Day Failure Velocity',
    pointsAdded: failHistoryPoints,
    maxPoints: 30,
    description: failHistoryDesc,
    matched: failHistoryPoints > 0,
    codeSnippet: `if (failuresLast90Days >= 2) score += 30; else if (failures == 1) score += 15;`
  });
  totalScore += failHistoryPoints;

  // Rule 3: Failure Recency
  let recencyPoints = 0;
  let recencyDesc = "";
  if (customer.daysSinceLastFailure !== undefined && customer.daysSinceLastFailure !== null && customer.daysSinceLastFailure < 15) {
    recencyPoints = 20;
    recencyDesc = `Recent failure occurred ${customer.daysSinceLastFailure} days ago (< 15 days threshold)`;
  } else {
    recencyDesc = customer.daysSinceLastFailure ? `Last failure was ${customer.daysSinceLastFailure} days ago` : `No recent payment failures`;
  }

  factors.push({
    ruleName: 'Recent Failure Recency',
    pointsAdded: recencyPoints,
    maxPoints: 20,
    description: recencyDesc,
    matched: recencyPoints > 0,
    codeSnippet: `if (daysSinceLastFailure < 15) score += 20;`
  });
  totalScore += recencyPoints;

  // Rule 4: Payment Amount Variance
  let amountPoints = 0;
  let amountDesc = "";
  const varianceRatio = (customer.amount - customer.historicalAvgAmount) / (customer.historicalAvgAmount || 1);
  if (varianceRatio >= 0.20) {
    amountPoints = 15;
    const pct = Math.round(varianceRatio * 100);
    amountDesc = `Upcoming charge ($${customer.amount.toLocaleString()}) is ${pct}% above historical avg ($${customer.historicalAvgAmount.toLocaleString()})`;
  } else {
    amountDesc = `Charge amount is inline with historical average ($${customer.historicalAvgAmount.toLocaleString()})`;
  }

  factors.push({
    ruleName: 'Billing Amount Variance',
    pointsAdded: amountPoints,
    maxPoints: 15,
    description: amountDesc,
    matched: amountPoints > 0,
    codeSnippet: `if ((amount - avgAmount)/avgAmount >= 0.20) score += 15;`
  });
  totalScore += amountPoints;

  // Rule 5: Payment Method Redundancy
  let backupPoints = 0;
  let backupDesc = "";
  if (!customer.hasBackupPayment) {
    backupPoints = 15;
    backupDesc = `No secondary / backup payment method on file`;
  } else {
    backupDesc = `Secondary backup payment method is configured`;
  }

  factors.push({
    ruleName: 'Redundancy Check',
    pointsAdded: backupPoints,
    maxPoints: 15,
    description: backupDesc,
    matched: backupPoints > 0,
    codeSnippet: `if (!hasBackupPayment) score += 15;`
  });
  totalScore += backupPoints;

  // Clamp final score to [0, 100]
  const finalScore = Math.min(100, Math.max(0, totalScore));

  // Determine Risk Tier
  let tier: RiskTier = 'LOW';
  let badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let badgeBg = '#10B981';

  if (finalScore >= 70) {
    tier = 'CRITICAL';
    badgeColor = 'text-red-400 border-red-500/30 bg-red-500/10';
    badgeBg = '#EF4444';
  } else if (finalScore >= 40) {
    tier = 'HIGH';
    badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    badgeBg = '#F59E0B';
  } else if (finalScore >= 20) {
    tier = 'MODERATE';
    badgeColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    badgeBg = '#3B82F6';
  }

  const matchedFactors = factors.filter(f => f.matched);
  const summary = matchedFactors.length > 0 
    ? matchedFactors.map(f => f.description).join('. ')
    : 'All risk signals within normal parameters.';

  return {
    score: finalScore,
    tier,
    badgeColor,
    badgeBg,
    factors,
    summary
  };
}
