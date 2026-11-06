const express = require("express");
const router = express.Router();

const controller = require("../controllers/petController");

router.get("/", controller.getAllPets);
module.exports = router;
