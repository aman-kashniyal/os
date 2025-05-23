const Order = require('../models/Order');

class TaskScheduler {
  constructor() {
    this.readyQueue = [];
    this.runningQueue = [];
    this.waitingQueue = [];
    this.completedQueue = [];
    this.quantum = 5; // Time quantum for Round Robin in minutes
  }

  // Add a new order to the ready queue
  async addOrder(order) {
    this.readyQueue.push(order);
    await this.schedule();
  }

  // FCFS (First Come First Serve) Scheduling
  async fcfs() {
    if (this.readyQueue.length === 0) return;

    const order = this.readyQueue.shift();
    order.status = 'RUNNING';
    order.startTime = new Date();
    await order.save();

    this.runningQueue.push(order);
    return order;
  }

  // Priority Scheduling
  async priorityScheduling() {
    if (this.readyQueue.length === 0) return;

    // Sort by priority (higher number = higher priority)
    this.readyQueue.sort((a, b) => b.priority - a.priority);
    const order = this.readyQueue.shift();
    
    order.status = 'RUNNING';
    order.startTime = new Date();
    await order.save();

    this.runningQueue.push(order);
    return order;
  }

  // Round Robin Scheduling
  async roundRobin() {
    if (this.readyQueue.length === 0) return;

    const order = this.readyQueue.shift();
    order.status = 'RUNNING';
    order.startTime = new Date();
    await order.save();

    this.runningQueue.push(order);
    
    // Simulate time quantum
    setTimeout(async () => {
      if (order.status === 'RUNNING') {
        order.status = 'WAITING';
        order.contextSwitchCount++;
        await order.save();
        
        this.waitingQueue.push(order);
        this.runningQueue = this.runningQueue.filter(o => o._id !== order._id);
        await this.schedule();
      }
    }, this.quantum * 60 * 1000);

    return order;
  }

  // Complete an order
  async completeOrder(orderId) {
    const order = this.runningQueue.find(o => o._id.toString() === orderId);
    if (!order) return;

    order.status = 'COMPLETED';
    order.completionTime = new Date();
    order.totalTime = (order.completionTime - order.startTime) / (1000 * 60);
    await order.save();

    this.runningQueue = this.runningQueue.filter(o => o._id !== order._id);
    this.completedQueue.push(order);
    await this.schedule();
  }

  // Main scheduling method
  async schedule() {
    // Check for waiting processes that can be moved to ready queue
    const waitingOrders = await Order.find({ status: 'WAITING' });
    for (const order of waitingOrders) {
      order.status = 'READY';
      await order.save();
      this.readyQueue.push(order);
    }

    // If no running processes, start a new one
    if (this.runningQueue.length === 0 && this.readyQueue.length > 0) {
      // You can choose which scheduling algorithm to use here
      await this.priorityScheduling();
    }
  }

  // Get current state of all queues
  async getQueueState() {
    return {
      ready: this.readyQueue,
      running: this.runningQueue,
      waiting: this.waitingQueue,
      completed: this.completedQueue
    };
  }
}

module.exports = new TaskScheduler(); 