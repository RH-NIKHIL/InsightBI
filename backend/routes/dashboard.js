const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDashboardData } = require('../data/store');

// GET /api/dashboard
router.get('/', auth, (req, res) => {
  res.json(getDashboardData());
});

module.exports = router;
