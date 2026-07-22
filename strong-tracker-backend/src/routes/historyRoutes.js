const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: 'Antrenman geçmişi listelendi' });
});


router.post('/', (req, res) => {
  res.json({ message: 'Tamamlanan antrenman geçmişe kaydedildi' });
});


router.delete('/:id', (req, res) => {
  res.json({ message: `${req.params.id} ID'li antrenman kaydı silindi` });
});

module.exports = router;