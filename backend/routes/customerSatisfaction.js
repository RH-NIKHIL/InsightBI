const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { customerSatisfaction, refreshCustomerSatisfaction } = require('../data/store');

// GET /api/customer-satisfaction
router.get('/', auth, (req, res) => {
  res.json(customerSatisfaction);
});

// POST /api/customer-satisfaction/analyze
router.post('/analyze', auth, (req, res) => {
  refreshCustomerSatisfaction();
  res.json({ message: 'Analysis complete', data: customerSatisfaction });
});

module.exports = router;
