const router = require("express").Router();
const { getPublicPricing } = require("../controllers/publicPricingController");


router.get("/pricing/:productId", getPublicPricing);

module.exports = router;