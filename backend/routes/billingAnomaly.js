const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { billingAnomaly, refreshBillingAnomaly } = require('../data/store');

// GET /api/billing-anomaly
router.get('/', auth, (req, res) => {
  res.json(billingAnomaly);
});

// POST /api/billing-anomaly/scan
router.post('/scan', auth, (req, res) => {
  refreshBillingAnomaly();
  res.json({ message: 'Scan complete', data: billingAnomaly });
});

module.exports = router;
