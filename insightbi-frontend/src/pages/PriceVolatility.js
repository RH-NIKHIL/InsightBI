import React, { useState, useEffect } from 'react';
import {
  DollarSign, Upload, Play, Download, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, Info, Activity, BarChart2
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { priceAPI } from '../services/api';

const GOLD = '#c9a84c';
const GOLD_DARK = '#9e8338';
const TEXT_MUTED = '#605848';
const TEXT_SEC = '#a09888';

const tooltipStyle = { backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', color: '#f0ece4' };

const PriceVolatility = () => {
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    priceAPI.getData().then(data => setApiData(data)).catch(() => {});
  }, []);

  const priceHistory = apiData?.priceHistory || [
    { date: 'Jan 1', price: 100, volatility: 2.5, predicted: 101 }, { date: 'Jan 8', price: 103, volatility: 3.2, predicted: 102 },
    { date: 'Jan 15', price: 98, volatility: 5.1, predicted: 100 }, { date: 'Jan 22', price: 105, volatility: 4.8, predicted: 103 },
    { date: 'Jan 29', price: 102, volatility: 3.5, predicted: 104 }, { date: 'Feb 5', price: 108, volatility: 2.9, predicted: 106 },
    { date: 'Feb 12', price: 112, volatility: 4.2, predicted: 109 }, { date: 'Feb 19', price: 107, volatility: 6.1, predicted: 110 },
    { date: 'Feb 26', price: 115, volatility: 3.8, predicted: 112 },
  ];

  const volatilityDistribution = apiData?.volatilityDistribution || [
    { range: '0-2%', count: 25 }, { range: '2-4%', count: 45 }, { range: '4-6%', count: 35 },
    { range: '6-8%', count: 18 }, { range: '8-10%', count: 8 }, { range: '>10%', count: 4 },
  ];

  const productVolatility = apiData?.productVolatility || [
    { product: 'Product A', currentPrice: 149.99, volatility: 3.2, risk: 'Low', trend: 'up' },
    { product: 'Product B', currentPrice: 89.99, volatility: 7.5, risk: 'High', trend: 'down' },
    { product: 'Product C', currentPrice: 249.99, volatility: 4.1, risk: 'Medium', trend: 'up' },
    { product: 'Product D', currentPrice: 59.99, volatility: 2.8, risk: 'Low', trend: 'stable' },
    { product: 'Product E', currentPrice: 199.99, volatility: 8.9, risk: 'High', trend: 'down' },
  ];

  const scatterData = apiData?.scatterData || [
    { x: 100, y: 3.2, z: 200 }, { x: 150, y: 5.5, z: 400 }, { x: 80, y: 2.1, z: 300 }, { x: 200, y: 7.8, z: 150 },
    { x: 120, y: 4.2, z: 350 }, { x: 180, y: 6.1, z: 280 }, { x: 90, y: 3.8, z: 420 }, { x: 160, y: 5.2, z: 180 },
  ];

  const mv = apiData?.metrics || { avgVolatility: 4.2, maxVolatility: 12.5, priceStability: 78, riskScore: 32 };
  const metrics = [
    { label: 'Avg Volatility', value: `${mv.avgVolatility}%`, change: '-0.8%', status: 'good' },
    { label: 'Max Volatility', value: `${mv.maxVolatility}%`, change: '+2.1%', status: 'warning' },
    { label: 'Price Stability', value: `${mv.priceStability}%`, change: '+3%', status: 'good' },
    { label: 'Risk Score', value: `${mv.riskScore}/100`, change: '-5', status: 'good' },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await priceAPI.analyze();
      setApiData(result.data);
    } catch (e) {}
    setIsAnalyzing(false);
  };

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'Low': return { background: 'rgba(34,197,94,0.15)', color: '#4ade80' };
      case 'Medium': return { background: 'rgba(201,168,76,0.15)', color: GOLD };
      case 'High': return { background: 'rgba(239,68,68,0.15)', color: '#fca5a5' };
      default: return { background: 'var(--surface)', color: TEXT_SEC };
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <DollarSign className="w-7 h-7" style={{ color: '#060606' }} />
            </div>
            <div>
              <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 400 }}>Price Volatility</h1>
              <p className="text-sm" style={{ color: TEXT_SEC }}>Monitor and predict price fluctuations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /><span>Upload Prices</span></button>
            <button onClick={handleAnalyze} className="btn-primary flex items-center gap-2" disabled={isAnalyzing}>
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Volatility'}</span>
            </button>
          </div>
        </div>

        {/* Alert */}
        <div className="rounded-xl p-4 mb-8 flex items-start gap-3" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
          <div>
            <h4 className="text-sm font-semibold" style={{ color: GOLD }}>High Volatility Alert</h4>
            <p className="text-sm" style={{ color: TEXT_SEC }}>Product B and Product E are showing increased price volatility. Consider reviewing pricing strategy.</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: TEXT_SEC }}>{m.label}</span>
                {m.status === 'good' ? <Activity className="w-5 h-5" style={{ color: '#22c55e' }} /> : <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{m.value}</span>
                <span className="text-sm" style={{ color: m.status === 'good' ? '#22c55e' : GOLD }}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Price & Volatility Trend</h3>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>Historical price movement with volatility overlay</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm focus:outline-none"
                style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                <option value="all" style={{ background: '#111' }}>All Products</option>
                <option value="a" style={{ background: '#111' }}>Product A</option>
                <option value="b" style={{ background: '#111' }}>Product B</option>
              </select>
              <button className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC, background: 'none', border: 'none' }}><Download className="w-4 h-4" /><span>Export</span></button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
              <XAxis dataKey="date" stroke={TEXT_MUTED} fontSize={12} />
              <YAxis yAxisId="left" stroke={TEXT_MUTED} fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke={TEXT_SEC} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: TEXT_SEC, fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="price" name="Actual Price" stroke={GOLD} strokeWidth={3} dot={{ fill: GOLD }} />
              <Line yAxisId="left" type="monotone" dataKey="predicted" name="Predicted" stroke={TEXT_SEC} strokeDasharray="5 5" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="volatility" name="Volatility %" stroke={GOLD_DARK} strokeWidth={2} dot={{ fill: GOLD_DARK }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Volatility Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volatilityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis dataKey="range" stroke={TEXT_MUTED} fontSize={12} />
                <YAxis stroke={TEXT_MUTED} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Price vs Volatility Correlation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                <XAxis type="number" dataKey="x" name="Price" stroke={TEXT_MUTED} fontSize={12} />
                <YAxis type="number" dataKey="y" name="Volatility" stroke={TEXT_MUTED} fontSize={12} />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
                <Scatter name="Products" data={scatterData} fill={GOLD} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" style={{ color: GOLD }} />
              <h3 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Product Volatility Analysis</h3>
            </div>
            <button className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC, background: 'none', border: 'none' }}><Download className="w-4 h-4" /><span>Export Report</span></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Product', 'Current Price', 'Volatility', 'Risk Level', 'Trend'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[0.7rem] font-semibold tracking-[0.1em] uppercase" style={{ color: TEXT_SEC }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productVolatility.map((item, index) => (
                  <tr key={index} className="transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.product}</td>
                    <td className="py-4 px-4 text-sm" style={{ color: TEXT_SEC }}>${item.currentPrice}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(item.volatility * 10, 100)}%`, background: item.volatility <= 4 ? '#22c55e' : item.volatility <= 7 ? GOLD : '#ef4444' }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.volatility}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4"><span className="px-3 py-1 rounded-full text-xs font-medium" style={getRiskStyle(item.risk)}>{item.risk}</span></td>
                    <td className="py-4 px-4">
                      {item.trend === 'up' ? <TrendingUp className="w-5 h-5" style={{ color: '#22c55e' }} /> :
                       item.trend === 'down' ? <TrendingDown className="w-5 h-5" style={{ color: '#ef4444' }} /> :
                       <div className="w-5 h-0.5" style={{ background: TEXT_SEC }} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceVolatility;
