const express = require("express");
const router = express.Router();

const controller = require("../controllers/badgeController");
router.get("/", controller.getAllBadges);

module.exports = router;
