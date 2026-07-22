const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lütfen adınızı giriniz'],
    },
    email: {
      type: String,
      required: [true, 'Lütfen e-posta adresinizi giriniz'],
      unique: true, 
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Lütfen şifrenizi giriniz'],
      minlength: 6,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('User', userSchema);