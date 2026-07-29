const Metric = require('../models/Metric');

const getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Ölçümler getirilemedi', error: error.message });
  }
};

const createMetric = async (req, res) => {
  try {
    const { weight, bodyFat, measurements, notes, date } = req.body;

    if (!weight) {
      return res.status(400).json({ message: 'Kilo alanı zorunludur' });
    }

    const newMetric = await Metric.create({
      user: req.user._id,
      weight,
      bodyFat,
      measurements,
      notes,
      date: date || Date.now(),
    });

    res.status(201).json(newMetric);
  } catch (error) {
    res.status(500).json({ message: 'Ölçüm kaydedilemedi', error: error.message });
  }
};

const deleteMetric = async (req, res) => {
  try {
    const metric = await Metric.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({ message: 'Kayıt bulunamadı' });
    }

    if (metric.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    await metric.deleteOne();
    res.status(200).json({ message: 'Ölçüm kaydı silindi', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt silinirken hata oluştu', error: error.message });
  }
};

module.exports = {
  getMetrics,
  createMetric,
  deleteMetric,
};