const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

// Helper: add small random variation for "refresh" feel
const addVariation = (val, pct = 0.05) => {
  const variation = val * pct * (Math.random() * 2 - 1);
  return Math.round((val + variation) * 10) / 10;
};

// GET /api/customer-satisfaction
router.get('/', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'customerSatisfaction' });
    if (!doc) return res.status(404).json({ message: 'No data found' });
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/customer-satisfaction/analyze
router.post('/analyze', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'customerSatisfaction' });
    if (!doc) return res.status(404).json({ message: 'No data found' });

    const data = doc.data;
    data.stats.overallScore = addVariation(data.stats.overallScore, 0.02);
    data.stats.npsScore = Math.round(addVariation(data.stats.npsScore, 0.05));
    data.stats.atRisk = Math.round(addVariation(data.stats.atRisk, 0.08));
    data.satisfactionTrend = data.satisfactionTrend.map(d => ({
      ...d,
      score: Math.round(addVariation(d.score, 0.02)),
      predicted: Math.round(addVariation(d.predicted, 0.02)),
    }));

    const updated = await AnalyticsSnapshot.findOneAndUpdate(
      { type: 'customerSatisfaction' },
      { data },
      { new: true }
    );
    res.json({ message: 'Analysis complete', data: updated.data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
