const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      required: [true, 'Lütfen kilo bilgisini girin (KG cinsinden)'],
    },
    bodyFat: {
      type: Number,
    },
    measurements: {
      chest: { type: Number }, 
      arms: { type: Number },  
      waist: { type: Number }, 
      hips: { type: Number },  
      shoulders: { type: Number },
      thighs: { type: Number },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Metric', metricSchema);