const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const [cs, df, pv, ba] = await Promise.all([
      AnalyticsSnapshot.findOne({ type: 'customerSatisfaction' }),
      AnalyticsSnapshot.findOne({ type: 'demandForecast' }),
      AnalyticsSnapshot.findOne({ type: 'priceVolatility' }),
      AnalyticsSnapshot.findOne({ type: 'billingAnomaly' }),
    ]);

    const csData = cs?.data || {};
    const dfData = df?.data || {};
    const pvData = pv?.data || {};
    const baData = ba?.data || {};

    const dashboardData = {
      modules: [
        {
          title: 'Customer Satisfaction',
          value: `${csData.stats?.overallScore ?? '--'}%`,
          change: '+2.3%',
          trend: 'up',
          description: 'Average satisfaction score',
        },
        {
          title: 'Demand Forecast',
          value: '12,450',
          change: '+15%',
          trend: 'up',
          description: 'Predicted units next month',
        },
        {
          title: 'Price Volatility',
          value: `${pvData.metrics?.avgVolatility ?? '--'}%`,
          change: '-1.8%',
          trend: 'down',
          description: 'Current volatility index',
        },
        {
          title: 'Billing Anomaly',
          value: String(baData.metrics?.resolvedToday ?? '--'),
          change: '+5',
          trend: 'up',
          description: 'Anomalies detected today',
        },
      ],
      demandData: (dfData.demandData || [])
        .slice(0, 6)
        .map(d => ({ name: d.month, value: d.actual, predicted: d.predicted })),
      satisfactionData: (csData.sentimentData || []).map(d => ({
        name: d.name,
        value: d.value,
        color: d.color,
      })),
      priceData: (pvData.priceHistory || [])
        .slice(0, 6)
        .map(d => ({ name: d.date.split(' ')[0], price: d.price, volatility: d.volatility })),
      billingData: [
        { name: 'Normal', value: 950 },
        { name: 'Anomaly', value: baData.metrics?.totalAnomalies ?? 50 },
      ],
      recentAlerts: [
        { type: 'warning', message: 'High price volatility detected in Category A', time: '2 min ago' },
        { type: 'success', message: 'Demand forecast updated successfully', time: '15 min ago' },
        { type: 'error', message: 'Billing anomaly flagged for review', time: '1 hour ago' },
        { type: 'info', message: 'Customer satisfaction model retrained', time: '3 hours ago' },
      ],
    };

    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
