const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const menuController = require('../controllers/menuController');
const staffController = require('../controllers/staffController');

// Middleware for authentication
const auth = require('../middleware/auth');

// Order routes
router.post('/orders', auth, orderController.createOrder);
router.get('/orders', auth, orderController.getOrders);
router.get('/orders/:id', auth, orderController.getOrderById);
router.patch('/orders/:id/status', auth, orderController.updateOrderStatus);
router.get('/orders/queue/state', auth, orderController.getQueueState);
router.get('/orders/stats', auth, orderController.getOrderStats);

// Menu routes
router.post('/menu', auth, menuController.createMenuItem);
router.get('/menu', menuController.getMenuItems);
router.get('/menu/:id', menuController.getMenuItemById);
router.put('/menu/:id', auth, menuController.updateMenuItem);
router.delete('/menu/:id', auth, menuController.deleteMenuItem);
router.get('/menu/category/:category', menuController.getMenuItemsByCategory);
router.patch('/menu/:id/availability', auth, menuController.updateMenuItemAvailability);

// Staff routes
router.post('/staff/register', auth, staffController.registerStaff);
router.post('/staff/login', staffController.loginStaff);
router.get('/staff', auth, staffController.getStaffMembers);
router.get('/staff/:id', auth, staffController.getStaffById);
router.put('/staff/:id', auth, staffController.updateStaff);
router.delete('/staff/:id', auth, staffController.deleteStaff);
router.get('/staff/:id/performance', auth, staffController.getStaffPerformance);

module.exports = router; 