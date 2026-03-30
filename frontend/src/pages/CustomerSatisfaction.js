import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Users, Upload, Play, Download, RefreshCw, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info, ArrowLeft, LogOut
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { csatAPI } from '../services/api';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e0c873';
const GOLD_DARK = '#9e8338';
const TEXT_MUTED = '#605848';
const TEXT_SEC = '#a09888';

const tooltipStyle = { backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', color: '#f0ece4' };

const CustomerSatisfaction = () => {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    csatAPI.getData().then(data => setApiData(data)).catch(() => {});
  }, []);

  const satisfactionTrend = apiData?.satisfactionTrend || [
    { month: 'Jan', score: 78, predicted: 77 }, { month: 'Feb', score: 82, predicted: 80 },
    { month: 'Mar', score: 79, predicted: 81 }, { month: 'Apr', score: 85, predicted: 83 },
    { month: 'May', score: 88, predicted: 86 }, { month: 'Jun', score: 87, predicted: 88 },
  ];

  const categoryScores = apiData?.categoryScores || [
    { name: 'Product Quality', value: 92 }, { name: 'Customer Service', value: 85 },
    { name: 'Delivery Speed', value: 78 }, { name: 'Value for Money', value: 82 }, { name: 'Website Experience', value: 88 },
  ];

  const sentimentData = apiData?.sentimentData || [
    { name: 'Positive', value: 65, color: GOLD },
    { name: 'Neutral', value: 25, color: GOLD_DARK },
    { name: 'Negative', value: 10, color: TEXT_MUTED },
  ];

  const radarData = apiData?.radarData || [
    { subject: 'Quality', A: 92, fullMark: 100 }, { subject: 'Service', A: 85, fullMark: 100 },
    { subject: 'Speed', A: 78, fullMark: 100 }, { subject: 'Value', A: 82, fullMark: 100 },
    { subject: 'UX', A: 88, fullMark: 100 }, { subject: 'Trust', A: 90, fullMark: 100 },
  ];

  const predictions = apiData?.predictions || [
    { segment: 'Premium Customers', score: 92, trend: 'up', change: '+3%' },
    { segment: 'Regular Customers', score: 85, trend: 'up', change: '+1%' },
    { segment: 'New Customers', score: 78, trend: 'down', change: '-2%' },
    { segment: 'At-Risk Customers', score: 62, trend: 'down', change: '-5%' },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await csatAPI.analyze();
      setApiData(result.data);
    } catch (e) {}
    setIsAnalyzing(false);
  };

  const s = apiData?.stats || { overallScore: 87.5, responseRate: 68, npsScore: 45, atRisk: 124 };
  const stats = [
    { label: 'Overall Score', value: `${s.overallScore}%`, icon: <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />, change: '+2.3%', up: true },
    { label: 'Response Rate', value: `${s.responseRate}%`, icon: <Info className="w-5 h-5" style={{ color: TEXT_SEC }} />, change: '+5%', up: true },
    { label: 'NPS Score', value: `+${s.npsScore}`, icon: <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />, change: '+8', up: true },
    { label: 'At Risk', value: `${s.atRisk}`, icon: <AlertCircle className="w-5 h-5" style={{ color: GOLD }} />, change: '+12', up: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* User Top Bar */}
      <div className="sticky top-0 z-50 px-5 md:px-10 lg:px-[60px] py-4" style={{ background: 'rgba(6,6,6,0.9)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/user-dashboard" className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <Link to="/" className="flex flex-col items-center gap-[2px]">
            <span className="text-[1.3rem] font-normal tracking-[0.5em]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>INSIGHT</span>
            <span className="text-[0.45rem] tracking-[0.4em] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>USER PORTAL</span>
          </Link>
          <span className="text-sm hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
        </div>
      </div>

      <div className="pt-8 pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <Users className="w-7 h-7" style={{ color: '#060606' }} />
            </div>
            <div>
              <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 400 }}>Customer Satisfaction</h1>
              <p className="text-sm" style={{ color: TEXT_SEC }}>AI-powered satisfaction prediction and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /><span>Upload Data</span></button>
            <button onClick={handleAnalyze} className="btn-primary flex items-center gap-2" disabled={isAnalyzing}>
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-card)' }}>
          {['overview', 'predictions', 'segments', 'reports'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize"
              style={{
                background: activeTab === tab ? 'var(--surface)' : 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : TEXT_SEC,
                border: activeTab === tab ? '1px solid var(--border-subtle)' : '1px solid transparent',
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: TEXT_SEC }}>{s.label}</span>
                {s.icon}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{s.value}</span>
                <span className="text-sm flex items-center" style={{ color: s.up ? '#22c55e' : '#ef4444' }}>
                  {s.up ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}{s.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Satisfaction Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis dataKey="month" stroke={TEXT_MUTED} fontSize={12} />
                <YAxis stroke={TEXT_MUTED} fontSize={12} domain={[70, 95]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: TEXT_SEC, fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" name="Actual" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD }} />
                <Line type="monotone" dataKey="predicted" name="Predicted" stroke={TEXT_SEC} strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Sentiment Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {sentimentData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryScores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis type="number" domain={[0, 100]} stroke={TEXT_MUTED} fontSize={12} />
                <YAxis dataKey="name" type="category" stroke={TEXT_MUTED} fontSize={12} width={120} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill={GOLD} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Performance Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(201,168,76,0.15)" />
                <PolarAngleAxis dataKey="subject" stroke={TEXT_SEC} fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={TEXT_MUTED} fontSize={10} />
                <Radar name="Score" dataKey="A" stroke={GOLD} fill={GOLD} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictions Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Segment Predictions</h3>
            <button className="flex items-center gap-2 text-sm transition-colors" style={{ color: TEXT_SEC, background: 'none', border: 'none' }}>
              <Download className="w-4 h-4" /><span>Export</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Segment', 'Predicted Score', 'Trend', 'Change', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[0.7rem] font-semibold tracking-[0.1em] uppercase" style={{ color: TEXT_SEC }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((item, index) => (
                  <tr key={index} className="transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.segment}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                          <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: GOLD }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{item.trend === 'up' ? <TrendingUp className="w-5 h-5" style={{ color: '#22c55e' }} /> : <TrendingDown className="w-5 h-5" style={{ color: '#ef4444' }} />}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: item.trend === 'up' ? '#22c55e' : '#ef4444' }}>{item.change}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: item.score >= 80 ? 'rgba(34,197,94,0.15)' : item.score >= 70 ? 'rgba(201,168,76,0.15)' : 'rgba(239,68,68,0.15)',
                          color: item.score >= 80 ? '#4ade80' : item.score >= 70 ? GOLD : '#fca5a5',
                        }}>
                        {item.score >= 80 ? 'Healthy' : item.score >= 70 ? 'Monitor' : 'At Risk'}
                      </span>
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

export default CustomerSatisfaction;
