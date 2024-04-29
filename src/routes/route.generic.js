const express = require("express");
const router = express.Router();
const genericController = require("../controllers/controller.generic");

router.post("/", genericController.query);

module.exports = router;
