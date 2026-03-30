const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { Staff } = require('../models');
const auth = require('../middleware/auth');

// POST /api/staff-auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const member = await Staff.findOne({ email });
    if (!member) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: member._id, email: member.email, role: 'staff' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        createdAt: member.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/staff-auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const member = await Staff.findById(req.user.id).select('-password');
    if (!member) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({
      id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
      createdAt: member.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

module.exports = router;
