const Program = require('../models/Program');


const getPrograms = async (req, res) => {
  try {
    
    const programs = await Program.find({ user: req.user._id });
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Programlar getirilirken hata oluştu', error: error.message });
  }
};


const createProgram = async (req, res) => {
  try {
    const { title, description, exercises } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Lütfen bir program başlığı girin' });
    }

    const program = await Program.create({
      user: req.user._id,
      title,
      description,
      exercises,
    });

    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Program oluşturulamadı', error: error.message });
  }
};


const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program bulunamadı' });
    }

    if (program.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    await program.deleteOne();
    res.status(200).json({ message: 'Program başarıyla silindi', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Program silinirken hata oluştu', error: error.message });
  }
};

module.exports = {
  getPrograms,
  createProgram,
  deleteProgram,
};