const mongoose = require('mongoose');


const exerciseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Egzersiz adı zorunludur'] 
  }, 
  targetSets: { 
    type: Number, 
    default: 3 
  }, 
  targetReps: { 
    type: Number, 
    default: 10 
  },
  notes: {
    type: String 
  }
});

const programSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    title: {
      type: String,
      required: [true, 'Program adı zorunludur'], 
    },
    exercises: [exerciseSchema], 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Program', programSchema);