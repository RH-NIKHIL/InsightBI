import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, DollarSign, FileWarning, ArrowUpRight,
  Activity, AlertTriangle, CheckCircle, Clock, ArrowUp, ArrowDown, BarChart3, Users, Loader
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { dashboardAPI } from '../services/api';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e0c873';
const GOLD_DARK = '#9e8338';
const TEXT_SEC = '#a09888';
const TEXT_MUTED = '#605848';

const Dashboard = () => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardAPI.getData();
        setApiData(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const tooltipStyle = {
    backgroundColor: '#111111',
    border: '1px solid rgba(201, 168, 76, 0.2)',
    borderRadius: '8px',
    color: '#f0ece4',
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />;
      case 'success': return <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />;
      case 'error': return <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />;
      default: return <Activity className="w-5 h-5" style={{ color: GOLD_LIGHT }} />;
    }
  };

  const icons = [TrendingUp, DollarSign, FileWarning];
  const paths = ['/demand-forecast', '/price-volatility', '/billing-anomaly'];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4" style={{ color: '#ef4444' }} />
          <p style={{ color: '#fca5a5' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const modules = apiData?.modules
    ? apiData.modules
        .filter(m => m.title !== 'Customer Satisfaction')
        .map((m, i) => ({ ...m, icon: icons[i], path: paths[i] }))
    : [];

  const demandData = apiData?.demandData || [];
  const priceData  = apiData?.priceData  || [];
  const billingData = apiData?.billingData || [];
  const recentAlerts = apiData?.recentAlerts || [];

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px]">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="section-tag">Command Center</span>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-[0.9rem]" style={{ color: 'var(--text-secondary)' }}>
              Overview of all AI-powered business intelligence modules
            </p>
          </div>
          <Link to="/staff-management" className="btn-outline flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>Manage Staff</span>
          </Link>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link key={index} to={module.path} className="card card-hover p-6 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 transition-colors duration-300" style={{ color: 'var(--text-muted)' }} />
                </div>
                <h3 className="text-[0.75rem] font-medium tracking-[0.1em] uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {module.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    {module.value}
                  </span>
                  <span className="text-sm font-medium flex items-center" style={{ color: module.trend === 'up' ? '#22c55e' : '#ef4444' }}>
                    {module.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {module.change}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{module.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mb-10">

          {/* Demand Forecast Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Demand Forecast</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Actual vs Predicted</p>
              </div>
              <Link to="/demand-forecast" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>View →</Link>
            </div>
            {demandData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={demandData}>
                  <defs>
                    <linearGradient id="colorValueGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                  <XAxis dataKey="name" stroke={TEXT_MUTED} fontSize={12} />
                  <YAxis stroke={TEXT_MUTED} fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke={GOLD} fillOpacity={1} fill="url(#colorValueGold)" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" stroke={TEXT_SEC} strokeDasharray="5 5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>No data available</div>
            )}
          </div>

          {/* Price Volatility Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Price Volatility</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Weekly price trends</p>
              </div>
              <Link to="/price-volatility" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>View →</Link>
            </div>
            {priceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                  <XAxis dataKey="name" stroke={TEXT_MUTED} fontSize={12} />
                  <YAxis stroke={TEXT_MUTED} fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="price" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD }} />
                  <Line type="monotone" dataKey="volatility" stroke={TEXT_SEC} strokeWidth={2} dot={{ fill: TEXT_SEC }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>No data available</div>
            )}
          </div>

          {/* Billing Status Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Billing Status</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Normal vs Anomaly</p>
              </div>
              <Link to="/billing-anomaly" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>View →</Link>
            </div>
            {billingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={billingData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                  <XAxis type="number" stroke={TEXT_MUTED} fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke={TEXT_MUTED} fontSize={12} width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill={GOLD} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>No data available</div>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Recent Activity</h3>
            </div>
          </div>
          <div className="space-y-4">
            {recentAlerts.length > 0 ? recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{alert.message}</p>
                  <div className="flex items-center mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.time}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>No recent activity</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
