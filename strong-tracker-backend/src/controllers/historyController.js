const History = require('../models/History');

const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .populate('program', 'title') 
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Geçmiş antrenmanlar getirilemedi', error: error.message });
  }
};

const createHistory = async (req, res) => {
  try {
    const workoutTitle = req.body.workoutTitle || req.body.workoutName;
    const exercisesData = req.body.completedExercises || req.body.exercises;
    const { program, notes } = req.body;

    if (!workoutTitle || !exercisesData || exercisesData.length === 0) {
      return res.status(400).json({ message: 'Lütfen antrenman adını ve yapılan egzersizleri girin' });
    }

    const newHistory = await History.create({
      user: req.user._id,
      program: program || null,
      workoutTitle,
      completedExercises: exercisesData,
      notes,
    });

    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ message: 'Antrenman geçmişi kaydedilemedi', error: error.message });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const historyItem = await History.findById(req.params.id);

    if (!historyItem) {
      return res.status(404).json({ message: 'Kayıt bulunamadı' });
    }

    if (historyItem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    await historyItem.deleteOne();
    res.status(200).json({ message: 'Antrenman kaydı silindi', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt silinirken hata oluştu', error: error.message });
  }
};

module.exports = {
  getHistory,
  createHistory,
  deleteHistory,
};