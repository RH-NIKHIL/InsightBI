const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { priceVolatility, refreshPriceVolatility } = require('../data/store');

// GET /api/price-volatility
router.get('/', auth, (req, res) => {
  res.json(priceVolatility);
});

// POST /api/price-volatility/analyze
router.post('/analyze', auth, (req, res) => {
  refreshPriceVolatility();
  res.json({ message: 'Analysis complete', data: priceVolatility });
});

module.exports = router;
