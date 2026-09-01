import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Anthropic client if key present
const getAnthropicClient = (userApiKey) => {
  const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'YOUR_CLAUDE_API_KEY') {
    return null;
  }
  return new Anthropic({ apiKey });
};

// Simple Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint: AI Explanation
app.post('/api/explain', async (req, res) => {
  const { customer, factors, apiKey } = req.body;

  if (!customer) {
    return res.status(400).json({ error: 'Customer payload required' });
  }

  const anthropic = getAnthropicClient(apiKey);

  if (anthropic) {
    try {
      const prompt = `You are PreventPay AI, an expert revenue recovery AI agent.
Analyze the following subscription payment risk factors for customer "${customer.name}" (${customer.company}):
- Plan Amount: $${customer.amount} (Avg: $${customer.historicalAvgAmount})
- Next Charge Date: ${customer.nextChargeDate}
- Card Expiry: ${customer.cardExpiryDate} (${customer.cardBrand} ending in ${customer.cardLast4})
- Has Backup Payment: ${customer.hasBackupPayment ? 'Yes' : 'No'}
- Failures in last 90 days: ${customer.failuresLast90Days}
- Matched Risk Signals: ${factors ? factors.map(f => f.description).join('; ') : 'General risk flags'}

Write a 1-2 sentence, plain-language, executive explanation of EXACTLY why this upcoming payment is at risk. Be direct, professional, and specific. Do not use generic filler text.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      });

      const explanation = response.content[0].text.trim();
      return res.json({ explanation, source: 'claude-api-live' });
    } catch (err) {
      console.warn('Claude API call failed, using intelligent rule fallback:', err.message);
    }
  }

  // High quality deterministic fallback generator
  const matchedList = factors ? factors.filter(f => f.matched) : [];
  let explanation = '';

  if (matchedList.length > 0) {
    const reasons = matchedList.map(f => f.description);
    explanation = `${customer.cardBrand} card ending in ${customer.cardLast4} is at high risk: ${reasons.join('. ')}.`;
  } else {
    explanation = `Upcoming payment of $${customer.amount} shows low risk profile with valid payment credentials on file.`;
  }

  return res.json({
    explanation,
    source: 'rule-engine-fallback',
    note: 'Set ANTHROPIC_API_KEY or provide key in API Inspector for live Claude API generation.'
  });
});

// Endpoint: AI Recommended Action
app.post('/api/recommend-action', async (req, res) => {
  const { customer, explanation, apiKey } = req.body;

  if (!customer) {
    return res.status(400).json({ error: 'Customer payload required' });
  }

  const anthropic = getAnthropicClient(apiKey);

  if (anthropic) {
    try {
      const prompt = `You are PreventPay AI, an intelligent revenue recovery agent.
Given this customer risk explanation: "${explanation || 'Expiring payment card with no backup method'}"
Customer: ${customer.name} (${customer.company}), Plan Amount: $${customer.amount}, Next Charge: ${customer.nextChargeDate}.

Recommend a concise 1-sentence proactive recovery action to prevent payment failure BEFORE billing day (e.g. interactive pre-dunning email with 1-click update token, SMS ping with Apple Pay link, or automated Visa Account Updater trigger). Be specific and action-oriented.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      });

      const action = response.content[0].text.trim();
      return res.json({ action, source: 'claude-api-live' });
    } catch (err) {
      console.warn('Claude API call failed, using rule fallback:', err.message);
    }
  }

  // High quality fallback
  let action = '';
  if (customer.cardExpiryDate && (customer.cardExpiryDate.startsWith('09') || customer.cardExpiryDate.startsWith('10'))) {
    action = `Trigger 1-click Card Update email & SMS link to ${customer.email} before ${customer.nextChargeDate}.`;
  } else if (!customer.hasBackupPayment) {
    action = `Send pre-billing notification prompting customer to register a secondary payment method for 5% loyalty discount.`;
  } else if (customer.failuresLast90Days >= 1) {
    action = `Queue smart retry schedule with soft pre-charge authorization check 24h prior to billing.`;
  } else {
    action = `Send standard pre-billing reminder with update portal link.`;
  }

  return res.json({ action, source: 'rule-engine-fallback' });
});

app.listen(PORT, () => {
  console.log(`PreventPay AI Backend Server running on http://localhost:${PORT}`);
});
