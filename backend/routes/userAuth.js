const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { users, getUserDashboardData } = require('../data/store');
const auth = require('../middleware/auth');

// POST /api/user-auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password: _, ...userData } = newUser;

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/user-auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password: _, ...userData } = user;

    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/user-auth/profile
router.get('/profile', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userData } = user;
  res.json(userData);
});

// GET /api/user-auth/dashboard
router.get('/dashboard', auth, (req, res) => {
  res.json(getUserDashboardData(req.user.id));
});

module.exports = router;
