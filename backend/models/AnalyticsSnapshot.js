const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ['customerSatisfaction', 'demandForecast', 'priceVolatility', 'billingAnomaly'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
