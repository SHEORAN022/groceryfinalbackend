// const express = require("express");
// const router  = express.Router();

// const upload          = require("../middleware/upload");
// const priceController = require("../controllers/priceController");
// const hsnController   = require("../controllers/hsnController");

// // ── Image upload config ──────────────────────────────────────
// const productImageUpload = upload.fields([
//   { name: "primaryImage",  maxCount: 1 },
//   { name: "galleryImages", maxCount: 5 },
// ]);

// /* ─── HSN ──────────────────────────────────────────────────── */
// router.get("/hsn-codes",       priceController.getHsnCodes);
// router.get("/hsn-codes/:code", priceController.getHsnByCode);

// // Custom HSN — Add / Get / Delete
// router.post("/hsn/add",   hsnController.createHsn);
// router.get("/hsn/custom", hsnController.getCustomHsn);
// router.delete("/hsn/:id", hsnController.deleteHsn);

// /* ─── Website ──────────────────────────────────────────────── */
// router.get("/website", priceController.getWebsitePrices);

// /* ─── Status ───────────────────────────────────────────────── */
// router.put("/status/:id", priceController.updateStatus);

// /* ─── Bulk ─────────────────────────────────────────────────── */
// router.post("/bulk-update", priceController.bulkUpdatePrices);

// /* ─── Copy ─────────────────────────────────────────────────── */
// router.post("/copy/:id", priceController.copyPrice);

// /* ─── Quick P/L ────────────────────────────────────────────── */
// router.put("/updateDiff/:id", priceController.updateDiff);

// /* ─── Import / Export ──────────────────────────────────────── */
// router.post("/import",          upload.single("file"), priceController.importPrices);
// router.get("/export",           priceController.exportPrices);
// router.post("/export-selected", priceController.exportSelected);
// router.post("/delete-selected", priceController.deleteSelected);

// /* ─── GST ──────────────────────────────────────────────────── */
// router.post("/set-gst",    priceController.setGST);
// router.get("/gst-list",    priceController.getGSTList);

// /* ─── Discounts ────────────────────────────────────────────── */
// router.post("/add-discount",  priceController.addDiscount);
// router.get("/discount-list",  priceController.getDiscountList);

// /* ─── CRUD (keep these last) ───────────────────────────────── */
// router.get("/",    priceController.getPrices);
// router.post("/",   productImageUpload, priceController.createPrice);
// router.put("/:id", productImageUpload, priceController.updatePrice);
// router.delete("/:id", priceController.deletePrice);

// module.exports = router;


const express = require("express");
const router  = express.Router();

const upload          = require("../middleware/upload");
const priceController = require("../controllers/priceController");
const hsnController   = require("../controllers/hsnController");

// ── Image upload config ──────────────────────────────────────
const productImageUpload = upload.fields([
  { name: "primaryImage",  maxCount: 1 },
  { name: "galleryImages", maxCount: 5 },
]);

/* ─── HSN ──────────────────────────────────────────────────── */
router.get("/hsn-codes",       priceController.getHsnCodes);
router.get("/hsn-codes/:code", priceController.getHsnByCode);

// Custom HSN — Add / Get / Delete
router.post("/hsn/add",   hsnController.createHsn);
router.get("/hsn/custom", hsnController.getCustomHsn);
router.delete("/hsn/:id", hsnController.deleteHsn);

/* ─── Brands ───────────────────────────────────────────────── */
router.get("/brands", priceController.getBrands);

/* ─── Website ──────────────────────────────────────────────── */
router.get("/website", priceController.getWebsitePrices);

/* ─── Status ───────────────────────────────────────────────── */
router.put("/status/:id", priceController.updateStatus);

/* ─── Bulk ─────────────────────────────────────────────────── */
router.post("/bulk-update", priceController.bulkUpdatePrices);

/* ─── Copy ─────────────────────────────────────────────────── */
router.post("/copy/:id", priceController.copyPrice);

/* ─── Quick P/L ────────────────────────────────────────────── */
router.put("/updateDiff/:id", priceController.updateDiff);

/* ─── Import / Export ──────────────────────────────────────── */
router.post("/import",          upload.single("file"), priceController.importPrices);
router.get("/export",           priceController.exportPrices);
router.post("/export-selected", priceController.exportSelected);
router.post("/delete-selected", priceController.deleteSelected);

/* ─── GST ──────────────────────────────────────────────────── */
router.post("/set-gst",    priceController.setGST);
router.get("/gst-list",    priceController.getGSTList);

/* ─── Discounts ────────────────────────────────────────────── */
router.post("/add-discount",  priceController.addDiscount);
router.get("/discount-list",  priceController.getDiscountList);

/* ─── CRUD (keep these last) ───────────────────────────────── */
router.get("/",    priceController.getPrices);
router.post("/",   productImageUpload, priceController.createPrice);
router.put("/:id", productImageUpload, priceController.updatePrice);
router.delete("/:id", priceController.deletePrice);

module.exports = router;