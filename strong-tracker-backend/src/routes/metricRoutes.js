const express = require('express');
const router = express.Router();
const {
  getMetrics,
  createMetric,
  deleteMetric,
} = require('../controllers/metricController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getMetrics)
  .post(protect, createMetric);

router.route('/:id')
  .delete(protect, deleteMetric);

module.exports = router;