const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createCategory, getCategories, updateCategory, deleteCategory,
  addSubcategory, updateSubcategory, deleteSubcategory,
  addSubSubcategory, updateSubSubcategory, deleteSubSubcategory,
} = require("../controllers/categoryController");

// ── Level 1: Category ───────────────────────────────────────
router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

// ── Level 2: Subcategory ────────────────────────────────────
router.post("/:id/sub", upload.single("image"), addSubcategory);
router.put("/:id/sub/:subId", upload.single("image"), updateSubcategory);
router.delete("/:id/sub/:subId", deleteSubcategory);

// ── Level 3: Sub-Subcategory (optional) ─────────────────────
router.post("/:id/sub/:subId/subsub", upload.single("image"), addSubSubcategory);
router.put("/:id/sub/:subId/subsub/:subSubId", upload.single("image"), updateSubSubcategory);
router.delete("/:id/sub/:subId/subsub/:subSubId", deleteSubSubcategory);

module.exports = router;
