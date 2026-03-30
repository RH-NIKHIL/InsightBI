const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Bill, Feedback, User } = require('../models');

// Product catalogue (static reference data — no DB model needed)
const products = [
  { id: 'P001', name: 'Wireless Headphones',  price: 79.99,  category: 'Electronics', sku: 'WH-001' },
  { id: 'P002', name: 'Bluetooth Speaker',     price: 49.99,  category: 'Electronics', sku: 'BS-002' },
  { id: 'P003', name: 'USB-C Hub',             price: 34.99,  category: 'Electronics', sku: 'UH-003' },
  { id: 'P004', name: 'Mechanical Keyboard',   price: 129.99, category: 'Electronics', sku: 'MK-004' },
  { id: 'P005', name: 'Office Chair',          price: 249.99, category: 'Furniture',   sku: 'OC-005' },
  { id: 'P006', name: 'Standing Desk',         price: 399.99, category: 'Furniture',   sku: 'SD-006' },
  { id: 'P007', name: 'Notebook Pack (3)',      price: 12.99,  category: 'Stationery',  sku: 'NP-007' },
  { id: 'P008', name: 'Desk Lamp',             price: 44.99,  category: 'Accessories', sku: 'DL-008' },
  { id: 'P009', name: 'Webcam HD',             price: 59.99,  category: 'Electronics', sku: 'WC-009' },
  { id: 'P010', name: 'Monitor Stand',         price: 29.99,  category: 'Accessories', sku: 'MS-010' },
];

// GET /api/billing/products — get product catalog
router.get('/products', auth, (req, res) => {
  res.json(products);
});

// POST /api/billing/create — create a bill + auto-create user account
router.post('/create', auth, async (req, res) => {
  try {
    const { items, customer, feedback } = req.body;

    // Validate inputs
    if (!items || !items.length) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ error: 'Customer name, email, and phone are required' });
    }
    if (customer.phone.length < 6) {
      return res.status(400).json({ error: 'Phone number must be at least 6 digits' });
    }

    // Build bill items from product catalog
    const billItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: Math.round(product.price * item.quantity * 100) / 100,
      };
    });

    // Calculate totals
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
    const total = Math.round((subtotal + tax) * 100) / 100;

    // Generate unique bill number
    const billNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

    // Only use createdBy if req.user.id is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.user.id);

    // Save bill to MongoDB
    const bill = await Bill.create({
      billNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      items: billItems,
      subtotal,
      tax,
      total,
      status: 'pending',
      ...(isValidObjectId && { createdBy: req.user.id }),
    });

    // Save feedback to MongoDB if provided
    if (feedback && (feedback.rating || feedback.comment)) {
      const sentiment =
        feedback.rating >= 4 ? 'positive' :
        feedback.rating === 3 ? 'neutral' : 'negative';

      await Feedback.create({
        billId: bill._id,
        customerEmail: customer.email,
        rating: feedback.rating || 0,
        comment: feedback.comment || '',
        sentiment,
      });
    }

    // Auto-create user account in MongoDB if not already existing
    const existingUser = await User.findOne({ email: customer.email });
    const userPassword = customer.phone.slice(-6);
    let userCredentials = null;

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      await User.create({
        name: customer.name,
        email: customer.email,
        password: hashedPassword,
        role: 'user',
      });
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

// GET /api/billing/history — get staff's bill history from MongoDB
router.get('/history', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching billing history' });
  }
});

module.exports = router;
