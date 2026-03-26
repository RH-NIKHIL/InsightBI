const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { demandForecast, refreshDemandForecast } = require('../data/store');

// GET /api/demand-forecast
router.get('/', auth, (req, res) => {
  res.json(demandForecast);
});

// POST /api/demand-forecast/generate
router.post('/generate', auth, (req, res) => {
  refreshDemandForecast();
  res.json({ message: 'Forecast generated', data: demandForecast });
});

module.exports = router;
