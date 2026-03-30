import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserAuth } from '../context/UserAuthContext';
import { useStaffAuth } from '../context/StaffAuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
  User,
  Receipt
} from 'lucide-react';

const GOLD = '#c9a84c';

const Login = () => {
  const [role, setRole] = useState('user'); // 'admin', 'user', or 'staff'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: adminLogin } = useAuth();
  const { login: userLogin } = useUserAuth();
  const { login: staffLogin } = useStaffAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (role === 'admin') {
        await adminLogin(email, password);
        navigate('/dashboard', { replace: true });
      } else if (role === 'staff') {
        await staffLogin(email, password);
        navigate('/staff-dashboard', { replace: true });
      } else {
        await userLogin(email, password);
        navigate('/user-dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = {
    admin: { email: 'admin@insightbi.com', password: 'admin123' },
    staff: { email: 'staff@insightbi.com', password: 'staff123' },
    user: { email: 'user@demo.com', password: 'user123' },
  }[role];

  const roleLabels = { user: 'User', staff: 'Staff', admin: 'Admin' };
  const roleIcons = { user: User, staff: Receipt, admin: Shield };

  const roleDescriptions = {
    user: 'Customer portal — view satisfaction analysis',
    staff: 'Billing portal — create bills & collect feedback',
    admin: 'Admin dashboard — forecasting, volatility & anomalies',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-[2px] group">
            <span
              className="text-[2rem] font-normal tracking-[0.6em]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
            >
              INSIGHT
            </span>
            <span
              className="text-[0.55rem] tracking-[0.5em] uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
            >
              BUSINESS INTELLIGENCE
            </span>
          </Link>
          <h2
            className="mt-8 text-3xl"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}
          >
            Welcome back
          </h2>
          <p className="mt-2 text-[0.9rem]" style={{ color: 'var(--text-secondary)' }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Role Toggle — 3 options */}
        <div className="flex gap-1.5 p-1.5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          {['user', 'staff', 'admin'].map(r => {
            const Icon = roleIcons[r];
            return (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300"
                style={{
                  background: role === r ? GOLD : 'transparent',
                  color: role === r ? '#060606' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{roleLabels[r]}</span>
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs -mt-4" style={{ color: 'var(--text-muted)' }}>{roleDescriptions[role]}</p>

        {/* Login Form */}
        <div
          className="glass rounded-xl p-8"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {error && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
              <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div
                    className="w-5 h-5 rounded-full animate-spin"
                    style={{ border: '2px solid var(--bg-primary)', borderTopColor: 'transparent' }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in as {roleLabels[role]}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div
          className="glass rounded-xl p-4 text-center"
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          <p className="text-[0.7rem] tracking-[0.1em] uppercase mb-1" style={{ color: GOLD }}>
            Demo Credentials ({roleLabels[role]})
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Email: <span style={{ color: 'var(--text-primary)' }}>{demoCredentials.email}</span>
            &nbsp;|&nbsp;
            Password: <span style={{ color: 'var(--text-primary)' }}>{demoCredentials.password}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
