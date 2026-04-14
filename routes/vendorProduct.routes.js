// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// /* ================= MULTER (MEMORY) ================= */
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// /* ================= AUTH ================= */
// const vendorAuth = require("../middleware/vendorAuth");

// /* ================= CONTROLLER ================= */
// const vendorProductController = require("../controllers/vendorProduct.controller");

// /* ======================================================
//       ALL ROUTES PROTECTED (VENDOR ONLY)
// ====================================================== */
// router.use(vendorAuth);

// /* ➕ CREATE PRODUCT */
// router.post("/", upload.single("file"), vendorProductController.createProduct);

// /* 📦 GET MY PRODUCTS */
// router.get("/", vendorProductController.getMyProducts);

// /* 🌳 TREE RESPONSE */
// router.get("/tree", vendorProductController.getVendorProductsTree);

// /* ✏️ UPDATE PRODUCT */
// router.put("/:id", upload.single("file"), vendorProductController.updateProduct);

// /* ❌ DELETE PRODUCT */
// router.delete("/:id", vendorProductController.deleteProduct);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const vendorAuth = require("../middleware/vendorAuth");
const ctrl = require("../controllers/vendorProduct.controller");

/* ALL ROUTES PROTECTED */
router.use(vendorAuth);

/* ─── GET ─── */
router.get("/",        ctrl.getMyProducts);
router.get("/tree",    ctrl.getVendorProductsTree);
router.get("/export",  ctrl.exportProducts);

/* ─── POST ─── */
router.post("/",              upload.single("file"), ctrl.createProduct);
router.post("/import",        upload.single("file"), ctrl.importProducts);
router.post("/bulk-update",   ctrl.bulkUpdateProducts);
router.post("/delete-selected", ctrl.deleteSelected);
router.post("/export-selected", ctrl.exportSelected);
router.post("/copy/:id",      ctrl.copyProduct);

/* ─── PUT ─── */
router.put("/status/:id", ctrl.updateStatus);
router.put("/:id",        upload.single("file"), ctrl.updateProduct);

/* ─── DELETE ─── */
router.delete("/:id", ctrl.deleteProduct);

module.exports = router;