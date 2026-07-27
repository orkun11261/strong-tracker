const express = require('express');
const router = express.Router();
const {
  getPrograms,
  createProgram,
  deleteProgram,
} = require('../controllers/programController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getPrograms).post(protect, createProgram);
router.route('/:id').delete(protect, deleteProgram);

module.exports = router;