import { describe, it, expect } from 'vitest';
import { scoreRisk, CustomerPaymentData } from './scoreRisk';

describe('scoreRisk Algorithm Unit Tests', () => {
  it('case 1: High risk customer with card expiring in 4 days & no backup payment method', () => {
    const customer: CustomerPaymentData = {
      id: 'cust_001',
      name: 'Sarah Connor',
      email: 'sarah@cyberdyne.io',
      company: 'Cyberdyne Systems',
      planName: 'Enterprise Scale',
      amount: 2400,
      historicalAvgAmount: 2400,
      nextChargeDate: '2026-09-26', // Expiry is 2026-09-30 -> 4 days remaining (<= 7 days -> +40 pts)
      cardExpiryDate: '09/26',
      cardLast4: '4242',
      cardBrand: 'Visa',
      hasBackupPayment: false, // +15 pts
      failuresLast90Days: 0,
      daysSinceLastFailure: null,
      status: 'Flagged',
    };

    const result = scoreRisk(customer, '2026-09-01');

    // Score calculation: 40 (Expiry <= 7d) + 15 (No backup) = 55 -> HIGH tier
    expect(result.score).toBe(55);
    expect(result.tier).toBe('HIGH');
    expect(result.factors.find(f => f.ruleName === 'Card Expiration Signal')?.matched).toBe(true);
    expect(result.factors.find(f => f.ruleName === 'Redundancy Check')?.matched).toBe(true);
  });

  it('case 2: Critical risk customer with multiple failures, recent failure & amount variance', () => {
    const customer: CustomerPaymentData = {
      id: 'cust_002',
      name: 'Marcus Brody',
      email: 'mbrody@museum.edu',
      company: 'Brody Artifacts',
      planName: 'Pro Tier',
      amount: 1500,
      historicalAvgAmount: 1000, // 50% increase -> +15 pts
      nextChargeDate: '2026-09-26', // 4 days remaining -> +40 pts
      cardExpiryDate: '09/26',
      cardLast4: '8812',
      cardBrand: 'Mastercard',
      hasBackupPayment: false, // +15 pts
      failuresLast90Days: 2, // >= 2 -> +30 pts
      daysSinceLastFailure: 10, // < 15 days -> +20 pts
      status: 'Flagged',
    };

    const result = scoreRisk(customer, '2026-09-01');

    // Calculation: 40 + 15 + 15 + 30 + 20 = 120 -> clamped to 100 -> CRITICAL tier
    expect(result.score).toBe(100);
    expect(result.tier).toBe('CRITICAL');
  });

  it('case 3: Low risk loyal customer with valid card and backup payment', () => {
    const customer: CustomerPaymentData = {
      id: 'cust_003',
      name: 'Elena Rostova',
      email: 'elena@novatech.co',
      company: 'NovaTech Solutions',
      planName: 'Standard Monthly',
      amount: 499,
      historicalAvgAmount: 499,
      nextChargeDate: '2026-09-20',
      cardExpiryDate: '12/28', // Far expiration -> +0 pts
      cardLast4: '1109',
      cardBrand: 'Amex',
      hasBackupPayment: true, // Has backup -> +0 pts
      failuresLast90Days: 0,
      daysSinceLastFailure: null,
      status: 'Prevented',
    };

    const result = scoreRisk(customer, '2026-09-01');

    expect(result.score).toBe(0);
    expect(result.tier).toBe('LOW');
  });

  it('case 4: Moderate/High risk due to billing amount jump & 30-day card expiry window', () => {
    const customer: CustomerPaymentData = {
      id: 'cust_004',
      name: 'Jordan Belfort',
      email: 'jordan@stratton.com',
      company: 'Stratton Oakmont',
      planName: 'Growth Plan',
      amount: 3200,
      historicalAvgAmount: 2000, // 60% jump -> +15 pts
      nextChargeDate: '2026-09-01', // Card expires 09/30 -> 29 days remaining (<= 30 days -> +10 pts)
      cardExpiryDate: '09/26',
      cardLast4: '9901',
      cardBrand: 'Visa',
      hasBackupPayment: false, // +15 pts
      failuresLast90Days: 0,
      daysSinceLastFailure: null,
      status: 'Flagged',
    };

    const result = scoreRisk(customer, '2026-09-01');

    // Calculation: 15 (Amount) + 10 (Expiry <= 30d) + 15 (No backup) = 40 -> HIGH tier
    expect(result.score).toBe(40);
    expect(result.tier).toBe('HIGH');
  });
});
