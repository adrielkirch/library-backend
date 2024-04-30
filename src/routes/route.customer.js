const express = require("express");
const router = express.Router();
const userController = require("../controllers/controller.customer");



router.get("/", userController.pagination);
router.get("/search", userController.search);

module.exports = router;
