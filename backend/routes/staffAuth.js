const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { staff } = require('../data/store');
const auth = require('../middleware/auth');

// POST /api/staff-auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const member = staff.find(s => s.email === email);
    if (!member) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: member.id, email: member.email, role: 'staff' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password: _, ...memberData } = member;

    res.json({ token, user: memberData });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/staff-auth/profile
router.get('/profile', auth, (req, res) => {
  const member = staff.find(s => s.id === req.user.id);
  if (!member) return res.status(404).json({ error: 'Staff not found' });
  const { password: _, ...memberData } = member;
  res.json(memberData);
});

module.exports = router;
