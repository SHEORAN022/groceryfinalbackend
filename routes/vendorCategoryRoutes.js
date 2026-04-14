// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ storage: multer.memoryStorage() });
// const vendorAuth = require("../middleware/vendorAuth");

// const {
//   createCategory,
//   getCategories,
//   updateCategory,
//   deleteCategory,
//   addSubCategory,
//   updateSubCategory,
//   deleteSubCategory,
// } = require("../controllers/vendorCategoryController");

// router.use(vendorAuth);

// /* ================= CATEGORY ROUTES ================= */
// router.post("/", upload.single("image"), createCategory);
// router.get("/", getCategories);
// router.put("/:id", upload.single("image"), updateCategory);
// router.delete("/:id", deleteCategory);

// /* ================= SUBCATEGORY ROUTES ================= */
// // POST /api/vendor/categories/:catId/sub
// router.post("/:catId/sub", upload.single("image"), addSubCategory);

// // PUT /api/vendor/categories/:catId/sub/:subId
// router.put("/:catId/sub/:subId", upload.single("image"), updateSubCategory);

// // DELETE /api/vendor/categories/:catId/sub/:subId
// router.delete("/:catId/sub/:subId", deleteSubCategory);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const vendorAuth = require("../middleware/vendorAuth");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/vendorCategoryController");

router.use(vendorAuth);

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
router.post("/:catId/sub", upload.single("image"), addSubCategory);
router.put("/:catId/sub/:subId", upload.single("image"), updateSubCategory);
router.delete("/:catId/sub/:subId", deleteSubCategory);

module.exports = router;