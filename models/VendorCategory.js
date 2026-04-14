
// const mongoose = require("mongoose");

// /* ================= SUBCATEGORY SCHEMA ================= */
// const SubCategorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     image: {
//       type: String,
//       default: null,
//     },
//     active: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// /* ================= CATEGORY SCHEMA ================= */
// const VendorCategorySchema = new mongoose.Schema(
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
//     image: {
//       type: String,
//       default: null,
//     },
//     subcategories: {
//       type: [SubCategorySchema], // 🔥 THIS WAS MISSING
//       default: [],
//     },
//     active: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("VendorCategory", VendorCategorySchema);
const mongoose = require("mongoose");

/* ================= SUBCATEGORY SCHEMA ================= */
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },

    /* 👇 SAME FIELD, DEFAULT CHANGE */
    active: {
      type: Boolean,
      default: false, // 🔥 admin approve kare tab true
    },
  },
  { timestamps: true }
);

/* ================= CATEGORY SCHEMA ================= */
const VendorCategorySchema = new mongoose.Schema(
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

    image: {
      type: String,
      default: null,
    },

    subcategories: {
      type: [SubCategorySchema],
      default: [],
    },

    /* 🔥 ADMIN APPROVAL STATUS (NEW FIELD) */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // 👈 vendor add kare → pending
      index: true,
    },

    /* 👇 SAME FIELD, DEFAULT CHANGE */
    active: {
      type: Boolean,
      default: false, // 🔥 admin approve kare tab true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorCategory", VendorCategorySchema);
