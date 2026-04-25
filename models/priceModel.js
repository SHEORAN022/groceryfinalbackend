// const mongoose = require("mongoose");

// const weightSchema = new mongoose.Schema({
//   value: { type: Number, required: true },
//   unit: {
//     type: String,
//     enum: ["kg", "gm", "ltr", "ml", "pcs"],
//     required: true,
//   },
// });

// const discountSchema = new mongoose.Schema({
//   minQty:          { type: Number, required: true },
//   maxQty:          { type: Number, required: true },
//   discountPercent: { type: Number, required: true },
// });

// const priceSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true,
//   },

//   subcategory: {
//     id:    { type: String },
//     name:  { type: String },
//     image: { type: String },
//   },

//   subSubcategory: {
//     id:    { type: String, default: null },
//     name:  { type: String, default: null },
//     image: { type: String, default: null },
//   },

//   brand: { type: String, default: "" },

//   weight: {
//     type: weightSchema,
//     required: true,
//     default: { value: 1, unit: "kg" },
//   },

//   basePrice:  { type: Number, required: true },
//   profitLoss: { type: Number, default: 0 },
//   salePrice:  { type: Number, default: 0 },

//   lockedPrice:   { type: Number, default: 0 },
//   yesterdayLock: { type: Number, default: 0 },
//   brokerDisplay: { type: Number, default: 0 },

//   lastLockDate: { type: String, default: "" },
//   validTill:    Date,
//   description:  String,


//   image: { type: String, default: "" },

 
//   galleryImages: {
//     type: [String],
//     default: [],
//     validate: {
//       validator: (arr) => arr.length <= 5,
//       message: "Gallery can have at most 5 images.",
//     },
//   },


//   gstPercent: { type: Number, default: 0 },
//   hsnCode:    { type: String, default: "" },
//   taxType: {
//     type: String,
//     enum: ["cgst_sgst", "igst"],
//     default: "cgst_sgst",
//   },


//   discounts: [discountSchema],

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "inactive",
//   },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Price", priceSchema);

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

  image:         { type: String, default: "" },
  galleryImages: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 5,
      message:   "Gallery can have at most 5 images.",
    },
  },

  // ── Tax fields ──────────────────────────────────────────────────
  gstPercent: { type: Number, default: 0 },
  hsnCode:    { type: String, default: "" },
  taxType: {
    type:    String,
    enum:    ["cgst_sgst", "igst"],
    default: "cgst_sgst",
  },

  // ── CESS (Compensation Cess, applied on top of GST) ─────────────
  cessPercent: { type: Number, default: 0 },

  // ── Computed GST + CESS breakdown (stored for invoicing) ────────
  priceExcludingGst: { type: Number, default: 0 }, // base + profitLoss (before any tax)
  gstAmount:         { type: Number, default: 0 }, // total GST rupee value
  cgstPercent:       { type: Number, default: 0 }, // CGST rate  (= gstPercent/2 for cgst_sgst, 0 for igst)
  sgstPercent:       { type: Number, default: 0 }, // SGST rate  (= gstPercent/2 for cgst_sgst, 0 for igst)
  igstPercent:       { type: Number, default: 0 }, // IGST rate  (= gstPercent for igst, 0 for cgst_sgst)
  cgstAmount:        { type: Number, default: 0 }, // CGST rupee value
  sgstAmount:        { type: Number, default: 0 }, // SGST rupee value
  igstAmount:        { type: Number, default: 0 }, 
  cessAmount:        { type: Number, default: 0 },
  totalTaxAmount:    { type: Number, default: 0 }, 

  discounts: [discountSchema],

  status: {
    type:    String,
    enum:    ["active", "inactive"],
    default: "inactive",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Price", priceSchema);