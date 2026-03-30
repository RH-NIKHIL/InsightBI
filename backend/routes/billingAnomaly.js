const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

const addVariation = (val, pct = 0.05) => {
  const variation = val * pct * (Math.random() * 2 - 1);
  return Math.round((val + variation) * 10) / 10;
};

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
