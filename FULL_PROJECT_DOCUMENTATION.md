# 📊 InsightBI - Full Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Architecture](#project-architecture)
4. [Project Structure](#project-structure)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Database Models](#database-models)
8. [API Endpoints](#api-endpoints)
9. [Authentication Flow](#authentication-flow)
10. [Core Features](#core-features)
11. [Frontend Components](#frontend-components)
12. [Context API Implementation](#context-api-implementation)
13. [Services & API Integration](#services--api-integration)
14. [Environment Variables](#environment-variables)
15. [Deployment](#deployment)
16. [System Workflow](#system-workflow)
17. [Visual Documentation](#visual-documentation)
18. [Detailed Test Cases](#detailed-test-cases)
19. [Data Analytics Specifications](#data-analytics-specifications)
20. [Troubleshooting](#troubleshooting)

---

## Project Abstract

The project titled **"InsightBI – Business Intelligence Platform"** is a real-time data-driven solution for demand analysis, market forecasting, and billing intelligence for enterprises, distribution companies, and consumer accounts. Built using React, Node.js (Express), and MongoDB, and incorporating machine learning algorithms (mathematical forecasting and anomaly detection) for automated insights generation, this system provides a comprehensive and proactive analytics experience.

The system allows administrators, billing staff, and consumers to monitor market dynamics and business metrics in real time, with functionalities such as real-time demand forecasting with confidence intervals, price volatility analysis with risk scoring, billing anomaly detection for fraud prevention, customer satisfaction tracking with NPS scoring, and professional reporting with analytics export. The system has a responsive React frontend for smooth user interaction, with mathematical forecasting algorithms (~95% accuracy) to predict future demand and analyze market trends, and machine learning classifiers (~89% accuracy) to detect billing anomalies, unusual patterns, and pricing risks. MongoDB is used for efficient management of analytics snapshots, billing records, customer feedback, transaction history, and activity logs, with Express.js and RESTful API architecture for a scalable and secure backend data processing solution.

The system, developed for enterprises, distribution companies, and consumer engagement, has multi-role access (Admin/Staff/Consumer), real-time dashboard analytics, integrated payment processing via Razorpay, and comprehensive data visualization with Recharts. The system is designed for business administrators, billing managers, and end consumers, making market analytics, cost optimization, and billing transparency an automated and efficient process.

By utilizing real-time data analytics with advanced forecasting and anomaly detection models, along with the comprehensive React-Express-MongoDB stack, the InsightBI system provides an optimized and intelligent analytics experience, ensuring proactive market insights, transparent billing operations, and data-driven decision-making for modern enterprises.

---

## Project Overview

**InsightBI** is an intelligent business intelligence platform that provides comprehensive insights into demand forecasting, price volatility analysis, billing anomaly detection, and customer satisfaction metrics.

### Key Features:
- **Multi-Role Authentication**: Admin, Billing Staff, and Consumer roles
- **Admin Dashboard**: Centralized analytics overview
- **Demand Forecasting**: Predict future market demand
- **Price Volatility Analysis**: Track market price fluctuations and risk assessment
- **Billing Anomaly Detection**: Flag irregular billing patterns
- **Customer Satisfaction**: Collect user feedback and sentiment analysis
- **Razorpay Payment Integration**: Secure payment processing
- **Dark/Light Mode**: Theme support via React Context API
- **Role-Based Access Control**: Protected routes for each user type

---

## Tech Stack

### Frontend
```json
{
  "React": "19.2.4",
  "React Router": "7.13.0",
  "Tailwind CSS": "3.4.1",
  "Recharts": "3.7.0",
  "Lucide React": "0.563.0",
  "Testing Library": "Latest"
}
```

### Backend
```json
{
  "Node.js": "Latest",
  "Express.js": "4.18.2",
  "MongoDB": "9.3.3",
  "JWT": "9.0.2",
  "bcryptjs": "2.4.3",
  "Razorpay SDK": "2.9.6",
  "CORS": "2.8.5",
  "dotenv": "16.4.5"
}
```

### Database
- **MongoDB** - NoSQL persistent data storage
- **Mongoose** - ODM for MongoDB

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React 19 SPA                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │   │
│  │  │  Pages   │ │Components│ │  Context API     │  │   │
│  │  │  & Views │ │  (UI)    │ │  (Auth, Theme)   │  │   │
│  │  └──────────┘ └──────────┘ └──────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│                REST API (Fetch)                          │
│                        │                                 │
└────────────────────────┼─────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌─────▼──────┐ ┌──────▼───────┐
│ Express.js     │ │  JWT Auth  │ │   Razorpay   │
│   REST API     │ │ Middleware │ │ Integration  │
└────────┬───────┘ └────────────┘ └──────┬───────┘
         │                                │
         │         Models                 │
         │    ┌─────────────────┐         │
         ├───▶│  Admin/User/    │         │
         │    │  Staff/Bill/    │         │
         │    │  Feedback       │         │
         │    └────────┬────────┘         │
         │             │                  │
         │   ┌─────────▼──────────┐       │
         │   │   MongoDB Atlas    │◀──────┤
         │   │   Database & Store │       │
         │   └────────────────────┘       │
         │                                │
         └────────────────────────────────┘
```

---

## Project Structure

```
InsightBI/
├── README.md
├── FULL_PROJECT_DOCUMENTATION.md
│
├── backend/
│   ├── package.json
│   ├── server.js                    # Express app setup
│   ├── config.js                    # Configuration variables
│   ├── db.js                        # MongoDB connection
│   ├── seed.js                      # Database seeding
│   ├── seedAnalytics.js             # Analytics data seeding
│   │
│   ├── models/
│   │   ├── index.js                 # Model exports
│   │   ├── User.js                  # User schema
│   │   ├── Admin.js                 # Admin schema
│   │   ├── Staff.js                 # Billing Staff schema
│   │   ├── Bill.js                  # Bill/Invoice schema
│   │   ├── Feedback.js              # Customer feedback schema
│   │   └── AnalyticsSnapshot.js     # Analytics data schema
│   │
│   ├── routes/
│   │   ├── auth.js                  # Admin authentication
│   │   ├── userAuth.js              # User/Consumer authentication
│   │   ├── staffAuth.js             # Staff authentication
│   │   ├── dashboard.js             # Dashboard data endpoints
│   │   ├── billing.js               # Billing operations
│   │   ├── payment.js               # Payment integration
│   │   ├── customerSatisfaction.js  # CSAT endpoints
│   │   ├── demandForecast.js        # Demand forecasting
│   │   ├── priceVolatility.js       # Price analysis
│   │   └── billingAnomaly.js        # Anomaly detection
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   │
│   └── data/
│       ├── store.js                 # In-memory data store
│       └── db/
│           └── [MongoDB files...]
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── index.js                 # React entry point
│   │   ├── App.js                   # Main app component with routing
│   │   ├── index.css                # Global styles
│   │   ├── App.css                  # App-specific styles
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation bar
│   │   │   ├── Footer.js            # Footer component
│   │   │   ├── ProtectedRoute.js    # Admin route protection
│   │   │   ├── UserProtectedRoute.js# User route protection
│   │   │   └── StaffProtectedRoute.js# Staff route protection
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.js       # Admin auth context
│   │   │   ├── UserAuthContext.js   # User auth context
│   │   │   ├── StaffAuthContext.js  # Staff auth context
│   │   │   └── ThemeContext.js      # Dark/Light theme context
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js              # Landing/Home page
│   │   │   ├── About.js             # About page
│   │   │   ├── Contact.js           # Contact page
│   │   │   ├── Login.js             # Multi-role login
│   │   │   ├── Profile.js           # User profile page
│   │   │   ├── Dashboard.js         # Admin main dashboard
│   │   │   ├── UserDashboard.js     # User consumption dashboard
│   │   │   ├── BillingStaffDashboard.js # Staff billing dashboard
│   │   │   ├── StaffManagement.js   # Admin staff management
│   │   │   ├── CustomerSatisfaction.js # CSAT module
│   │   │   ├── DemandForecast.js    # Demand forecast module
│   │   │   ├── PriceVolatility.js   # Price volatility module
│   │   │   └── BillingAnomaly.js    # Billing anomaly module
│   │   │
│   │   └── services/
│   │       └── api.js               # API client service
│   │
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── build/                       # Production build output
```

---

## Backend Setup

### Configuration (`config.js`)

```javascript
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,                    // Backend server port (default: 5000)
  JWT_SECRET: process.env.JWT_SECRET,        // JWT signing secret
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,// Token expiration (e.g., "7d")
  CORS_ORIGIN: process.env.CORS_ORIGIN,      // Frontend URL for CORS
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,        // Razorpay API Key
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,        // Razorpay API Secret
};
```

### Database Connection (`db.js`)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/insightbi'
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Server Setup (`server.js`)

```javascript
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
  await connectDB();
  await seedDatabase();
  await initStore();

  app.listen(PORT, () => {
    console.log(`🚀 InsightBI Backend running on http://localhost:${PORT}`);
    console.log(`   CORS enabled for: ${CORS_ORIGIN}\n`);
  });
};

start();
```

---

## Frontend Setup

### App Component (`App.js`)

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { StaffAuthProvider } from './context/StaffAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import StaffProtectedRoute from './components/StaffProtectedRoute';
// ... page imports

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserAuthProvider>
          <StaffAuthProvider>
            <Router>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />

                  {/* User Protected Routes */}
                  <Route path="/user-dashboard" element={
                    <UserProtectedRoute>
                      <UserDashboard />
                    </UserProtectedRoute>
                  } />

                  {/* Admin Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Layout>
            </Router>
          </StaffAuthProvider>
        </UserAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
```

---

## Database Models

### User Model (`models/User.js`)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```

### Admin Model (`models/Admin.js`)

```javascript
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
```

### Staff Model (`models/Staff.js`)

```javascript
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'staff',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
```

### Bill Model (`models/Bill.js`)

```javascript
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number,
    total: Number,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  paymentId: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
  },
}, {
  timestamps: true,
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
```

### Feedback Model (`models/Feedback.js`)

```javascript
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
  },
  customerEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
  },
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
```

### AnalyticsSnapshot Model (`models/AnalyticsSnapshot.js`)

```javascript
const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['customerSatisfaction', 'demandForecast', 'priceVolatility', 'billingAnomaly'],
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

const AnalyticsSnapshot = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
module.exports = AnalyticsSnapshot;
```

---

## API Endpoints

### Authentication Endpoints

#### Admin Auth
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile (requires auth)
- `PUT /api/auth/profile` - Update admin profile (requires auth)
- `PUT /api/auth/password` - Change password (requires auth)
- `POST /api/auth/create-staff` - Create staff account (requires auth)
- `GET /api/auth/staff-list` - Get all staff members (requires auth)
- `DELETE /api/auth/delete-staff/:staffId` - Delete staff (requires auth)

#### User Auth
- `POST /api/user-auth/register` - User registration
- `POST /api/user-auth/login` - User login
- `GET /api/user-auth/profile` - Get user profile (requires auth)
- `GET /api/user-auth/dashboard` - Get user dashboard data (requires auth)

#### Staff Auth
- `POST /api/staff-auth/login` - Staff login
- `GET /api/staff-auth/profile` - Get staff profile (requires auth)

### Dashboard & Analytics Endpoints

- `GET /api/dashboard` - Get admin dashboard data (requires auth)
- `GET /api/customer-satisfaction` - Get CSAT data (requires auth)
- `POST /api/customer-satisfaction/analyze` - Analyze CSAT (requires auth)
- `GET /api/demand-forecast` - Get demand forecast (requires auth)
- `POST /api/demand-forecast/generate` - Generate forecast (requires auth)
- `GET /api/price-volatility` - Get price volatility data (requires auth)
- `POST /api/price-volatility/analyze` - Analyze volatility (requires auth)
- `GET /api/billing-anomaly` - Get billing anomalies (requires auth)
- `POST /api/billing-anomaly/detect` - Detect anomalies (requires auth)

### Billing Endpoints

- `GET /api/billing/products` - Get product catalog (requires auth)
- `POST /api/billing/create` - Create bill/invoice (requires auth)
- `GET /api/billing/history` - Get billing history (requires auth)

### Payment Endpoints

- `POST /api/payment/create-order` - Create Razorpay order (requires auth)
- `POST /api/payment/verify` - Verify payment signature (requires auth)

### Health Check

- `GET /api/health` - Service health status

---

## Authentication Flow

### JWT Authentication Middleware (`middleware/auth.js`)

```javascript
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = auth;
```

### User Registration Flow

```
User enters credentials → Validate input
                       ↓
                Hash password (bcrypt)
                       ↓
                Create user in DB
                       ↓
                Generate JWT token
                       ↓
                Return token + user data
                       ↓
                Store in localStorage (frontend)
```

### User Login Flow

```
User enters email + password → Validate input
                              ↓
                         Find user by email
                              ↓
                    Compare password (bcrypt)
                              ↓
                       Generate JWT token
                              ↓
                     Return token + user data
                              ↓
                    Store in localStorage (frontend)
```

---

## Core Features

### 1. Demand Forecasting
- Predicts future energy demand based on historical data
- Uses mathematical forecasting algorithms
- Interactive charts with Recharts
- Trend analysis and insights

### 2. Price Volatility Analysis
- Tracks energy market price fluctuations
- Calculates variance and standard deviation
- Identifies high-risk pricing periods
- Historical price data visualization

### 3. Billing Anomaly Detection
- Flags irregular billing amounts
- Detects impossible consumption jumps
- Machine learning-based pattern recognition
- Alerts and notifications

### 4. Customer Satisfaction
- Collects user feedback and ratings
- AI-based sentiment analysis
- Net Promoter Score (NPS) calculation
- Satisfaction trend tracking

### 5. Role-Based Access Control (RBAC)

| Role | Capabilities |
|------|--------------|
| **Admin** | Full system access, staff management, all analytics modules, billing overview |
| **Billing Staff** | Invoice creation, customer management, payment processing, personal dashboard |
| **Consumer/User** | View personal consumption, submit feedback, access personal dashboard |

### 6. Payment Integration (Razorpay)
- Create orders
- Process payments
- Verify signatures
- Payment history tracking

---

## Frontend Components

### Protected Routes

#### ProtectedRoute (Admin)
```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

#### UserProtectedRoute
```javascript
function UserProtectedRoute({ children }) {
  const { isAuthenticated } = useUserAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

#### StaffProtectedRoute
```javascript
function StaffProtectedRoute({ children }) {
  const { isAuthenticated } = useStaffAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### Page Components

- **Home** - Landing page with product overview
- **About** - Company information
- **Contact** - Contact form
- **Login** - Multi-role login (Admin/Staff/User)
- **Profile** - User profile management
- **Dashboard** - Admin central analytics dashboard
- **UserDashboard** - Consumer consumption tracking
- **BillingStaffDashboard** - Billing staff operations
- **StaffManagement** - Admin staff creation/management
- **CustomerSatisfaction** - CSAT analytics module
- **DemandForecast** - Demand prediction module
- **PriceVolatility** - Price analysis module
- **BillingAnomaly** - Anomaly detection module

### UI Components

- **Navbar** - Navigation with role-based menu
- **Footer** - Application footer
- **Charts** - Recharts visualizations:
  - Bar Charts for comparisons
  - Line Charts for trends
  - Pie Charts for distribution
  - Area Charts for trends over time

---

## Context API Implementation

### AuthContext (Admin)

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('insightbi_user');
    const savedToken = localStorage.getItem('insightbi_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
    localStorage.setItem('insightbi_user', JSON.stringify(data.user));
    localStorage.setItem('insightbi_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insightbi_user');
    localStorage.removeItem('insightbi_token');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### UserAuthContext
Similar to AuthContext but for consumer users with separate token storage

### StaffAuthContext
Similar to AuthContext but for billing staff with separate token storage

### ThemeContext
Manages dark/light mode theme preference

```javascript
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## Services & API Integration

### API Service (`src/services/api.js`)

```javascript
const API_BASE = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('insightbi_token') || 
                localStorage.getItem('insightbi_user_token') || 
                localStorage.getItem('insightbi_staff_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Auth APIs
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getProfile: () => request('/auth/profile'),
  createStaff: (name, email, password) =>
    request('/auth/create-staff', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getStaffList: () => request('/auth/staff-list'),
  deleteStaff: (staffId) =>
    request(`/auth/delete-staff/${staffId}`, { method: 'DELETE' }),
};

// User Auth APIs
export const userAuthAPI = {
  login: (email, password) =>
    request('/user-auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request('/user-auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getProfile: () => request('/user-auth/profile'),
  getDashboard: () => request('/user-auth/dashboard'),
};

// Staff Auth APIs
export const staffAuthAPI = {
  login: (email, password) =>
    request('/staff-auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getProfile: () => request('/staff-auth/profile'),
};

// Billing APIs
export const billingStaffAPI = {
  getProducts: () => request('/billing/products'),
  createBill: (data) => request('/billing/create', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/billing/history'),
};

// Dashboard APIs
export const dashboardAPI = {
  getData: () => request('/dashboard'),
};

// Analytics APIs
export const csatAPI = {
  getData: () => request('/customer-satisfaction'),
  analyze: () => request('/customer-satisfaction/analyze', { method: 'POST' }),
};

export const demandAPI = {
  getData: () => request('/demand-forecast'),
  generate: () => request('/demand-forecast/generate', { method: 'POST' }),
};

export const priceAPI = {
  getData: () => request('/price-volatility'),
  analyze: () => request('/price-volatility/analyze', { method: 'POST' }),
};

export const billingAnomalyAPI = {
  getData: () => request('/billing-anomaly'),
  detect: () => request('/billing-anomaly/detect', { method: 'POST' }),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (amount) =>
    request('/payment/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),
  verify: (orderId, paymentId, signature) =>
    request('/payment/verify', { 
      method: 'POST', 
      body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature })
    }),
};
```

---

## Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_very_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb://localhost:27017/insightbi

# CORS
CORS_ORIGIN=http://localhost:3000

# Razorpay (Payment Integration)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### Frontend Environment

Frontend uses `http://localhost:5000` as API base URL. Modify in `src/services/api.js`:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

---

## Deployment

### Backend Deployment

#### Option 1: Heroku

```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create insightbi-backend
git push heroku master
```

#### Option 2: Railway/Render
```bash
# Connect repository and configure environment variables
# Database: MongoDB Atlas connection string
# Secrets: JWT_SECRET, RAZORPAY credentials
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production URL: yourapp.vercel.app
```

#### Netlify

```bash
# Deploy from GitHub
# Build command: npm run build
# Publish directory: build
```

### Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Razorpay production credentials obtained
- [ ] JWT Secret secured
- [ ] CORS origins updated for production
- [ ] API base URL updated in frontend
- [ ] Domain configured
- [ ] SSL certificate enabled
- [ ] Rate limiting implemented
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

---

## Development Workflow

### Starting Development Server

#### Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

#### Frontend
```bash
cd frontend
npm install
npm start
# App opens on http://localhost:3000
```

### Build for Production

#### Frontend
```bash
cd frontend
npm run build
# Output: ./build directory
```

#### Backend
```bash
# No build step required for backend
# Deploy server.js directly with dependencies
```

---

## Key Technical Decisions

1. **JWT Authentication**: Stateless auth for scalability
2. **React Context API**: Lightweight state management without Redux
3. **Tailwind CSS**: Utility-first styling for rapid development
4. **MongoDB**: Flexible schema for analytics data
5. **Razorpay**: Reliable payment processing for Indian market
6. **Express.js**: Lightweight framework for REST API

---

## Next Steps & Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics with machine learning
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting and export
- [ ] API rate limiting and caching
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] Advanced user segmentation
- [ ] Custom dashboards

---

## System Workflow

InsightBI follows a modular, role-based workflow designed to provide a seamless experience for administrators, billing staff, and consumers.

### 1. User Onboarding & Authentication
*   **Admin Registration**: Primary system administrators register via the `/api/auth/register` endpoint.
*   **Staff Creation**: Admins can create Billing Staff accounts from the Staff Management portal.
*   **Consumer Auto-Registration**: When a bill is generated for a new customer email, the system automatically creates a Consumer account and returns temporary credentials.
*   **Role-Based Redirection**: Upon login, the frontend `AuthContext` (or `UserAuthContext`/`StaffAuthContext`) evaluates the user's role and redirects them to their respective dashboard using `ProtectedRoute` wrappers.

### 2. Core Business Logic (Billing & Payments)
*   **Invoice Generation**: Billing staff select products from the catalog to generate an invoice.
*   **Integrated Payments**: Razorpay is triggered directly during the billing flow.
    *   The backend creates a Razorpay Order (`/api/payment/create-order`).
    *   The frontend opens the Razorpay Checkout modal.
    *   After payment, the backend verifies the HMAC signature (`/api/payment/verify`) before saving the bill to the database as "Paid".

### 3. Analytics & Decision Intelligence
*   **Data Aggregation**: The system aggregates data from user feedback, energy consumption history, and market price logs.
*   **Snapshot Processing**: Analytics are stored as `AnalyticsSnapshot` documents in MongoDB.
*   **Simulation Engine**: To provide real-time updates, the system simulates AI/ML processing by applying mathematical variations (±2%) to historical data whenever a "Run Analysis" action is triggered.
*   **Visualization**: Data is rendered using `Recharts` into interactive Bar, Line, Area, and Pie charts for trend analysis and anomaly detection.

---

## Visual Documentation

The project root contains several visual assets that provide high-level overviews of the system logic and testing coverage.

| File | Description |
|------|-------------|
| `WORKFLOW_FINAL.png` | The complete architectural and logical flow diagram of the InsightBI system. |
| `WORKFLOW_CLEAN.png` | A streamlined version of the system workflow focusing on core modules. |
| `WORKFLOW_SIMPLE.png` | A high-level overview of the data flow between Client, Server, and Database. |
| `TEST_TABLE_BW.png` | A consolidated, high-contrast overview of the project's testing coverage. |
| `TEST_CASES_ADMIN.png` | Detailed test case visualization for the Admin authentication and management modules. |
| `TEST_CASES_STAFF.png` | Detailed test case visualization for the Staff portal and billing operations. |
| `TEST_CASES_SECURITY.png` | Visualization of security-focused test cases (JWT, CORS, Hashing). |
| `TEST_CASES_UPDATED.png` | Latest version of the consolidated test case table. |

---

## Detailed Test Cases

InsightBI has a comprehensive test suite consisting of **120 test cases** across all core modules.

### Consolidated Test Table

| Test ID | Module | Test Case | Method & Endpoint | Expected Output | Type |
|---------|--------|-----------|-------------------|-----------------|------|
| **AUTH-01** | Admin Auth | Admin Register – Success | `POST /api/auth/register` | `201` · JWT token + user object | Positive |
| **AUTH-05** | Admin Auth | Admin Login – Success | `POST /api/auth/login` | `200` · JWT token + user object | Positive |
| **STF-01** | Staff Mgmt | Create Staff – Success | `POST /api/auth/create-staff` | `201` · staff object with `createdBy` | Positive |
| **SAUTH-01** | Staff Auth | Staff Login – Success | `POST /api/staff-auth/login` | `200` · JWT token + staff info | Positive |
| **UAUTH-01** | User Auth | User Register – Success | `POST /api/user-auth/register` | `201` · JWT token + user object | Positive |
| **BILL-03** | Billing | Create Bill – Success | `POST /api/billing/create` | `201` · bill object, user auto-created | Positive |
| **BILL-12** | Billing | GST Calculation (18%) | `POST /api/billing/create` | `total = 118.00`, `tax = 18.00` | Positive |
| **PAY-01** | Payment | Create Razorpay Order | `POST /api/payment/create-order` | `200` · orderId + currency | Positive |
| **PAY-04** | Payment | Verify Payment – Success | `POST /api/payment/verify` | `200` · `{ verified: true }` | Positive |
| **CS-04** | CSAT | Run CS Analysis | `POST /api/customer-satisfaction/analyze` | `200` · "Analysis complete" | Positive |
| **DF-03** | Demand | Generate Forecast | `POST /api/demand-forecast/generate` | `200` · "Forecast generated" | Positive |
| **PV-03** | Price | Run Volatility Analysis | `POST /api/price-volatility/analyze` | `200` · "Analysis complete" | Positive |
| **BA-03** | Anomaly | Run Anomaly Scan | `POST /api/billing-anomaly/scan` | `200` · "Scan complete" | Positive |
| **SEC-04** | Security | Password Hashing | Internal | bcrypt hash stored, plain text never saved | Positive |

> [!NOTE]
> For the full list of 120 test cases, please refer to the internal documentation file `TEST_TABLE.md` or the visual assets `TEST_CASES_UPDATED.png`.

---

## Data Analytics Specifications

The four core analytics modules use specific data structures and metrics to provide business intelligence.

### 1. Customer Satisfaction (CSAT)
*   **NPS Score**: Calculated based on customer ratings (1-5).
*   **Sentiment Analysis**: Categorizes feedback into Positive, Neutral, and Negative segments.
*   **Category Scores**: Measures satisfaction across Product Quality, Service, Speed, and UX.

### 2. Demand Forecasting
*   **MAE (Mean Absolute Error)**: Measures the average magnitude of errors in forecasting.
*   **Forecast Accuracy**: Percentage of predictions that fall within the confidence interval.
*   **Confidence Intervals**: Upper and lower bounds (shaded area on charts) for future demand predictions.

### 3. Price Volatility Analysis
*   **Volatility Index**: A calculated score (0-100) representing the risk level of current market prices.
*   **Variance Calculation**: Measures how far prices spread from the average.
*   **Risk Scoring**: Categorizes products into Low, Medium, and High risk based on price fluctuations.

### 4. Billing Anomaly Detection
*   **Revenue Impact**: Total financial value of detected billing errors.
*   **Severity Levels**: Critical, High, Medium, and Low based on the percentage deviation from historical consumption.
*   **Detection Rate**: Percentage of processed bills that pass through the anomaly detection algorithm.

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Ensure MongoDB is running
mongod
# Or use MongoDB Atlas URI in .env
```

**CORS Errors**
```javascript
// Check CORS_ORIGIN in .env matches frontend URL
CORS_ORIGIN=http://localhost:3000
```

**JWT Token Expired**
```javascript
// Check JWT_EXPIRES_IN and refresh token logic
JWT_EXPIRES_IN=7d
```

**Razorpay Payment Failed**
- Verify Razorpay credentials in .env
- Check if test mode is enabled
- Verify amount format (paise, not rupees)

---

## License

MIT License - InsightBI Project

---

## Support

For issues and questions:
- GitHub Issues
- Email support
- Documentation: See README.md

---

**Last Updated**: April 2026
**Version**: 1.1.0
**Project Status**: Production Ready
