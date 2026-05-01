const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/advertisingBannerController");

/* ADD */
router.post("/", upload.single("image"), controller.addAdvertisingBanner);

/* GET */
router.get("/", controller.getAdvertisingBanners);

/* DELETE */
router.delete("/:id", controller.deleteAdvertisingBanner);

/* TOGGLE */
router.put("/toggle/:id", controller.toggleAdvertisingBanner);

/* UPDATE */
router.put("/:id", upload.single("image"), controller.updateAdvertisingBanner);

module.exports = router;