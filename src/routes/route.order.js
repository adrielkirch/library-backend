const express = require("express");
const router = express.Router();
const orderController = require("../controllers/controller.order");

router.get("/", orderController.findAll);

module.exports = router;
