// const mongoose = require("mongoose");

// const inventorySchema = new mongoose.Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Price",
//       required: true,
//       unique: true,
//     },
//     stock:     { type: Number, default: 0, min: 0 },
//     minStock:  { type: Number, default: 0, min: 0 },
//     expiryDate:{ type: Date },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Inventory", inventorySchema);

const mongoose = require("mongoose");

// ── Batch sub-schema ─────────────────────────────────────────────────────────
// Ek product ke multiple batches ho sakte hain (different mfg/expiry dates)
const batchSchema = new mongoose.Schema(
  {
    batchNo:   { type: String, default: "" },   // e.g. "BATCH-001", "LOT-A"
    mfgDate:   { type: Date,   default: null },  // Manufacturing date
    expiryDate:{ type: Date,   default: null },  // Expiry date
    qty:       { type: Number, default: 0, min: 0 }, // Stock in this batch
  },
  { _id: true }
);

// ── Main Inventory schema ─────────────────────────────────────────────────────
const inventorySchema = new mongoose.Schema(
  {
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Price",
      required: true,
      unique:   true,
    },

    // Total stock = sum of all batches (auto-computed on save)
    stock:    { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 },

    // Legacy single expiryDate — nearest batch ki expiry se auto-set hoti hai
    expiryDate: { type: Date, default: null },

    // Batch list — ek product ke multiple batches
    batches: { type: [batchSchema], default: [] },
  },
  { timestamps: true }
);

// ── Pre-save: total stock aur nearest expiryDate auto-calculate karo ─────────
inventorySchema.pre("save", function (next) {
  if (this.batches && this.batches.length > 0) {
    // Total stock = all batch quantities ka sum
    this.stock = this.batches.reduce((sum, b) => sum + (b.qty || 0), 0);

    // Nearest expiry date — batches mein se jo sabse pehle expire hogi
    const withExpiry = this.batches.filter((b) => b.expiryDate);
    if (withExpiry.length > 0) {
      withExpiry.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
      this.expiryDate = withExpiry[0].expiryDate;
    }
  }
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);
