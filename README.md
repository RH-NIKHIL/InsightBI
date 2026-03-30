<p align="center">
  <h1 align="center">⚡ InsightBI</h1>
  <p align="center">
    <strong>Intelligent Energy Analytics & Business Intelligence Platform</strong>
  </p>
  <p align="center">
    A full-stack web application for energy consumption analytics, demand forecasting, price volatility analysis, billing anomaly detection, and customer satisfaction insights — powered by role-based access control.
  </p>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Git Commands](#-git-commands)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Role-Based Access Control](#-role-based-access-control)
- [Application Workflow](#-application-workflow)
- [Application Modules](#-application-modules)
- [Payment Integration](#-payment-integration)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🔍 Overview

**InsightBI** is a comprehensive energy analytics web application that provides actionable insights into energy consumption, billing anomalies, price volatility, and customer satisfaction. The platform supports three distinct user roles — **Admin**, **Billing Staff**, and **Consumer** — each with tailored dashboards and capabilities.

The application features a **React 19** frontend with **Tailwind CSS** styling and **Recharts** data visualizations, backed by a **Node.js/Express** REST API with **JWT authentication** and an in-memory data store designed for rapid prototyping.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Multi-Role Authentication** | Separate login/registration flows for Admin, Billing Staff, and User roles with JWT-based security |
| 📊 **Admin Dashboard** | Centralized analytics overview with key performance indicators and system metrics |
| 📈 **Demand Forecasting** | Predict future energy demand based on historical consumption data with interactive charts |
| 💹 **Price Volatility Analysis** | Track energy market price fluctuations, calculate variance, and identify high-risk pricing periods |
| 🔎 **Billing Anomaly Detection** | Flag irregular billing amounts or impossible consumption jumps to prevent fraud or hardware errors |
| 😊 **Customer Satisfaction** | Collect user feedback and perform simulated AI-based sentiment analysis with NPS scoring |
| 💳 **Razorpay Payments** | Integrated Razorpay Checkout for secure payment processing during billing |
| 💼 **Billing Staff Portal** | Dedicated dashboard for billing management and customer account resolution |
| 👤 **User Portal** | Personal usage metrics, consumption tracking, and satisfaction feedback submission |
| 🌗 **Theme Support** | Dark/Light mode toggle via React Context API |
| 🛡️ **Protected Routes** | Role-specific route guards ensuring unauthorized users cannot access restricted views |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library (SPA architecture) |
| **React Router v7** | Client-side routing & navigation |
| **Tailwind CSS 3.4** | Utility-first CSS framework |
| **Recharts 3.7** | Data visualization & charting |
| **Lucide React** | Modern icon library |
| **React Context API** | State management (Auth, Theme) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js 4** | REST API framework |
| **JSON Web Tokens (JWT)** | Authentication & authorization |
| **bcrypt.js** | Password hashing |
| **Razorpay SDK** | Payment order creation & verification |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL persistent database for all analytics, users, staff, and billing data |
| **Mongoose** | MongoDB object modelling (ODM) |
| **AnalyticsSnapshot** | Single flexible model storing all 4 analytics module snapshots |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React 19 SPA                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │   │
│  │  │  Pages   │ │Components│ │   Context API     │  │   │
│  │  │          │ │          │ │  ┌─────────────┐  │  │   │
│  │  │ Dashboard│ │ Navbar   │ │  │ AuthContext  │  │  │   │
│  │  │ Forecast │ │ Footer   │ │  │ ThemeContext │  │  │   │
│  │  │ Billing  │ │ Protected│ │  │ UserAuth    │  │  │   │
│  │  │ Volatility│ │ Routes  │ │  │ StaffAuth   │  │  │   │
│  │  └──────────┘ └──────────┘ │  └─────────────┘  │  │   │
│  │                            └──────────────────────┘  │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          │ HTTP (fetch)                   │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  SERVER (Node.js / Express)               │
│                                                           │
│  ┌────────────┐  ┌────────────────────────────────────┐  │
│  │ Middleware  │  │           API Routes               │  │
│  │            │  │                                     │  │
│  │ CORS       │  │  /api/auth          (Admin Auth)    │  │
│  │ JWT Auth   │  │  /api/user-auth     (User Auth)     │  │
│  │ JSON Parse │  │  /api/staff-auth    (Staff Auth)    │  │
│  │ Logger     │  │  /api/dashboard     (Admin Metrics) │  │
│  │            │  │  /api/billing       (Billing Ops)   │  │
│  └────────────┘  │  /api/payment       (Razorpay)      │  │
│                  │  /api/demand-forecast               │  │
│                  │  /api/price-volatility               │  │
│                  │  /api/billing-anomaly                │  │
│                  │  /api/customer-satisfaction           │  │
│                  └───────────────┬────────────────────┘  │
│                                  │                        │
│                  ┌───────────────▼────────────────────┐  │
│                  │      In-Memory Data Store           │  │
│                  │        (data/store.js)              │  │
│                  └────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
InsightBI/
├── backend/                          # Node.js/Express API Server
│   ├── .env                          # Environment variables (git-ignored)
│   ├── .gitignore                    # Git ignore rules
│   ├── config.js                     # Loads env vars via dotenv
│   ├── server.js                     # Express app entry point
│   ├── package.json                  # Backend dependencies
│   ├── data/
│   │   └── store.js                  # In-memory JSON data store
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   └── routes/
│       ├── auth.js                   # Admin authentication routes
│       ├── userAuth.js               # Consumer authentication routes
│       ├── staffAuth.js              # Billing staff authentication routes
│       ├── dashboard.js              # Dashboard data endpoints
│       ├── billing.js                # Billing management endpoints
│       ├── payment.js                # Razorpay payment endpoints
│       ├── billingAnomaly.js         # Anomaly detection endpoints
│       ├── demandForecast.js         # Demand forecasting endpoints
│       ├── priceVolatility.js        # Price volatility endpoints
│       └── customerSatisfaction.js   # Customer satisfaction endpoints
│
├── insightbi-frontend/               # React 19 SPA Frontend
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── public/                       # Static assets
│   └── src/
│       ├── App.js                    # Root component with routing
│       ├── index.js                  # React entry point
│       ├── index.css                 # Global styles (Tailwind)
│       ├── components/
│       │   ├── Navbar.js             # Navigation bar
│       │   ├── Footer.js             # Footer component
│       │   ├── ProtectedRoute.js     # Admin route guard
│       │   ├── StaffProtectedRoute.js# Staff route guard
│       │   └── UserProtectedRoute.js # User route guard
│       ├── context/
│       │   ├── AuthContext.js        # Admin authentication state
│       │   ├── UserAuthContext.js    # Consumer authentication state
│       │   ├── StaffAuthContext.js   # Staff authentication state
│       │   └── ThemeContext.js       # Dark/Light theme state
│       ├── pages/
│       │   ├── Home.js               # Landing page
│       │   ├── About.js              # About page
│       │   ├── Contact.js            # Contact page
│       │   ├── Login.js              # Admin login
│       │   ├── Register.js           # Admin registration
│       │   ├── UserLogin.js          # Consumer login
│       │   ├── UserRegister.js       # Consumer registration
│       │   ├── Dashboard.js          # Admin dashboard
│       │   ├── UserDashboard.js      # Consumer dashboard
│       │   ├── BillingStaffDashboard.js # Staff dashboard + Razorpay
│       │   ├── DemandForecast.js     # Demand forecasting module
│       │   ├── PriceVolatility.js    # Price volatility module
│       │   ├── BillingAnomaly.js     # Billing anomaly module
│       │   ├── CustomerSatisfaction.js # Satisfaction module
│       │   └── Profile.js           # User profile page
│       └── services/
│           └── api.js                # HTTP client & API calls
│
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** installed
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation & Setup

**1. Clone the repository**

```bash
git clone https://github.com/RH-NIKHIL/InsightBI.git
cd InsightBI
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../insightbi-frontend
npm install
```

**4. Configure environment variables**

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables)).

**5. Start the backend server**

```bash
cd ../backend
npm start
```

The API server will start on **http://localhost:5000**.

**6. Start the frontend development server** (in a new terminal)

```bash
cd ../insightbi-frontend
npm start
```

The React app will open at **http://localhost:3000**.

---

## 🗂️ Git Commands

Common Git commands used throughout this project's development lifecycle.

### Repository Setup

```bash
# Initialize a new Git repository
git init

# Clone the repository
git clone https://github.com/RH-NIKHIL/InsightBI.git
cd InsightBI
```

### Daily Workflow

```bash
# Check status of working directory
git status

# Stage all changes
git add .

# Stage a specific file
git add backend/routes/dashboard.js

# Commit staged changes with a message
git commit -m "your commit message"

# Push changes to remote (first time)
git push -u origin master

# Push changes to remote (subsequent times)
git push

# Pull latest changes from remote
git pull origin master
```

### Branching

```bash
# List all branches
git branch

# Create a new branch
git branch feature/new-module

# Switch to a branch
git checkout feature/new-module

# Create and switch to a new branch in one step
git checkout -b feature/new-module

# Merge a branch into master
git checkout master
git merge feature/new-module
```

### History & Logs

```bash
# View commit history
git log

# View compact one-line log
git log --oneline

# View changes in a specific commit
git show <commit-hash>
```

### Undoing Changes

```bash
# Unstage a file (keep changes)
git reset HEAD <file>

# Discard changes in working directory
git checkout -- <file>

# Revert to a previous commit (safe)
git revert <commit-hash>
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_SECRET=your_razorpay_secret
```

> ⚠️ **Never commit your `.env` file to git.** The `.gitignore` is already configured to exclude it.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new admin |
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/user-auth/register` | Register a new consumer |
| `POST` | `/api/user-auth/login` | Consumer login |
| `POST` | `/api/staff-auth/login` | Billing staff login |

### Dashboard & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Fetch admin dashboard metrics |
| `GET` | `/api/demand-forecast` | Retrieve demand forecast data |
| `POST` | `/api/demand-forecast/generate` | Generate new demand forecast |
| `GET` | `/api/price-volatility` | Retrieve price volatility data |
| `POST` | `/api/price-volatility/analyze` | Run price volatility analysis |
| `GET` | `/api/billing-anomaly` | Fetch billing anomaly data |
| `POST` | `/api/billing-anomaly/scan` | Scan for billing anomalies |
| `GET` | `/api/customer-satisfaction` | Fetch satisfaction metrics |
| `POST` | `/api/customer-satisfaction` | Submit feedback |

### Payment (Razorpay)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/create-order` | Create a Razorpay payment order |
| `POST` | `/api/payment/verify` | Verify payment signature |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |

---

## 👥 Role-Based Access Control

InsightBI implements three distinct user portals with separate authentication contexts and protected route wrappers:

```
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│       🔴 Admin           │     🟡 Billing Staff     │      🟢 Consumer         │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Admin Dashboard          │ Billing Staff Dashboard  │ User Dashboard           │
│ Demand Forecasting       │ Account Management       │ Consumption Metrics      │
│ Price Volatility         │ Anomaly Review           │ Customer Satisfaction    │
│ Billing Anomaly          │                          │ Feedback Submission      │
│ Profile Management       │                          │                          │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

Each role has:
- **Separate login/register flows** (`Login.js`, `UserLogin.js`, `StaffAuth`)
- **Dedicated Auth Context** (`AuthContext`, `UserAuthContext`, `StaffAuthContext`)
- **Protected Route Guard** (`ProtectedRoute`, `UserProtectedRoute`, `StaffProtectedRoute`)

---

## 🔄 Application Workflow

The application follows a structured, modular workflow:

### Step 1: Entry & Authentication
- Users land on the **Home** page and navigate to the Login portal (`/login`).
- The user selects their role (Admin, Staff, or User) via a unified login interface.
- Upon successful authentication, the backend issues a distinct **JWT** based on the role.

### Step 2: Routing & Protection
- React Router evaluates the token against Protected Route wrappers (`ProtectedRoute`, `StaffProtectedRoute`, `UserProtectedRoute`).
- Users are redirected to their respective dashboards. Unauthorized access attempts redirect back to login.

### Step 3: Module Execution & Projections
Each role accesses their permitted modules (detailed below), where they can view data visualizations and trigger analytics operations via the REST API.

---

## 🧩 Application Modules

### 1. Demand Forecasting (Admin)
Predicts future energy demand based on historical usage data.
- Frontend requests `/api/demand-forecast` to render historical charts.
- Clicking **"Run Forecast"** hits `POST /api/demand-forecast/generate`.
- The backend simulates an AI engine, returning projected data points rendered as interactive line graphs in real-time.

### 2. Price Volatility Analysis (Admin)
Tracks energy market price fluctuations to optimize purchasing and selling strategies.
- Frontend requests `/api/price-volatility` to visualize real-time market data.
- Clicking **"Run Analysis"** hits `POST /api/price-volatility/analyze`.
- The system calculates variance, applies a volatility index score, and identifies high-risk pricing periods.

### 3. Billing Anomaly Detection (Admin & Staff)
Flags irregular billing amounts or impossible consumption jumps to prevent fraud or hardware errors.
- Frontend fetches `/api/billing-anomaly` to list recent transactions.
- The **"Scan"** action hits `POST /api/billing-anomaly/scan`.
- Transactions outside the standard deviation threshold are marked as **"High Risk"** or **"Anomaly Detected"**. Staff can review flagged accounts.

### 4. Customer Satisfaction (Consumer)
Enables consumers to submit feedback processed through simulated AI sentiment analysis.
- User navigates to Customer Satisfaction on their dashboard and submits feedback.
- The system generates a **Net Promoter Score (NPS)** and categorizes feedback into segment insights.

---

## 💳 Payment Integration

InsightBI uses **Razorpay** for secure payment processing in the billing flow.

**Flow:**
1. Staff clicks **"Pay & Generate Bill"** → backend creates a Razorpay order.
2. Razorpay Checkout popup opens with pre-filled customer details.
3. After successful payment, the signature is verified server-side (HMAC SHA256).
4. Only after verification does the bill get created.

**Test Card:** `4111 1111 1111 1111` | Any future expiry | Any CVV | OTP: `1234`

---

## 🔮 Future Roadmap

- [x] **Persistent Database** — Migrated from in-memory store to MongoDB with `AnalyticsSnapshot` model
- [ ] **AI Microservices** — Replace simulated forecasting with actual AI-powered predictive engines via a Python FastAPI microservice layer
- [ ] **Real-Time Notifications** — WebSocket-based alerts for billing anomalies and demand spikes
- [ ] **Export & Reporting** — PDF/CSV export for dashboard analytics and forecast reports
- [ ] **Multi-Tenancy** — Support for multiple energy providers on a single platform

---

## 📄 License

This project is developed as an academic major project. All rights reserved.

---

<p align="center">
  <strong>Built using React, Node.js & Express</strong>
</p>
