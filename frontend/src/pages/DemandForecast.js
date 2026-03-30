import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, Upload, Play, Download, RefreshCw, Calendar, Filter, ArrowUp, ArrowDown, Info, Settings, LayoutDashboard, LogOut
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';
import { demandAPI } from '../services/api';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e0c873';
const GOLD_DARK = '#9e8338';
const TEXT_MUTED = '#605848';
const TEXT_SEC = '#a09888';

const tooltipStyle = { backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', color: '#f0ece4' };

const DemandForecast = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('6months');
  const [isForecasting, setIsForecasting] = useState(false);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    demandAPI.getData().then(data => setApiData(data)).catch(() => {});
  }, []);

  const demandData = apiData?.demandData || [
    { month: 'Jan', actual: 4200, predicted: 4100, lower: 3800, upper: 4400 },
    { month: 'Feb', actual: 3800, predicted: 3900, lower: 3600, upper: 4200 },
    { month: 'Mar', actual: 5100, predicted: 4900, lower: 4600, upper: 5200 },
    { month: 'Apr', actual: 4700, predicted: 4800, lower: 4500, upper: 5100 },
    { month: 'May', actual: 5500, predicted: 5400, lower: 5100, upper: 5700 },
    { month: 'Jun', actual: 5800, predicted: 5700, lower: 5400, upper: 6000 },
    { month: 'Jul', actual: null, predicted: 6100, lower: 5700, upper: 6500 },
    { month: 'Aug', actual: null, predicted: 6400, lower: 6000, upper: 6800 },
    { month: 'Sep', actual: null, predicted: 5900, lower: 5500, upper: 6300 },
  ];

  const categoryDemand = apiData?.categoryDemand || [
    { category: 'Electronics', current: 2500, forecast: 2800, change: 12 },
    { category: 'Clothing', current: 1800, forecast: 2100, change: 17 },
    { category: 'Food & Beverages', current: 3200, forecast: 3400, change: 6 },
    { category: 'Home & Garden', current: 1200, forecast: 1100, change: -8 },
    { category: 'Sports', current: 800, forecast: 950, change: 19 },
  ];

  const seasonalTrends = apiData?.seasonalTrends || [
    { week: 'W1', demand: 1200 }, { week: 'W2', demand: 1350 }, { week: 'W3', demand: 1100 }, { week: 'W4', demand: 1450 },
    { week: 'W5', demand: 1600 }, { week: 'W6', demand: 1380 }, { week: 'W7', demand: 1520 }, { week: 'W8', demand: 1700 },
  ];

  const m = apiData?.metrics || { forecastAccuracy: 94.2, mae: 145, rmse: 203, totalForecast: 18400 };
  const metrics = [
    { label: 'Forecast Accuracy', value: `${m.forecastAccuracy}%`, change: '+1.5%', trend: 'up' },
    { label: 'MAE', value: `${m.mae}`, change: '-12', trend: 'down' },
    { label: 'RMSE', value: `${m.rmse}`, change: '-8', trend: 'down' },
    { label: 'Total Forecast', value: m.totalForecast.toLocaleString(), change: '+2,100', trend: 'up' },
  ];

  const handleForecast = async () => {
    setIsForecasting(true);
    try {
      const result = await demandAPI.generate();
      setApiData(result.data);
    } catch (e) {}
    setIsForecasting(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(6, 6, 6, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Administrator</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg transition-all hover:bg-[var(--surface)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="pt-8 pb-12">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px]">
          {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <TrendingUp className="w-7 h-7" style={{ color: '#060606' }} />
            </div>
            <div>
              <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 400 }}>Demand Forecasting</h1>
              <p className="text-sm" style={{ color: TEXT_SEC }}>Predict future demand with ML algorithms</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /><span>Import Data</span></button>
            <button onClick={handleForecast} className="btn-primary flex items-center gap-2" disabled={isForecasting}>
              {isForecasting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isForecasting ? 'Forecasting...' : 'Generate Forecast'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <Calendar className="w-4 h-4" style={{ color: TEXT_SEC }} />
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm focus:outline-none" style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none' }}>
              <option value="3months" style={{ background: '#111' }}>3 Months</option>
              <option value="6months" style={{ background: '#111' }}>6 Months</option>
              <option value="12months" style={{ background: '#111' }}>12 Months</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: TEXT_SEC }}>
            <Filter className="w-4 h-4" /><span>Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: TEXT_SEC }}>
            <Settings className="w-4 h-4" /><span>Model Settings</span>
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: TEXT_SEC }}>{m.label}</span>
                <Info className="w-4 h-4" style={{ color: TEXT_MUTED }} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{m.value}</span>
                <span className="text-sm flex items-center" style={{ color: '#22c55e' }}>
                  {m.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}{m.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Demand Forecast</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Actual vs Predicted with confidence interval</p>
            </div>
            <button className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC, background: 'none', border: 'none' }}>
              <Download className="w-4 h-4" /><span>Export</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={demandData}>
              <defs>
                <linearGradient id="goldConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
              <XAxis dataKey="month" stroke={TEXT_MUTED} fontSize={12} />
              <YAxis stroke={TEXT_MUTED} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: TEXT_SEC, fontSize: '12px' }} />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#goldConfidence)" name="Upper Bound" />
              <Area type="monotone" dataKey="lower" stroke="transparent" fill="#060606" name="Lower Bound" />
              <Line type="monotone" dataKey="actual" name="Actual" stroke={GOLD} strokeWidth={3} dot={{ fill: GOLD, strokeWidth: 2 }} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke={TEXT_SEC} strokeWidth={2} strokeDasharray="5 5" dot={{ fill: TEXT_SEC }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Category Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis type="number" stroke={TEXT_MUTED} fontSize={12} />
                <YAxis dataKey="category" type="category" stroke={TEXT_MUTED} fontSize={12} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: TEXT_SEC, fontSize: '12px' }} />
                <Bar dataKey="current" name="Current" fill={GOLD_DARK} radius={[0, 4, 4, 0]} />
                <Bar dataKey="forecast" name="Forecast" fill={GOLD} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Weekly Demand Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={seasonalTrends}>
                <defs>
                  <linearGradient id="colorDemandGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis dataKey="week" stroke={TEXT_MUTED} fontSize={12} />
                <YAxis stroke={TEXT_MUTED} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="demand" stroke={GOLD} fillOpacity={1} fill="url(#colorDemandGold)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Table */}
        <div className="card p-6">
          <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Detailed Category Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Category', 'Current Demand', 'Forecasted', 'Change', 'Trend'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[0.7rem] font-semibold tracking-[0.1em] uppercase" style={{ color: TEXT_SEC }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoryDemand.map((item, index) => (
                  <tr key={index} className="transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.category}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: TEXT_SEC }}>{item.current.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.forecast.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: item.change >= 0 ? '#22c55e' : '#ef4444' }}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </td>
                    <td className="py-4 px-4">
                      {item.change >= 0 ? <ArrowUp className="w-5 h-5" style={{ color: '#22c55e' }} /> : <ArrowDown className="w-5 h-5" style={{ color: '#ef4444' }} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DemandForecast;
