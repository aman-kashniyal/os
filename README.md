# Cafe OS Simulator

A full-stack Cafe Management System that simulates Operating System concepts such as task scheduling, process management, and inter-process communication.

## Features

### OS Concepts Simulation
- Task Scheduling (FCFS, Round-Robin, Priority Scheduling)
- Process Management (Ready, Running, Waiting, Completed states)
- Resource Synchronization
- Inter-Process Communication

### Core Functionality
- Menu Management
- Staff Management
- Order Processing
- Real-time Kitchen Simulation
- Performance Analytics

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO for real-time updates
- JWT for authentication

### Frontend (Coming Soon)
- React.js
- Material-UI
- Redux for state management
- Socket.IO client

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cafe-os-simulator.git
cd cafe-os-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafe-os-simulator
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/staff/register - Register new staff member
- POST /api/staff/login - Staff login

### Menu Management
- GET /api/menu - Get all menu items
- POST /api/menu - Create new menu item
- PUT /api/menu/:id - Update menu item
- DELETE /api/menu/:id - Delete menu item

### Order Management
- POST /api/orders - Create new order
- GET /api/orders - Get all orders
- GET /api/orders/:id - Get order by ID
- PATCH /api/orders/:id/status - Update order status

### Staff Management
- GET /api/staff - Get all staff members
- GET /api/staff/:id - Get staff by ID
- PUT /api/staff/:id - Update staff member
- DELETE /api/staff/:id - Delete staff member

## OS Concepts Implementation

### Task Scheduling
- FCFS (First Come First Serve)
- Round Robin with time quantum
- Priority-based scheduling

### Process States
- READY: Order is created and waiting to be processed
- RUNNING: Order is being prepared
- WAITING: Order is paused or waiting for resources
- COMPLETED: Order is finished
- TERMINATED: Order is cancelled

### Resource Management
- Kitchen stations as shared resources
- Staff members as processors
- Order queue management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 