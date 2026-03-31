const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

const addVariation = (val, pct = 0.05) => {
  const variation = val * pct * (Math.random() * 2 - 1);
  return Math.round((val + variation) * 10) / 10;
};

const anomalyTypesList = ['Duplicate Charge', 'Missing Payment', 'Incorrect Amount', 'Late Billing', 'Refund Error', 'Tax Mismatch'];
const severityLevels = ['low', 'medium', 'high', 'critical'];
const statusTypes = ['pending', 'investigating', 'resolved'];
const customerSamples = ['Acme Corp', 'Tech Solutions', 'Global Inc', 'StartUp LLC', 'Enterprise Co', 'Digital Corp', 'Innovation Labs', 'CloudBase Inc', 'FinServe Co', 'DataStream Ltd'];

// GET /api/billing-anomaly
router.get('/', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'billingAnomaly' });
    if (!doc) return res.status(404).json({ message: 'No data found' });
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/billing-anomaly/scan
router.post('/scan', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'billingAnomaly' });
    if (!doc) return res.status(404).json({ message: 'No data found' });

    const data = doc.data;
    data.metrics.totalAnomalies = Math.round(addVariation(data.metrics.totalAnomalies, 0.05));
    data.metrics.resolvedToday = Math.round(addVariation(data.metrics.resolvedToday, 0.1));
    data.metrics.revenueImpact = Math.round(addVariation(data.metrics.revenueImpact, 0.05));
    data.anomalyTrend = data.anomalyTrend.map(d => {
      const detected = Math.max(1, Math.round(addVariation(d.detected, 0.15)));
      return {
        ...d,
        detected,
        resolved: Math.min(detected, Math.max(1, Math.round(addVariation(d.resolved, 0.15)))),
      };
    });

    // Generate fresh recent anomalies
    const generateRecentAnomalies = () => {
      const count = Math.random() > 0.5 ? 5 : 6;
      const anomalies = [];
      for (let i = 0; i < count; i++) {
        const id = `ANM-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`;
        const customer = customerSamples[Math.floor(Math.random() * customerSamples.length)];
        const type = anomalyTypesList[Math.floor(Math.random() * anomalyTypesList.length)];
        const amount = Math.round(Math.random() * 5000 * 100) / 100;
        const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];
        const daysAgo = Math.floor(Math.random() * 7);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateStr = date.toISOString().split('T')[0];

        anomalies.push({ id, customer, type, amount, severity, status, date: dateStr });
      }
      return anomalies;
    };

    data.recentAnomalies = generateRecentAnomalies();

    const updated = await AnalyticsSnapshot.findOneAndUpdate(
      { type: 'billingAnomaly' },
      { data },
      { new: true }
    );
    res.json({ message: 'Scan complete', data: updated.data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
