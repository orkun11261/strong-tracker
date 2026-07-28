const express = require('express');
const router = express.Router();
const {
  getHistory,
  createHistory,
  deleteHistory,
} = require('../controllers/historyController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getHistory)
  .post(protect, createHistory);

router.route('/:id')
  .delete(protect, deleteHistory);

module.exports = router;