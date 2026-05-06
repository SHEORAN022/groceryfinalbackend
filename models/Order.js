// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema(
//   {
//     product: {
//       type:     mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     productModel: {
//       type:     String,
//       enum:     ["Price", "VendorProduct"],
//       required: true,
//     },
//     ownerType: {
//       type:     String,
//       enum:     ["admin", "vendor"],
//       required: true,
//     },
//     vendorId: {
//       type:    mongoose.Schema.Types.ObjectId,
//       ref:     "Vendor",
//       default: null,
//     },
//     name:      { type: String, required: true },
//     image:     { type: String, default: "" },
//     unitPrice: { type: Number, required: true },
//     quantity:  { type: Number, required: true, min: 1 },
//     price:     { type: Number, required: true },
//     mrp:       { type: Number, default: 0 },
//     hsn:       { type: String, default: "" },
//     gstRate:   { type: Number, default: 0 },
//     unit:      { type: String, default: "pcs" },
//     packing:   { type: String, default: "" },
//   },
//   { _id: false }
// );

// const OrderSchema = new mongoose.Schema(
//   {
//     user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     userName: { type: String, required: true },

//     items: {
//       type: [orderItemSchema],
//       required: true,
//       validate: {
//         validator: (arr) => arr.length > 0,
//         message:   "Order mein kam se kam ek item hona chahiye",
//       },
//     },

//     originalItems:      { type: [orderItemSchema], default: undefined },
//     originalTotalPrice: { type: Number,            default: undefined },

//     totalPrice: { type: Number, required: true }, // items ka sum (before coupon)

//     // ── Coupon ──────────────────────────────────────────────────
//     couponCode:     { type: String,  default: null }, // applied coupon code
//     couponDiscount: { type: Number,  default: 0    }, // kitna discount mila
//     finalPrice:     { type: Number,  default: null }, // totalPrice - couponDiscount
    

//     address: {
//       name:    { type: String, default: "" },
//       phone:   { type: String, default: "" },
//       street:  { type: String, default: "" },
//       city:    { type: String, default: "" },
//       state:   { type: String, default: "" },
//       pincode: { type: String, default: "" },
//     },

//     status: {
//       type:    String,
//       enum:    ["placed", "confirmed", "shipped", "delivered", "cancelled"],
//       default: "placed",
//     },

//     paymentMode: {
//       type:    String,
//       enum:    ["cash", "online", "cod"],
//       default: "cash",
//     },

//     paidAmount:    { type: Number, default: 0,        min: 0 },
//     paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
//     paymentNote:   { type: String, default: "" },

//     assignedRider: {
//       type:    mongoose.Schema.Types.ObjectId,
//       ref:     "Rider",
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON:     { virtuals: true },
//     toObject:   { virtuals: true },
//   }
// );

// // pendingAmount = finalPrice (ya totalPrice agar coupon nahi) - paidAmount
// OrderSchema.virtual("pendingAmount").get(function () {
//   const effective = this.finalPrice ?? this.totalPrice ?? 0;
//   return Math.max(0, effective - (this.paidAmount || 0));
// });

// // paymentStatus auto-set on save
// OrderSchema.pre("save", function (next) {
//   const paid      = this.paidAmount || 0;
//   const effective = this.finalPrice ?? this.totalPrice ?? 0;

//   if (paid <= 0)               this.paymentStatus = "unpaid";
//   else if (paid >= effective)  this.paymentStatus = "paid";
//   else                         this.paymentStatus = "partial";

//   next();
// });

// module.exports = mongoose.model("Order", OrderSchema);

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productModel: {
      type:     String,
      enum:     ["Price", "VendorProduct"],
      required: true,
    },
    ownerType: {
      type:     String,
      enum:     ["admin", "vendor"],
      required: true,
    },
    vendorId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "Vendor",
      default: null,
    },
    name:      { type: String, required: true },
    image:     { type: String, default: "" },
    unitPrice: { type: Number, required: true },
    quantity:  { type: Number, required: true, min: 1 },
    price:     { type: Number, required: true },
    mrp:       { type: Number, default: 0 },
    hsn:       { type: String, default: "" },
    gstRate:   { type: Number, default: 0 },
    cess:      { type: Number, default: 0 },   // ← ADDED
    unit:      { type: String, default: "pcs" },
    packing:   { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message:   "Order mein kam se kam ek item hona chahiye",
      },
    },

    originalItems:      { type: [orderItemSchema], default: undefined },
    originalTotalPrice: { type: Number,            default: undefined },

    totalPrice: { type: Number, required: true }, // items ka sum (before coupon)

    // ── Coupon ──────────────────────────────────────────────────
    couponCode:     { type: String, default: null }, // applied coupon code
    couponDiscount: { type: Number, default: 0    }, // kitna discount mila
    finalPrice:     { type: Number, default: null }, // totalPrice - couponDiscount

    address: {
      name:    { type: String, default: "" },
      phone:   { type: String, default: "" },
      street:  { type: String, default: "" },
      city:    { type: String, default: "" },
      state:   { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    status: {
      type:    String,
      enum:    ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    paymentMode: {
      type:    String,
      enum:    ["cash", "online", "cod"],
      default: "cash",
    },

    paidAmount:    { type: Number, default: 0,        min: 0 },
    paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
    paymentNote:   { type: String, default: "" },

    assignedRider: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "Rider",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ─── VIRTUAL: pendingAmount ───────────────────────────────────────────────────
// pendingAmount = finalPrice (ya totalPrice agar coupon nahi) - paidAmount
OrderSchema.virtual("pendingAmount").get(function () {
  const effective = this.finalPrice ?? this.totalPrice ?? 0;
  return +(Math.max(0, effective - (this.paidAmount || 0))).toFixed(2);
});

// ─── VIRTUAL: gstSummary ─────────────────────────────────────────────────────
// Har order ke saath GST breakdown automatically milega
OrderSchema.virtual("gstSummary").get(function () {
  const items = this.items || [];

  let totalTaxableValue = 0;
  let totalCgst         = 0;
  let totalSgst         = 0;
  let totalCess         = 0;
  let totalGst          = 0;

  const itemBreakdown = items.map((item) => {
    const gstRate  = item.gstRate || 0;
    const cessRate = item.cess    || 0;

    // Price GST-inclusive hai, isliye taxable value reverse calculate karte hain
    // taxableValue = lineTotal / (1 + gstRate/100 + cessRate/100)
    const divisor      = 1 + gstRate / 100 + cessRate / 100;
    const taxableValue = +(item.price / divisor).toFixed(2);
    const cessAmount   = +((taxableValue * cessRate) / 100).toFixed(2);
    const cgst         = +((taxableValue * (gstRate / 2)) / 100).toFixed(2);
    const sgst         = cgst; // Intra-state: CGST = SGST
    const gstAmount    = +((cgst + sgst + cessAmount)).toFixed(2);

    totalTaxableValue += taxableValue;
    totalCgst         += cgst;
    totalSgst         += sgst;
    totalCess         += cessAmount;
    totalGst          += gstAmount;

    return {
      name:         item.name,
      hsn:          item.hsn      || "",
      quantity:     item.quantity,
      unit:         item.unit     || "pcs",
      mrp:          item.mrp      || item.unitPrice,
      unitPrice:    item.unitPrice,
      gstRate:      `${gstRate}%`,
      cessRate:     `${cessRate}%`,
      taxableValue: +taxableValue.toFixed(2),
      cgst:         +cgst.toFixed(2),
      sgst:         +sgst.toFixed(2),
      cess:         +cessAmount.toFixed(2),
      totalGst:     +gstAmount.toFixed(2),
      lineTotal:    item.price,
    };
  });

  return {
    itemBreakdown,
    totals: {
      taxableValue: +totalTaxableValue.toFixed(2),
      cgst:         +totalCgst.toFixed(2),
      sgst:         +totalSgst.toFixed(2),
      cess:         +totalCess.toFixed(2),
      totalGst:     +totalGst.toFixed(2),
    },
  };
});

// ─── PRE-SAVE HOOK: paymentStatus auto-set ───────────────────────────────────
OrderSchema.pre("save", function (next) {
  const paid      = this.paidAmount || 0;
  const effective = this.finalPrice ?? this.totalPrice ?? 0;

  if (paid <= 0)              this.paymentStatus = "unpaid";
  else if (paid >= effective) this.paymentStatus = "paid";
  else                        this.paymentStatus = "partial";

  next();
});

module.exports = mongoose.model("Order", OrderSchema);