const AnalyticsSnapshot = require('./models/AnalyticsSnapshot');

const analyticsData = {
  customerSatisfaction: {
    stats: {
      overallScore: 87.5,
      responseRate: 68,
      npsScore: 45,
      atRisk: 124,
    },
    satisfactionTrend: [
      { month: 'Jan', score: 78, predicted: 77 },
      { month: 'Feb', score: 82, predicted: 80 },
      { month: 'Mar', score: 79, predicted: 81 },
      { month: 'Apr', score: 85, predicted: 83 },
      { month: 'May', score: 88, predicted: 86 },
      { month: 'Jun', score: 87, predicted: 88 },
    ],
    categoryScores: [
      { name: 'Product Quality', value: 92 },
      { name: 'Customer Service', value: 85 },
      { name: 'Delivery Speed', value: 78 },
      { name: 'Value for Money', value: 82 },
      { name: 'Website Experience', value: 88 },
    ],
    sentimentData: [
      { name: 'Positive', value: 65, color: '#c9a84c' },
      { name: 'Neutral', value: 25, color: '#9e8338' },
      { name: 'Negative', value: 10, color: '#605848' },
    ],
    radarData: [
      { subject: 'Quality', A: 92, fullMark: 100 },
      { subject: 'Service', A: 85, fullMark: 100 },
      { subject: 'Speed', A: 78, fullMark: 100 },
      { subject: 'Value', A: 82, fullMark: 100 },
      { subject: 'UX', A: 88, fullMark: 100 },
      { subject: 'Trust', A: 90, fullMark: 100 },
    ],
    predictions: [
      { segment: 'Premium Customers', score: 92, trend: 'up', change: '+3%' },
      { segment: 'Regular Customers', score: 85, trend: 'up', change: '+1%' },
      { segment: 'New Customers', score: 78, trend: 'down', change: '-2%' },
      { segment: 'At-Risk Customers', score: 62, trend: 'down', change: '-5%' },
    ],
  },

  demandForecast: {
    metrics: {
      forecastAccuracy: 94.2,
      mae: 145,
      rmse: 203,
      totalForecast: 18400,
    },
    demandData: [
      { month: 'Jan', actual: 4200, predicted: 4100, lower: 3800, upper: 4400 },
      { month: 'Feb', actual: 3800, predicted: 3900, lower: 3600, upper: 4200 },
      { month: 'Mar', actual: 5100, predicted: 4900, lower: 4600, upper: 5200 },
      { month: 'Apr', actual: 4700, predicted: 4800, lower: 4500, upper: 5100 },
      { month: 'May', actual: 5500, predicted: 5400, lower: 5100, upper: 5700 },
      { month: 'Jun', actual: 5800, predicted: 5700, lower: 5400, upper: 6000 },
      { month: 'Jul', actual: null, predicted: 6100, lower: 5700, upper: 6500 },
      { month: 'Aug', actual: null, predicted: 6400, lower: 6000, upper: 6800 },
      { month: 'Sep', actual: null, predicted: 5900, lower: 5500, upper: 6300 },
    ],
    categoryDemand: [
      { category: 'Electronics', current: 2500, forecast: 2800, change: 12 },
      { category: 'Clothing', current: 1800, forecast: 2100, change: 17 },
      { category: 'Food & Beverages', current: 3200, forecast: 3400, change: 6 },
      { category: 'Home & Garden', current: 1200, forecast: 1100, change: -8 },
      { category: 'Sports', current: 800, forecast: 950, change: 19 },
    ],
    seasonalTrends: [
      { week: 'W1', demand: 1200 }, { week: 'W2', demand: 1350 },
      { week: 'W3', demand: 1100 }, { week: 'W4', demand: 1450 },
      { week: 'W5', demand: 1600 }, { week: 'W6', demand: 1380 },
      { week: 'W7', demand: 1520 }, { week: 'W8', demand: 1700 },
    ],
  },

  priceVolatility: {
    metrics: {
      avgVolatility: 4.2,
      maxVolatility: 12.5,
      priceStability: 78,
      riskScore: 32,
    },
    priceHistory: [
      { date: 'Jan 1', price: 100, volatility: 2.5, predicted: 101 },
      { date: 'Jan 8', price: 103, volatility: 3.2, predicted: 102 },
      { date: 'Jan 15', price: 98, volatility: 5.1, predicted: 100 },
      { date: 'Jan 22', price: 105, volatility: 4.8, predicted: 103 },
      { date: 'Jan 29', price: 102, volatility: 3.5, predicted: 104 },
      { date: 'Feb 5', price: 108, volatility: 2.9, predicted: 106 },
      { date: 'Feb 12', price: 112, volatility: 4.2, predicted: 109 },
      { date: 'Feb 19', price: 107, volatility: 6.1, predicted: 110 },
      { date: 'Feb 26', price: 115, volatility: 3.8, predicted: 112 },
    ],
    volatilityDistribution: [
      { range: '0-2%', count: 25 }, { range: '2-4%', count: 45 },
      { range: '4-6%', count: 35 }, { range: '6-8%', count: 18 },
      { range: '8-10%', count: 8 }, { range: '>10%', count: 4 },
    ],
    productVolatility: [
      { product: 'Product A', currentPrice: 149.99, volatility: 3.2, risk: 'Low', trend: 'up' },
      { product: 'Product B', currentPrice: 89.99, volatility: 7.5, risk: 'High', trend: 'down' },
      { product: 'Product C', currentPrice: 249.99, volatility: 4.1, risk: 'Medium', trend: 'up' },
      { product: 'Product D', currentPrice: 59.99, volatility: 2.8, risk: 'Low', trend: 'stable' },
      { product: 'Product E', currentPrice: 199.99, volatility: 8.9, risk: 'High', trend: 'down' },
    ],
    scatterData: [
      { x: 100, y: 3.2, z: 200 }, { x: 150, y: 5.5, z: 400 },
      { x: 80, y: 2.1, z: 300 }, { x: 200, y: 7.8, z: 150 },
      { x: 120, y: 4.2, z: 350 }, { x: 180, y: 6.1, z: 280 },
      { x: 90, y: 3.8, z: 420 }, { x: 160, y: 5.2, z: 180 },
    ],
  },

  billingAnomaly: {
    metrics: {
      totalAnomalies: 156,
      resolvedToday: 42,
      revenueImpact: 45200,
      detectionRate: 98.5,
    },
    anomalyTrend: [
      { date: 'Mon', detected: 12, resolved: 10 },
      { date: 'Tue', detected: 8, resolved: 7 },
      { date: 'Wed', detected: 15, resolved: 12 },
      { date: 'Thu', detected: 6, resolved: 6 },
      { date: 'Fri', detected: 18, resolved: 14 },
      { date: 'Sat', detected: 4, resolved: 4 },
      { date: 'Sun', detected: 3, resolved: 2 },
    ],
    anomalyTypes: [
      { name: 'Duplicate Charges', value: 35, color: '#c9a84c' },
      { name: 'Missing Payments', value: 25, color: '#e0c873' },
      { name: 'Incorrect Amount', value: 20, color: '#9e8338' },
      { name: 'Late Billing', value: 12, color: '#a09888' },
      { name: 'Other', value: 8, color: '#605848' },
    ],
    severityData: [
      { severity: 'Critical', count: 5 },
      { severity: 'High', count: 12 },
      { severity: 'Medium', count: 28 },
      { severity: 'Low', count: 45 },
    ],
    recentAnomalies: [
      { id: 'ANM-001', customer: 'Acme Corp', type: 'Duplicate Charge', amount: 1250.00, severity: 'high', status: 'pending', date: '2024-01-15' },
      { id: 'ANM-002', customer: 'Tech Solutions', type: 'Missing Payment', amount: 3500.00, severity: 'critical', status: 'investigating', date: '2024-01-15' },
      { id: 'ANM-003', customer: 'Global Inc', type: 'Incorrect Amount', amount: 450.00, severity: 'medium', status: 'resolved', date: '2024-01-14' },
      { id: 'ANM-004', customer: 'StartUp LLC', type: 'Late Billing', amount: 890.00, severity: 'low', status: 'pending', date: '2024-01-14' },
      { id: 'ANM-005', customer: 'Enterprise Co', type: 'Duplicate Charge', amount: 2100.00, severity: 'high', status: 'resolved', date: '2024-01-13' },
      { id: 'ANM-006', customer: 'Digital Corp', type: 'Missing Payment', amount: 5200.00, severity: 'critical', status: 'pending', date: '2024-01-13' },
    ],
  },
};

const seedAnalytics = async () => {
  const types = Object.keys(analyticsData);
  for (const type of types) {
    const existing = await AnalyticsSnapshot.findOne({ type });
    if (!existing) {
      await AnalyticsSnapshot.create({ type, data: analyticsData[type] });
      console.log(`   ✅ Seeded analytics: ${type}`);
    } else {
      console.log(`   ℹ️  Analytics already exists: ${type}`);
    }
  }
};

module.exports = seedAnalytics;
