// const express = require("express");
// const router = express.Router();

// // ✅ Apna actual authMiddleware use karo
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// const {
//   getAllVendorCategories,
//   approveCategory,
//   rejectCategory,
// } = require("../controllers/adminCategoryController");

// router.get("/categories", protect, adminOnly, getAllVendorCategories);
// router.put("/categories/:id/approve", protect, adminOnly, approveCategory);
// router.put("/categories/:id/reject", protect, adminOnly, rejectCategory);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getAllVendorCategories,
  approveCategory,
  rejectCategory,
  getCategoryDetail,
  deleteCategory,
} = require("../controllers/adminCategoryController");

// GET all categories (with ?status=pending / approved / rejected)
router.get("/categories", protect, adminOnly, getAllVendorCategories);

// GET single category detail
router.get("/categories/:id", protect, adminOnly, getCategoryDetail);

// APPROVE
router.put("/categories/:id/approve", protect, adminOnly, approveCategory);

// REJECT
router.put("/categories/:id/reject", protect, adminOnly, rejectCategory);

// DELETE
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

module.exports = router;
