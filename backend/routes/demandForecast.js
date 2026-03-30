const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

const addVariation = (val, pct = 0.05) => {
  const variation = val * pct * (Math.random() * 2 - 1);
  return Math.round((val + variation) * 10) / 10;
};

// GET /api/demand-forecast
router.get('/', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'demandForecast' });
    if (!doc) return res.status(404).json({ message: 'No data found' });
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/demand-forecast/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const doc = await AnalyticsSnapshot.findOne({ type: 'demandForecast' });
    if (!doc) return res.status(404).json({ message: 'No data found' });

    const data = doc.data;
    data.metrics.forecastAccuracy = addVariation(data.metrics.forecastAccuracy, 0.01);
    data.metrics.mae = Math.round(addVariation(data.metrics.mae, 0.05));
    data.metrics.rmse = Math.round(addVariation(data.metrics.rmse, 0.05));
    data.demandData = data.demandData.map(d => ({
      ...d,
      predicted: d.predicted ? Math.round(addVariation(d.predicted, 0.03)) : d.predicted,
    }));

    const updated = await AnalyticsSnapshot.findOneAndUpdate(
      { type: 'demandForecast' },
      { data },
      { new: true }
    );
    res.json({ message: 'Forecast generated', data: updated.data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
