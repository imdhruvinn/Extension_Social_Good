const express = require("express");
const router = express.Router();
const browsingController = require("../controllers/browsingController");

// Route to save browsing data
router.post("/browsing-data", browsingController.saveBrowsingData);

// Route to get browsing data for a user by UID
router.get("/browsing-data/:uid", browsingController.getBrowsingDataByUser);

module.exports = router;
