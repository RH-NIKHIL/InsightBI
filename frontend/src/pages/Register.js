import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  User,
  CheckCircle
} from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const { register } = useUserAuth();
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && password.length > 0 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!agreeTerms) { setError('Please agree to the terms and conditions'); return; }
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/user-dashboard', { replace: true });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 500,
    letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px',
    color: 'var(--text-secondary)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-[2px] group">
            <span className="text-[2rem] font-normal tracking-[0.6em]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
              INSIGHT
            </span>
            <span className="text-[0.55rem] tracking-[0.5em] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
              BUSINESS INTELLIGENCE
            </span>
          </Link>
          <h2 className="mt-8 text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}>
            Create your account
          </h2>
          <p className="mt-2 text-[0.9rem]" style={{ color: 'var(--text-secondary)' }}>
            Start your journey with AI-powered insights
          </p>
        </div>

        {/* Register Form */}
        <div className="rounded-xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
              <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" style={labelStyle}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field pl-12" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-12" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field pl-12 pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="input-field pl-12" placeholder="••••••••" />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" style={{ color: req.met ? '#22c55e' : 'var(--text-muted)' }} />
                  <span style={{ color: req.met ? '#4ade80' : 'var(--text-muted)' }}>{req.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 mt-0.5 rounded" style={{ accentColor: 'var(--accent)' }} />
              <label htmlFor="terms" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I agree to the{' '}
                <a href="#" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid var(--bg-primary)', borderTopColor: 'transparent' }} />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>Or sign up with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300" style={{ border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)' }}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300" style={{ border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)' }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-[0.9rem]" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
