const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const taskScheduler = require('../services/TaskScheduler');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    // Validate items and calculate total time
    let totalTime = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItem} not found` });
      }
      totalTime += menuItem.preparationTime * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;
    
    // Create order
    const order = new Order({
      orderNumber,
      items,
      totalTime,
      processId: `PROC${Date.now()}`,
      status: 'READY'
    });

    await order.save();
    
    // Add to scheduler
    await taskScheduler.addOrder(order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem')
      .populate('assignedChef');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('assignedChef');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    
    if (status === 'COMPLETED') {
      order.completionTime = new Date();
      order.totalTime = (order.completionTime - order.startTime) / (1000 * 60);
      await taskScheduler.completeOrder(order._id);
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get queue state
exports.getQueueState = async (req, res) => {
  try {
    const queueState = await taskScheduler.getQueueState();
    res.json(queueState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProcessingTime: { $avg: '$totalTime' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'COMPLETED' });
    
    res.json({
      statusBreakdown: stats,
      totalOrders,
      completedOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 