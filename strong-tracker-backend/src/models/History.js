const mongoose = require('mongoose');


const completedSetSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true }, 
  weight: { type: Number, required: true },    
  reps: { type: Number, required: true },      
});


const completedExerciseSchema = new mongoose.Schema({
  exerciseName: { 
    type: String, 
    required: true 
  }, 
  sets: [completedSetSchema], 
});

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workoutTitle: {
      type: String,
      required: true, 
    },
    completedExercises: [completedExerciseSchema],
    date: {
      type: Date,
      default: Date.now, 
    },
    notes: {
      type: String, 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('History', historySchema);