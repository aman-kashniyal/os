const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage']
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 1,
    comment: 'Time in minutes'
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
    comment: 'Priority level for scheduling (1-5)'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema); 