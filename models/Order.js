const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  status: {
    type: String,
    required: true,
    enum: ['READY', 'RUNNING', 'WAITING', 'COMPLETED', 'TERMINATED'],
    default: 'READY'
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  assignedChef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  startTime: {
    type: Date
  },
  completionTime: {
    type: Date
  },
  totalTime: {
    type: Number,
    comment: 'Total processing time in minutes'
  },
  processId: {
    type: String,
    unique: true
  },
  contextSwitchCount: {
    type: Number,
    default: 0
  },
  waitingTime: {
    type: Number,
    default: 0,
    comment: 'Time spent in waiting queue (minutes)'
  }
}, {
  timestamps: true
});

// Method to calculate turnaround time
orderSchema.methods.calculateTurnaroundTime = function() {
  if (this.completionTime && this.startTime) {
    return (this.completionTime - this.startTime) / (1000 * 60); // Convert to minutes
  }
  return null;
};

module.exports = mongoose.model('Order', orderSchema); 