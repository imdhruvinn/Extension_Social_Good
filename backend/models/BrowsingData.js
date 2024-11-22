const mongoose = require("mongoose");

const BrowsingDataSchema = new mongoose.Schema({
  uid: {
    type: String,
    scrapedContent: String,
    unique: true,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BrowsingData", BrowsingDataSchema);
