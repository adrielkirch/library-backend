const express = require("express");
const router = express.Router();
const orderController = require("../controllers/controller.order");

router.get("/", orderController.pagination);
router.get("/search", orderController.search);

module.exports = router;
