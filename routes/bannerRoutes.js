// routes/bannerRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const bannerController = require("../controllers/bannerController");
router.post(
  "/",
  upload.single("image"),
  bannerController.addBanner
);
router.get("/", bannerController.getBanners);
router.delete("/:id", bannerController.deleteBanner);
router.put("/toggle/:id", bannerController.toggleStatus);
router.put("/:id", upload.single("image"), bannerController.updateBanner);

module.exports = router;