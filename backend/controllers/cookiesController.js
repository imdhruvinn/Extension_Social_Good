// controllers/cookiesController.js
const CookiesConsent = require("../models/CookiesConsent");

exports.saveCookiesConsent = async (req, res) => {
  console.log("Received cookie consent from frontend:", req.body);

  try {
    let { uid, consent } = req.body;

    // Ensure uid is a string
    uid = String(uid);

    if (!uid || consent === undefined) {
      return res.status(400).json({ message: "UID and consent are required" });
    }

    // Check if consent already exists for this UID and update if necessary
    const existingConsent = await CookiesConsent.findOne({ uid });
    if (existingConsent) {
      existingConsent.consent = consent;
      await existingConsent.save();
      console.log("Cookie consent updated successfully in MongoDB");
      return res.status(200).json({ message: "Cookie consent updated successfully" });
    }

    // Save new consent if none exists for this UID
    const newConsent = new CookiesConsent({ uid, consent });
    await newConsent.save();

    console.log("Cookie consent saved successfully to MongoDB");
    res.status(201).json({ message: "Cookie consent saved successfully" });
  } catch (err) {
    console.error("Error saving cookie consent to MongoDB:", err.message, err.stack);
    res.status(500).json({
      message: "Error saving cookie consent to MongoDB",
      error: err.message,
    });
  }
};

exports.getCookiesConsent = async (req, res) => {
  let { uid } = req.params;

  // Ensure uid is a string
  uid = String(uid);

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    const cookiesConsent = await CookiesConsent.findOne({ uid });
    if (!cookiesConsent) {
      return res.status(404).json({ message: "No consent found for this UID" });
    }

    res.status(200).json(cookiesConsent);
  } catch (err) {
    console.error("Error retrieving cookie consent from MongoDB:", err.message, err.stack);
    res.status(500).json({
      message: "Error retrieving cookie consent from MongoDB",
      error: err.message,
    });
  }
};

// This new method checks if the user rejected consent
exports.checkConsentStatus = async (req, res) => {
  let { uid } = req.params;

  // Ensure uid is a string
  uid = String(uid);

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    const cookiesConsent = await CookiesConsent.findOne({ uid });
    if (!cookiesConsent || cookiesConsent.consent === false) {
      return res.status(403).json({ message: "Consent rejected, extension will not install." });
    }

    res.status(200).json({ message: "Consent granted, extension can proceed." });
  } catch (err) {
    console.error("Error retrieving consent status from MongoDB:", err.message, err.stack);
    res.status(500).json({
      message: "Error retrieving consent status from MongoDB",
      error: err.message,
    });
  }
};
