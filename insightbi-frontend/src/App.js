import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { StaffAuthProvider } from './context/StaffAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import StaffProtectedRoute from './components/StaffProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CustomerSatisfaction from './pages/CustomerSatisfaction';
import DemandForecast from './pages/DemandForecast';
import PriceVolatility from './pages/PriceVolatility';
import BillingAnomaly from './pages/BillingAnomaly';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import BillingStaffDashboard from './pages/BillingStaffDashboard';
import StaffManagement from './pages/StaffManagement';

// Layout component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const authPages = ['/login', '/forgot-password'];
  const portalPages = ['/user-dashboard', '/customer-satisfaction', '/staff-dashboard', '/staff-management'];
  const isAuthPage = authPages.includes(location.pathname);
  const isPortalPage = portalPages.includes(location.pathname);

  return (
    <div className="min-h-screen" style={{ background: '#060606', color: '#f0ece4' }}>
      {!isAuthPage && !isPortalPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && !isPortalPage && <Footer />}
    </div>
  );
};

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

                  {/* Redirects for old routes */}
                  <Route path="/register" element={<Navigate to="/login" replace />} />
                  <Route path="/user-login" element={<Navigate to="/login" replace />} />
                  <Route path="/user-register" element={<Navigate to="/login" replace />} />

                  {/* User Protected Routes */}
                  <Route path="/user-dashboard" element={
                    <UserProtectedRoute>
                      <UserDashboard />
                    </UserProtectedRoute>
                  } />
                  <Route path="/customer-satisfaction" element={
                    <UserProtectedRoute>
                      <CustomerSatisfaction />
                    </UserProtectedRoute>
                  } />

                  {/* Staff Protected Routes */}
                  <Route path="/staff-dashboard" element={
                    <StaffProtectedRoute>
                      <BillingStaffDashboard />
                    </StaffProtectedRoute>
                  } />

                  {/* Admin Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/staff-management" element={
                    <ProtectedRoute>
                      <StaffManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/demand-forecast" element={
                    <ProtectedRoute>
                      <DemandForecast />
                    </ProtectedRoute>
                  } />
                  <Route path="/price-volatility" element={
                    <ProtectedRoute>
                      <PriceVolatility />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing-anomaly" element={
                    <ProtectedRoute>
                      <BillingAnomaly />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
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
