const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'admin123'
  },
  password: {
    type: String,
    required: true,
    default: 'admin@123'
  },
  name: {
    type: String,
    default: 'System Administrator'
  },
  email: {
    type: String,
    default: 'admin@jobzee.com'
  },
  role: {
    type: String,
    default: 'super_admin'
  },
  permissions: {
    userManagement: { type: Boolean, default: true },
    employerManagement: { type: Boolean, default: true },
    jobManagement: { type: Boolean, default: true },
    analytics: { type: Boolean, default: true },
    systemSettings: { type: Boolean, default: true },
    planManagement: { type: Boolean, default: true },
    paymentManagement: { type: Boolean, default: true }
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
