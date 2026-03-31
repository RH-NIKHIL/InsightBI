const express = require('express');
const cors = require('cors');
const { CORS_ORIGIN, PORT } = require('./config');
const connectDB = require('./db');
const seedDatabase = require('./seed');
const { initStore } = require('./data/store');

const app = express();

// Middleware
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user-auth', require('./routes/userAuth'));
app.use('/api/staff-auth', require('./routes/staffAuth'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/customer-satisfaction', require('./routes/customerSatisfaction'));
app.use('/api/demand-forecast', require('./routes/demandForecast'));
app.use('/api/price-volatility', require('./routes/priceVolatility'));
app.use('/api/billing-anomaly', require('./routes/billingAnomaly'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const start = async () => {
  // Connect to MongoDB
  await connectDB();

  // Seed database with default accounts
  await seedDatabase();

  // Initialize in-memory store for analytics data (keeping this for now)
  await initStore();

  app.listen(PORT, () => {
    console.log(`\n🚀 InsightBI Backend running on http://localhost:${PORT}`);
    console.log(`   CORS enabled for: ${CORS_ORIGIN}\n`);
  });
};

start();
