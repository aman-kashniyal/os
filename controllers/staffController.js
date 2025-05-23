const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');

// Register new staff member
exports.registerStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff member already exists' });
    }

    const staff = new Staff({
      name,
      email,
      password,
      role
    });

    await staff.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Staff registered successfully',
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login staff member
exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find staff member
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check password
    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all staff members
exports.getStaffMembers = async (req, res) => {
  try {
    const staff = await Staff.find().select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff member
exports.updateStaff = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff performance metrics
exports.getStaffPerformance = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select('performance')
      .populate('currentTask');

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json({
      performance: staff.performance,
      currentTask: staff.currentTask
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 