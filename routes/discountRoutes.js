const router = require("express").Router();
const {
  addDiscount,
  getAllDiscounts,
  getByProduct,
  updateDiscount,
  deleteDiscount,
  deleteByProduct,
} = require("../controllers/discountController");


router.post("/add", addDiscount);


router.get("/all", getAllDiscounts);


router.get("/product/:productId", getByProduct);


router.put("/:id", updateDiscount);


router.delete("/:id", deleteDiscount);


router.delete("/product/:productId", deleteByProduct);

module.exports = router;