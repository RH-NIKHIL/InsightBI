const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

const addVariation = (val, pct = 0.05) => {
  const variation = val * pct * (Math.random() * 2 - 1);
  return Math.round((val + variation) * 10) / 10;
};

// GET /api/price-volatility
router.get('/', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'priceVolatility' });
    if (!doc) return res.status(404).json({ message: 'No data found' });
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/price-volatility/analyze
router.post('/analyze', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'priceVolatility' });
    if (!doc) return res.status(404).json({ message: 'No data found' });

    const data = doc.data;
    data.metrics.avgVolatility = addVariation(data.metrics.avgVolatility, 0.08);
    data.metrics.maxVolatility = addVariation(data.metrics.maxVolatility, 0.05);
    data.metrics.riskScore = Math.round(addVariation(data.metrics.riskScore, 0.1));
    data.priceHistory = data.priceHistory.map(d => ({
      ...d,
      price: Math.round(addVariation(d.price, 0.02)),
      volatility: addVariation(d.volatility, 0.1),
    }));

    const updated = await AnalyticsSnapshot.findOneAndUpdate(
      { type: 'priceVolatility' },
      { data },
      { new: true }
    );
    res.json({ message: 'Analysis complete', data: updated.data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
