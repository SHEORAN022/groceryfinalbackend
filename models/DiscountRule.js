// const mongoose = require("mongoose");

// const schema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Price",
//     required: true
//   },

//   minQty: {
//     type: Number,
//     required: true
//   },

//   maxQty: {
//     type: Number, // null = unlimited (6+)
//     default: null
//   },

//   unitPrice: {
//     type: Number, // 🔥 FINAL PRICE PER UNIT
//     required: true
//   }
// });

// module.exports = mongoose.model("DiscountRule", schema);



const mongoose = require("mongoose");

const discountRuleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
      required: true,
    },

    minQty: {
      type: Number,
      required: true,
      min: [1, "Min Qty must be ≥ 1"],
    },

    maxQty: {
      type: Number,
      default: null,
    },


    basePrice: {
      type: Number,
      required: true,
      min: [0, "Base price cannot be negative"],
    },

    
    profit: {
      type: Number,
      default: 0,
    },


    unitPrice: {
      type: Number,
      required: true,
      min: [0, "Unit Price must be ≥ 0"],
    },
  },
  {
    timestamps: true,
  }
);


discountRuleSchema.pre("save", function (next) {
 
  this.unitPrice = Number((this.basePrice + this.profit).toFixed(2));
  next();
});


discountRuleSchema.virtual("profitPercent").get(function () {
  if (!this.basePrice || this.basePrice === 0) return 0;
  return Number(((this.profit / this.basePrice) * 100).toFixed(2));
});

module.exports = mongoose.model("DiscountRule", discountRuleSchema);