const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // Yeni kaydolan herkes varsayılan olarak normal kullanıcı olur
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);