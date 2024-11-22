const mongoose = require("mongoose");

const EmotionSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  emotions: {
    sadness: { type: Number, required: true },
    anger: { type: Number, required: true },
    disgust: { type: Number, required: true },
    joy: { type: Number, required: true },
    fear: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Emotion", EmotionSchema);
