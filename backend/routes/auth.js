const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { admins } = require('../data/store');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existing = admins.find(a => a.email === email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    admins.push(newAdmin);

    const token = jwt.sign({ id: newAdmin.id, email: newAdmin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password: _, ...userData } = newAdmin;

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = admins.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password: _, ...userData } = admin;

    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/profile
router.get('/profile', auth, (req, res) => {
  const admin = admins.find(a => a.id === req.user.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  const { password: _, ...userData } = admin;
  res.json(userData);
});

// PUT /api/auth/profile
router.put('/profile', auth, (req, res) => {
  const admin = admins.find(a => a.id === req.user.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  const { name, email } = req.body;
  if (name) admin.name = name;
  if (email) {
    const existing = admins.find(a => a.email === email && a.id !== admin.id);
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    admin.email = email;
  }

  const { password: _, ...userData } = admin;
  res.json({ message: 'Profile updated', user: userData });
});

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
  const admin = admins.find(a => a.id === req.user.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

  admin.password = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
