import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.06) 0%, rgba(6,6,6,1) 70%)' }} />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.08)' }}>
            <User className="w-7 h-7" style={{ color: '#c9a84c' }} />
          </div>
          <h1 className="text-[2rem] mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}>
            User <span className="accent-text">Portal</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to view your reviews and insights
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg text-sm text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="input-field pl-11" placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="input-field pl-11 pr-11" placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLoading ? (
                <><div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid var(--bg-primary)', borderTopColor: 'transparent' }} /><span>Signing in...</span></>
              ) : (
                <><span>Sign In</span><ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/user-register" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>Create one</Link>
            </p>
          </div>

          <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Admin?{' '}
              <Link to="/login" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>Sign in here</Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-5 p-4 rounded-lg text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <p className="text-[0.7rem] tracking-[0.1em] uppercase mb-1" style={{ color: '#c9a84c' }}>Demo Credentials</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Email: <span style={{ color: 'var(--text-primary)' }}>user@demo.com</span> &nbsp;|&nbsp; Password: <span style={{ color: 'var(--text-primary)' }}>user123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
