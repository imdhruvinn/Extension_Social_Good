const express = require("express");
const router = express.Router();
const cookiesController = require("../controllers/cookiesController");

router.post("/cookies-consent", cookiesController.saveCookiesConsent);
router.get("/cookies-consent/:uid", cookiesController.getCookiesConsent);

module.exports = router;
