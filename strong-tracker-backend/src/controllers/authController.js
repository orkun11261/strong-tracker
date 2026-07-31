const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Token Üretme Fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        message: 'Kullanıcı başarıyla oluşturuldu!',
      });
    } else {
      res.status(400).json({ message: 'Geçersiz kullanıcı verisi' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        message: 'Giriş başarılı!',
      });
    } else {
      res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Giriş yapmış kullanıcının kendi profilini getir
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Tüm kullanıcıları getir (Sadece Admin)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
};