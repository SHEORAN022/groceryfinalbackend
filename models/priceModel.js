const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: {
    type: String,
    enum: ["kg", "gm", "ltr", "ml", "pcs"],
    required: true,
  },
});

const discountSchema = new mongoose.Schema({
  minQty:          { type: Number, required: true },
  maxQty:          { type: Number, required: true },
  discountPercent: { type: Number, required: true },
});

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  subcategory: {
    id:    { type: String },
    name:  { type: String },
    image: { type: String },
  },

  subSubcategory: {
    id:    { type: String, default: null },
    name:  { type: String, default: null },
    image: { type: String, default: null },
  },

  brand: { type: String, default: "" },

  weight: {
    type: weightSchema,
    required: true,
    default: { value: 1, unit: "kg" },
  },

  basePrice:  { type: Number, required: true },
  profitLoss: { type: Number, default: 0 },
  salePrice:  { type: Number, default: 0 },

  lockedPrice:   { type: Number, default: 0 },
  yesterdayLock: { type: Number, default: 0 },
  brokerDisplay: { type: Number, default: 0 },

  lastLockDate: { type: String, default: "" },
  validTill:    Date,
  description:  String,

  // Primary image
  image: { type: String, default: "" },

  // Gallery images — max 5 (matches route maxCount: 5)
  galleryImages: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 5,
      message: "Gallery can have at most 5 images.",
    },
  },

  /* ── GST ── */
  gstPercent: { type: Number, default: 0 },
  hsnCode:    { type: String, default: "" },
  taxType: {
    type: String,
    enum: ["cgst_sgst", "igst"],
    default: "cgst_sgst",
  },

  /* ── Quantity Discounts ── */
  discounts: [discountSchema],

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Price", priceSchema);