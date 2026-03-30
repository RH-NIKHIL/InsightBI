const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { Admin, Staff } = require('../models');
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

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      token,
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      }
    });
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

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const { name, email } = req.body;

    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      admin.email = email;
    }

    if (name) admin.name = name;

    await admin.save();

    res.json({
      message: 'Profile updated',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating password' });
  }
});

// POST /api/auth/create-staff - Admin creates staff account
router.post('/create-staff', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = await Staff.create({
      name,
      email,
      password: hashedPassword,
      role: 'staff',
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: 'Staff account created successfully',
      staff: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        createdAt: newStaff.createdAt,
        createdBy: newStaff.createdBy,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating staff account' });
  }
});

// GET /api/auth/staff-list - Admin gets all staff
router.get('/staff-list', auth, async (req, res) => {
  try {
    const staffList = await Staff.find().select('-password');

    res.json(staffList.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email,
      role: s.role,
      createdAt: s.createdAt,
      createdBy: s.createdBy,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching staff list' });
  }
});

// DELETE /api/auth/delete-staff/:id - Admin deletes staff account
router.delete('/delete-staff/:id', auth, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({ message: 'Staff account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting staff account' });
  }
});

module.exports = router;
