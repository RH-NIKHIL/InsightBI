const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { products, bills, feedbacks, users } = require('../data/store');

// GET /api/billing/products — get product catalog
router.get('/products', auth, (req, res) => {
  res.json(products);
});

// POST /api/billing/create — create a bill + auto-create user
router.post('/create', auth, async (req, res) => {
  try {
    const { items, customer, feedback } = req.body;

    // Validate
    if (!items || !items.length) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ error: 'Customer name, email, and phone are required' });
    }
    if (!customer.phone || customer.phone.length < 6) {
      return res.status(400).json({ error: 'Phone number must be at least 6 digits' });
    }

    // Calculate totals
    const billItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        subtotal: Math.round(product.price * item.quantity * 100) / 100,
      };
    });

    const subtotal = billItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
    const total = Math.round((subtotal + tax) * 100) / 100;

    // Create bill
    const billId = `INV-${Date.now().toString(36).toUpperCase()}`;
    const bill = {
      id: billId,
      staffId: req.user.id,
      staffName: req.user.email,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      items: billItems,
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };
    bills.push(bill);

    // Save feedback if provided
    if (feedback && (feedback.rating || feedback.comment)) {
      feedbacks.push({
        id: `FB-${Date.now()}`,
        billId,
        customerName: customer.name,
        customerEmail: customer.email,
        rating: feedback.rating || 0,
        comment: feedback.comment || '',
        createdAt: new Date().toISOString(),
      });
    }

    // Auto-create user account (password = last 6 digits of phone)
    const existingUser = users.find(u => u.email === customer.email);
    const userPassword = customer.phone.slice(-6);
    let userCredentials = null;

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const newUser = {
        id: `u-${Date.now()}`,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      userCredentials = { email: customer.email, password: userPassword };
    }

    res.status(201).json({
      message: 'Bill created successfully',
      bill,
      userCreated: !existingUser,
      userCredentials,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error creating bill' });
  }
});

// GET /api/billing/history — get bill history
router.get('/history', auth, (req, res) => {
  const staffBills = bills.filter(b => b.staffId === req.user.id);
  res.json(staffBills.reverse());
});

module.exports = router;
