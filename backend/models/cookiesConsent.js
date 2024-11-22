const mongoose = require("mongoose");

const CookiesConsentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  consent: {
    type: String,
    required: true,
    enum: ["accepted", "rejected"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CookiesConsent", CookiesConsentSchema);
