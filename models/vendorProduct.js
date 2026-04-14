// const mongoose = require("mongoose");

// /* ================= WEIGHT ================= */
// const weightSchema = new mongoose.Schema({
//   value: { type: Number, default: 1 },
//   unit: {
//     type: String,
//     enum: ["kg", "gm", "ltr", "ml", "pcs"],
//     default: "kg",
//   },
// });

// /* ================= VENDOR PRODUCT ================= */
// const vendorProductSchema = new mongoose.Schema(
//   {
//     vendor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//       index: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     /* 🔥 IMPORTANT: CORRECT REF */
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "VendorCategory",
//       required: true,
//     },

//     subcategory: {
//       id: String,
//       name: String,
//       image: String,
//     },

//     weight: weightSchema,

//     image: { type: String, default: "" },

//     basePrice: {
//       type: Number,
//       required: true,
//     },

//     salePrice: {
//       type: Number,
//       required: true,
//     },

//     /* 🔥 DISCOUNT FIELD */
//     discount: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("VendorProduct", vendorProductSchema);
const mongoose = require("mongoose");

/* ================= WEIGHT ================= */
const weightSchema = new mongoose.Schema({
  value: { type: Number, default: 1 },
  unit: {
    type: String,
    enum: ["kg", "gm", "ltr", "ml", "pcs"],
    default: "kg",
  },
});

/* ================= VENDOR PRODUCT ================= */
const vendorProductSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorCategory",
      required: true,
    },

    subcategory: {
      id: String,
      name: String,
      image: String,
    },

    weight: weightSchema,

    image: { type: String, default: "" },

    description: { type: String, default: "" },

    basePrice: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    /* 🔥 STATUS FIELD - was missing in original */
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorProduct", vendorProductSchema);