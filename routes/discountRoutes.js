// const router = require("express").Router();
// const {
//   addDiscount,
//   getAllDiscounts,
//   updateDiscount,
//   deleteDiscount,
// } = require("../controllers/discountController");

// /* CREATE */
// router.post("/add", addDiscount);

// /* READ */
// router.get("/all", getAllDiscounts);

// /* UPDATE */
// router.put("/:id", updateDiscount);

// /* DELETE */
// router.delete("/:id", deleteDiscount);

// module.exports = router;


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