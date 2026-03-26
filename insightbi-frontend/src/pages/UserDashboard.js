import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Users, Star, Clock, BarChart3, TrendingUp, Activity, AlertTriangle, CheckCircle,
  FileText, Calendar, ArrowRight, LogOut, Settings
} from 'lucide-react';
import { userAuthAPI } from '../services/api';

const GOLD = '#c9a84c';
const TEXT_SEC = '#a09888';

const UserDashboard = () => {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    userAuthAPI.getDashboard().then(data => setApiData(data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const recentReviews = apiData?.recentReviews || [
    { id: 1, module: 'Customer Satisfaction', date: '2024-01-15', status: 'completed', score: '87.5%', insight: 'Overall satisfaction trending upward with premium segment leading.' },
    { id: 2, module: 'Demand Forecast', date: '2024-01-14', status: 'completed', score: '94.2%', insight: 'Electronics and clothing categories showing strong growth signals.' },
    { id: 3, module: 'Price Volatility', date: '2024-01-13', status: 'in-progress', score: '78%', insight: 'Product B and E flagged for high volatility — review pricing strategy.' },
    { id: 4, module: 'Billing Anomaly', date: '2024-01-12', status: 'completed', score: '98.5%', insight: '2 critical anomalies detected and resolved. Revenue impact minimized.' },
  ];

  const activityLog = (apiData?.activityLog || [
    { action: 'Viewed Customer Satisfaction report', time: '2 hours ago' },
    { action: 'Downloaded Demand Forecast summary', time: '5 hours ago' },
    { action: 'Reviewed Price Volatility alerts', time: '1 day ago' },
    { action: 'Updated profile settings', time: '2 days ago' },
    { action: 'Submitted feedback on Billing Anomaly', time: '3 days ago' },
  ]).map((item, i) => ({
    ...item,
    icon: [<BarChart3 className="w-4 h-4" style={{ color: GOLD }} />, <FileText className="w-4 h-4" style={{ color: GOLD }} />, <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} />, <User className="w-4 h-4" style={{ color: GOLD }} />, <Activity className="w-4 h-4" style={{ color: GOLD }} />][i] || <Activity className="w-4 h-4" style={{ color: GOLD }} />
  }));

  const qs = apiData?.quickStats;
  const quickStats = [
    { label: 'Reviews Done', value: qs?.[0]?.value || '18', icon: <Star className="w-5 h-5" style={{ color: GOLD }} /> },
    { label: 'Reports Saved', value: qs?.[1]?.value || '7', icon: <FileText className="w-5 h-5" style={{ color: GOLD }} /> },
    { label: 'Alerts Seen', value: qs?.[2]?.value || '12', icon: <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} /> },
    { label: 'Avg Score', value: qs?.[3]?.value || '89%', icon: <TrendingUp className="w-5 h-5" style={{ color: GOLD }} /> },
  ];

  const getStatusStyle = (status) => {
    if (status === 'completed') return { background: 'rgba(34,197,94,0.15)', color: '#4ade80' };
    if (status === 'in-progress') return { background: 'rgba(201,168,76,0.15)', color: GOLD };
    return { background: 'rgba(239,68,68,0.15)', color: '#fca5a5' };
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-50 px-5 md:px-10 lg:px-[60px] py-4" style={{ background: 'rgba(6,6,6,0.9)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start gap-[2px]">
            <span className="text-[1.3rem] font-normal tracking-[0.5em]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>INSIGHT</span>
            <span className="text-[0.45rem] tracking-[0.4em] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>USER PORTAL</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <LogOut className="w-4 h-4" /><span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px] py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ background: GOLD, color: '#060606', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: TEXT_SEC }}>Welcome back,</p>
              <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 400 }}>
                {user?.name || 'User'}
              </h1>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.7rem] font-medium tracking-[0.12em] uppercase" style={{ color: TEXT_SEC }}>{s.label}</span>
                {s.icon}
              </div>
              <span className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Customer Satisfaction Module */}
        <Link to="/customer-satisfaction" className="card card-hover p-6 mb-8 flex items-center justify-between group block">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <Users className="w-7 h-7" style={{ color: '#060606' }} />
            </div>
            <div>
              <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Customer Satisfaction Analysis</h2>
              <p className="text-sm" style={{ color: TEXT_SEC }}>AI-powered satisfaction prediction, sentiment analysis & segment insights</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: GOLD }} />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reviews */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  Your Reviews
                </h2>
                <span className="text-[0.7rem] tracking-[0.1em] uppercase" style={{ color: TEXT_SEC }}>
                  {recentReviews.length} total
                </span>
              </div>

              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-5 rounded-lg transition-all duration-300"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{review.module}</h3>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs" style={{ color: TEXT_SEC }}>
                            <Calendar className="w-3 h-3" />{review.date}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-medium capitalize" style={getStatusStyle(review.status)}>
                            {review.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" style={{ color: GOLD }} />
                          <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{review.score}</span>
                        </div>
                        <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: TEXT_SEC }}>accuracy</span>
                      </div>
                    </div>
                    <p className="text-[0.8rem] leading-relaxed" style={{ color: TEXT_SEC }}>{review.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Sidebar */}
          <div>
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
              <div className="space-y-5">
                {activityLog.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[0.8rem]" style={{ color: 'var(--text-primary)' }}>{item.action}</p>
                      <p className="text-[0.7rem] flex items-center gap-1 mt-0.5" style={{ color: TEXT_SEC }}>
                        <Clock className="w-3 h-3" />{item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account card */}
            <div className="card p-6 mt-6">
              <h2 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                Account
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-sm" style={{ color: TEXT_SEC }}>Name</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-sm" style={{ color: TEXT_SEC }}>Email</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{user?.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm" style={{ color: TEXT_SEC }}>Role</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(201,168,76,0.15)', color: GOLD }}>User</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
