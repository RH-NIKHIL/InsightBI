import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileWarning, Upload, Play, Download, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Filter, Search, Eye, Flag, LayoutDashboard, LogOut
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { billingAPI } from '../services/api';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e0c873';
const GOLD_DARK = '#9e8338';
const TEXT_MUTED = '#605848';
const TEXT_SEC = '#a09888';

const tooltipStyle = { backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', color: '#f0ece4' };

const BillingAnomaly = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    billingAPI.getData().then(data => setApiData(data)).catch(() => {});
  }, []);

  const anomalyTrend = apiData?.anomalyTrend || [
    { date: 'Mon', detected: 12, resolved: 10 }, { date: 'Tue', detected: 8, resolved: 7 },
    { date: 'Wed', detected: 15, resolved: 12 }, { date: 'Thu', detected: 6, resolved: 6 },
    { date: 'Fri', detected: 18, resolved: 14 }, { date: 'Sat', detected: 4, resolved: 4 },
    { date: 'Sun', detected: 3, resolved: 2 },
  ];

  const anomalyTypes = apiData?.anomalyTypes || [
    { name: 'Duplicate Charges', value: 35, color: GOLD },
    { name: 'Missing Payments', value: 25, color: GOLD_LIGHT },
    { name: 'Incorrect Amount', value: 20, color: GOLD_DARK },
    { name: 'Late Billing', value: 12, color: TEXT_SEC },
    { name: 'Other', value: 8, color: TEXT_MUTED },
  ];

  const severityData = apiData?.severityData || [
    { severity: 'Critical', count: 5 }, { severity: 'High', count: 12 },
    { severity: 'Medium', count: 28 }, { severity: 'Low', count: 45 },
  ];

  const recentAnomalies = apiData?.recentAnomalies || [
    { id: 'ANM-001', customer: 'Acme Corp', type: 'Duplicate Charge', amount: 1250.00, severity: 'high', status: 'pending', date: '2024-01-15' },
    { id: 'ANM-002', customer: 'Tech Solutions', type: 'Missing Payment', amount: 3500.00, severity: 'critical', status: 'investigating', date: '2024-01-15' },
    { id: 'ANM-003', customer: 'Global Inc', type: 'Incorrect Amount', amount: 450.00, severity: 'medium', status: 'resolved', date: '2024-01-14' },
    { id: 'ANM-004', customer: 'StartUp LLC', type: 'Late Billing', amount: 890.00, severity: 'low', status: 'pending', date: '2024-01-14' },
    { id: 'ANM-005', customer: 'Enterprise Co', type: 'Duplicate Charge', amount: 2100.00, severity: 'high', status: 'resolved', date: '2024-01-13' },
    { id: 'ANM-006', customer: 'Digital Corp', type: 'Missing Payment', amount: 5200.00, severity: 'critical', status: 'pending', date: '2024-01-13' },
  ];

  const mb = apiData?.metrics || { totalAnomalies: 156, resolvedToday: 42, revenueImpact: 45200, detectionRate: 98.5 };
  const metrics = [
    { label: 'Total Anomalies', value: `${mb.totalAnomalies}`, change: '+23', status: 'warning' },
    { label: 'Resolved Today', value: `${mb.resolvedToday}`, change: '+8', status: 'good' },
    { label: 'Revenue Impact', value: `$${(mb.revenueImpact / 1000).toFixed(1)}K`, change: '-$12K', status: 'good' },
    { label: 'Detection Rate', value: `${mb.detectionRate}%`, change: '+0.5%', status: 'good' },
  ];

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await billingAPI.scan();
      setApiData(result.data);
    } catch (e) {}
    setIsScanning(false);
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return { background: 'rgba(239,68,68,0.15)', color: '#fca5a5' };
      case 'high': return { background: 'rgba(249,115,22,0.15)', color: '#fdba74' };
      case 'medium': return { background: 'rgba(201,168,76,0.15)', color: GOLD };
      case 'low': return { background: 'rgba(34,197,94,0.15)', color: '#4ade80' };
      default: return { background: 'var(--surface)', color: TEXT_SEC };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />;
      case 'pending': return <Clock className="w-5 h-5" style={{ color: GOLD }} />;
      case 'investigating': return <AlertTriangle className="w-5 h-5" style={{ color: '#f97316' }} />;
      default: return <XCircle className="w-5 h-5" style={{ color: TEXT_SEC }} />;
    }
  };

  const filteredAnomalies = recentAnomalies.filter(anomaly => {
    const matchesFilter = filterStatus === 'all' || anomaly.status === filterStatus;
    const matchesSearch = anomaly.customer.toLowerCase().includes(searchQuery.toLowerCase()) || anomaly.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              <FileWarning className="w-7 h-7" style={{ color: '#060606' }} />
            </div>
            <div>
              <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 400 }}>Billing Anomaly Detection</h1>
              <p className="text-sm" style={{ color: TEXT_SEC }}>Identify and resolve billing irregularities</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /><span>Import Bills</span></button>
            <button onClick={handleScan} className="btn-primary flex items-center gap-2" disabled={isScanning}>
              {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isScanning ? 'Scanning...' : 'Run Detection'}</span>
            </button>
          </div>
        </div>

        {/* Alert */}
        <div className="rounded-xl p-4 mb-8 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <h4 className="text-sm font-semibold" style={{ color: '#fca5a5' }}>Critical Anomalies Detected</h4>
            <p className="text-sm" style={{ color: TEXT_SEC }}>2 critical billing anomalies require immediate attention. Total revenue at risk: $8,700</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: TEXT_SEC }}>{m.label}</span>
                {m.status === 'good' ? <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} /> : <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{m.value}</span>
                <span className="text-sm" style={{ color: m.status === 'good' ? '#22c55e' : GOLD }}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2 card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Weekly Anomaly Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={anomalyTrend}>
                <defs>
                  <linearGradient id="colorDetectedGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.3}/><stop offset="95%" stopColor={GOLD} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis dataKey="date" stroke={TEXT_MUTED} fontSize={12} />
                <YAxis stroke={TEXT_MUTED} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: TEXT_SEC, fontSize: '12px' }} />
                <Area type="monotone" dataKey="detected" name="Detected" stroke={GOLD} fillOpacity={1} fill="url(#colorDetectedGold)" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke={TEXT_SEC} strokeWidth={2} dot={{ fill: TEXT_SEC }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Anomaly Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={anomalyTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                  {anomalyTypes.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: TEXT_SEC, fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
              <XAxis type="number" stroke={TEXT_MUTED} fontSize={12} />
              <YAxis dataKey="severity" type="category" stroke={TEXT_MUTED} fontSize={12} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={GOLD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Anomalies Table */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Recent Anomalies</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT_MUTED }} />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm focus:outline-none"
                style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                <option value="all" style={{ background: '#111' }}>All Status</option>
                <option value="pending" style={{ background: '#111' }}>Pending</option>
                <option value="investigating" style={{ background: '#111' }}>Investigating</option>
                <option value="resolved" style={{ background: '#111' }}>Resolved</option>
              </select>
              <button className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC, background: 'none', border: 'none' }}>
                <Download className="w-4 h-4" /><span>Export</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['ID', 'Customer', 'Type', 'Amount', 'Severity', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[0.7rem] font-semibold tracking-[0.1em] uppercase" style={{ color: TEXT_SEC }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAnomalies.map((item, index) => (
                  <tr key={index} className="transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.id}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: TEXT_SEC }}>{item.customer}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: TEXT_SEC }}>{item.type}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${item.amount.toLocaleString()}</td>
                    <td className="py-4 px-4"><span className="px-3 py-1 rounded-full text-xs font-medium capitalize" style={getSeverityStyle(item.severity)}>{item.severity}</span></td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm capitalize" style={{ color: TEXT_SEC }}>{item.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm" style={{ color: TEXT_SEC }}>{item.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded transition-colors" style={{ background: 'none', border: 'none', color: TEXT_SEC }}><Eye className="w-4 h-4" /></button>
                        <button className="p-1 rounded transition-colors" style={{ background: 'none', border: 'none', color: TEXT_SEC }}><Flag className="w-4 h-4" /></button>
                      </div>
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

export default BillingAnomaly;
