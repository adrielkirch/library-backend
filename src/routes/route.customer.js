const express = require("express");
const router = express.Router();
const userController = require("../controllers/controller.customer");

router.get("/", userController.findAll);

module.exports = router;