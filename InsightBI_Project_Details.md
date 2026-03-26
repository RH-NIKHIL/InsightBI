# InsightBI - Project Details & Workflow

InsightBI is a comprehensive energy analytics web application developed with a modern tech stack (React.js frontend, Node.js/Express backend). It provides actionable insights into energy consumption, billing anomalies, price volatility, and customer satisfaction across three distinct user roles: **Admin**, **Billing Staff**, and **User/Consumer**.

---

## 🏗️ System Architecture

### 1. Frontend (React.js)
A responsive single-page application handling user interactions, dynamic routing, and data visualization. 
- **Framework:** React 18 with React Router
- **Styling:** Tailwind CSS combined with custom contextual styling
- **State Management:** React Context API (`ThemeContext`, `AuthContext`, `UserAuthContext`, `StaffAuthContext`)
- **Key Visuals:** Chart.js / Recharts for data projection and dashboard modules.

### 2. Backend API (Node.js/Express)
A RESTful API serving data to the frontend, handling business logic, and authenticating users.
- **Framework:** Express.js
- **Authentication:** JWT (JSON Web Tokens) based middleware
- **Endpoints:** Categorized by modules (`/api/auth`, `/api/dashboard`, `/api/demand-forecast`, etc.)

### 3. Data Store
Currently implemented as a fast, in-memory JSON data structure (`data/store.js`) for rapid prototyping and seamless state resets.

---

## 👥 Role-Based Access Control (RBAC)

The system supports three distinct portals:

1. **Admin Role**
   - **Access:** Full system analytics and configuration.
   - **Key Views:** Admin Dashboard, Demand Forecasting, Price Volatility Analysis, Billing Anomaly Detection, Profile.
2. **Billing Staff Role**
   - **Access:** Billing management and customer account resolution.
   - **Key Views:** Billing Staff Dashboard.
3. **User (Consumer) Role**
   - **Access:** Personal usage metrics and satisfaction feedback.
   - **Key Views:** User Dashboard, Customer Satisfaction portal.

---

## 🔄 Core Application Workflow

The application follows a structured, modular workflow:

### Step 1: Entry & Authentication
- Users land on the **Home** page.
- Navigation to the Login portal (`/login`).
- The user selects their role (Admin, Staff, or User) via a unified login interface.
- Upon successful authentication, the backend issues a distinct JWT based on the role.

### Step 2: Routing & Protection
- React Router evaluates the token against Protected Route wrappers (`ProtectedRoute`, `StaffProtectedRoute`, `UserProtectedRoute`).
- Users are redirected to their respective dashboards. If an unauthorized user attempts to access a restricted route, they are kicked back to the login screen.

### Step 3: Module Execution & Projections

#### A. Demand Forecasting Module (Admin)
- **Goal:** Predict future energy demand based on historical usage.
- **Workflow:** 
  1. Frontend requests `/api/demand-forecast`.
  2. The view renders historical charts and allows generation of new forecasts.
  3. Clicking "Run Forecast" hits `POST /api/demand-forecast/generate`.
  4. The backend simulates an ML model, updating the data store and returning projected future points.
  5. The UI updates the line graphs in real-time.

#### B. Price Volatility Module (Admin)
- **Goal:** Track energy market price fluctuations to optimize purchasing/selling.
- **Workflow:**
  1. Frontend requests `/api/price-volatility`.
  2. Real-time market data is visualized.
  3. Clicking "Run Analysis" hits `POST /api/price-volatility/analyze`.
  4. The system calculates variance, applies a volatility index score, and identifies high-risk pricing periods.

#### C. Billing Anomaly Detection (Admin & Staff)
- **Goal:** Flag irregular billing amounts or impossible consumption jumps to prevent fraud or hardware error.
- **Workflow:**
  1. Frontend fetches `/api/billing-anomaly`.
  2. The system lists recent transactions.
  3. The "Scan" action hits `POST /api/billing-anomaly/scan`.
  4. Transactions outside the standard deviation threshold are marked with "High Risk" or "Anomaly Detected". 
  5. Staff can review these specific accounts.

#### D. Customer Satisfaction Module (User)
- **Goal:** Collect feedback and perform sentiment analysis.
- **Workflow:**
  1. User navigates to Customer Satisfaction on their dashboard.
  2. User submits feedback.
  3. The system processes the text (simulating AI Sentiment Analysis) to generate an NPS (Net Promoter Score) and categorizes the segment insight.

---

## 🚀 Future Projection / Roadmap Workflow
While currently running on an in-memory data store for the prototype phase, the architectural workflow is designed to seamlessly integrate with:
1. **MongoDB / PostgreSQL:** For persistent, scalable data storage.
2. **Python Microservices:** Moving the simulated ML generations (Demand Forecast, Price Volatility) into actual predictive neural networks (e.g., TensorFlow/PyTorch) connected via a Python FastAPI layer.
