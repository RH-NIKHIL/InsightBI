const mongoose = require('mongoose');

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
  },
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
