const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Antrenman programları listelendi' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Yeni antrenman programı eklendi' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `${req.params.id} ID'li program detayı` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `${req.params.id} ID'li program güncellendi` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `${req.params.id} ID'li program silindi` });
});

module.exports = router;