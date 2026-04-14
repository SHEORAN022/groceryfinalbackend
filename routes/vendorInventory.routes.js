const express = require("express");
const router = express.Router();
const vendorAuth = require("../middleware/vendorAuth");
const controller = require("../controllers/vendorInventory.controller");

router.use(vendorAuth);

router.get("/", controller.getInventory);
router.post("/", controller.upsertInventory);

module.exports = router;
