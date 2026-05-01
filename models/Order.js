// // // const mongoose = require("mongoose");

// // // const orderItemSchema = new mongoose.Schema(
// // //   {
// // //     product: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "Price",
// // //       required: true,
// // //     },
// // //     name: {
// // //       type: String,
// // //       required: true,
// // //     },
// // //     image: {
// // //       type: String,
// // //       default: "",
// // //     },
// // //     unitPrice: {
// // //       type: Number,
// // //       required: true,
// // //     },
// // //     quantity: {
// // //       type: Number,
// // //       required: true,
// // //       min: 1,
// // //     },
// // //     price: {
// // //       type: Number,
// // //       required: true,
// // //     },
// // //   },
// // //   { _id: false }
// // // );

// // // const OrderSchema = new mongoose.Schema(
// // //   {
// // //     user: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "User",
// // //       required: true,
// // //     },

// // //     userName: {
// // //       type: String,
// // //       required: true,
// // //     },

// // //     // ─── Multi-product items array ───
// // //     items: {
// // //       type: [orderItemSchema],
// // //       required: true,
// // //       validate: {
// // //         validator: (arr) => arr.length > 0,
// // //         message: "Order mein kam se kam ek item hona chahiye",
// // //       },
// // //     },

// // //     // ─── Total price of all items ───
// // //     totalPrice: {
// // //       type: Number,
// // //       required: true,
// // //     },

// // //     address: {
// // //       name:    { type: String },
// // //       phone:   { type: String },
// // //       street:  { type: String },
// // //       city:    { type: String },
// // //       state:   { type: String },
// // //       pincode: { type: String },
// // //     },

// // //     status: {
// // //       type: String,
// // //       enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
// // //       default: "placed",
// // //     },

// // //     paymentMode: {
// // //       type: String,
// // //       enum: ["cash", "online", "cod"],
// // //       default: "cash",
// // //     },

// // //     assignedRider: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "Rider",
// // //       default: null,
// // //     },
// // //   },
// // //   { timestamps: true }
// // // );

// // // module.exports = mongoose.model("Order", OrderSchema);

// // const mongoose = require("mongoose");

// // const orderItemSchema = new mongoose.Schema(
// //   {
// //     product: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Price",
// //       required: true,
// //     },
// //     name:      { type: String, required: true },
// //     image:     { type: String, default: "" },
// //     unitPrice: { type: Number, required: true },
// //     quantity:  { type: Number, required: true, min: 1 },
// //     price:     { type: Number, required: true },
// //   },
// //   { _id: false }
// // );

// // const OrderSchema = new mongoose.Schema(
// //   {
// //     user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     userName: { type: String, required: true },

// //     items: {
// //       type: [orderItemSchema],
// //       required: true,
// //       validate: {
// //         validator: (arr) => arr.length > 0,
// //         message: "Order mein kam se kam ek item hona chahiye",
// //       },
// //     },

// //     totalPrice: { type: Number, required: true },

// //     address: {
// //       name:    { type: String },
// //       phone:   { type: String },
// //       street:  { type: String },
// //       city:    { type: String },
// //       state:   { type: String },
// //       pincode: { type: String },
// //     },

// //     status: {
// //       type: String,
// //       enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
// //       default: "placed",
// //     },

// //     paymentMode: {
// //       type: String,
// //       enum: ["cash", "online", "cod"],
// //       default: "cash",
// //     },

// //     // ─── Payment Tracking ───────────────────────────────
// //     // Admin manually enter karta hai kitna payment mila
// //     paidAmount: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     // Auto-calculated: totalPrice - paidAmount
// //     // Virtual field hai — save nahi hota, on-the-fly calculate hota hai
// //     // pendingAmount: totalPrice - paidAmount

// //     // Payment status — auto set hoti hai paidAmount ke basis pe
// //     paymentStatus: {
// //       type: String,
// //       enum: ["unpaid", "partial", "paid"],
// //       default: "unpaid",
// //     },

// //     // Optional note for payment (e.g. "UPI ref: 123", "Cash collected by rider")
// //     paymentNote: {
// //       type: String,
// //       default: "",
// //     },
// //     // ────────────────────────────────────────────────────

// //     assignedRider: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Rider",
// //       default: null,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //     toJSON:    { virtuals: true },
// //     toObject:  { virtuals: true },
// //   }
// // );

// // // ── Virtual: pendingAmount ──────────────────────────────
// // OrderSchema.virtual("pendingAmount").get(function () {
// //   return Math.max(0, (this.totalPrice || 0) - (this.paidAmount || 0));
// // });

// // // ── Pre-save: auto update paymentStatus ────────────────
// // OrderSchema.pre("save", function (next) {
// //   const paid    = this.paidAmount   || 0;
// //   const total   = this.totalPrice   || 0;

// //   if (paid <= 0)          this.paymentStatus = "unpaid";
// //   else if (paid >= total) this.paymentStatus = "paid";
// //   else                    this.paymentStatus = "partial";

// //   next();
// // });

// // module.exports = mongoose.model("Order", OrderSchema);



// const mongoose = require("mongoose");

// /* ================= ORDER ITEM ================= */
// const orderItemSchema = new mongoose.Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     // 🔥 किस model से आया है
//     productModel: {
//       type: String,
//       enum: ["Price", "VendorProduct"],
//       required: true,
//     },

//     // 🔥 admin ya vendor
//     ownerType: {
//       type: String,
//       enum: ["admin", "vendor"],
//       required: true,
//     },

//     // 🔥 vendor product हो तो vendor id
//     vendorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       default: null,
//     },

//     name:      { type: String, required: true },
//     image:     { type: String, default: "" },
//     unitPrice: { type: Number, required: true },
//     quantity:  { type: Number, required: true, min: 1 },
//     price:     { type: Number, required: true },
//   },
//   { _id: false }
// );

// /* ================= ORDER ================= */
// const OrderSchema = new mongoose.Schema(
//   {
//     user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     userName: { type: String, required: true },

//     items: {
//       type: [orderItemSchema],
//       required: true,
//       validate: {
//         validator: (arr) => arr.length > 0,
//         message: "Order mein kam se kam ek item hona chahiye",
//       },
//     },

//     totalPrice: { type: Number, required: true },

//     address: {
//       name:    { type: String },
//       phone:   { type: String },
//       street:  { type: String },
//       city:    { type: String },
//       state:   { type: String },
//       pincode: { type: String },
//     },

//     status: {
//       type: String,
//       enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
//       default: "placed",
//     },

//     paymentMode: {
//       type: String,
//       enum: ["cash", "online", "cod"],
//       default: "cash",
//     },

//     /* ================= PAYMENT ================= */

//     paidAmount: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["unpaid", "partial", "paid"],
//       default: "unpaid",
//     },

//     paymentNote: {
//       type: String,
//       default: "",
//     },

//     /* ================= RIDER ================= */

//     assignedRider: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Rider",
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON:   { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// /* ================= VIRTUAL ================= */
// OrderSchema.virtual("pendingAmount").get(function () {
//   return Math.max(0, (this.totalPrice || 0) - (this.paidAmount || 0));
// });

// /* ================= PRE SAVE ================= */
// OrderSchema.pre("save", function (next) {
//   const paid  = this.paidAmount || 0;
//   const total = this.totalPrice || 0;

//   if (paid <= 0) this.paymentStatus = "unpaid";
//   else if (paid >= total) this.paymentStatus = "paid";
//   else this.paymentStatus = "partial";

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
    couponCode:     { type: String,  default: null }, // applied coupon code
    couponDiscount: { type: Number,  default: 0    }, // kitna discount mila
    finalPrice:     { type: Number,  default: null }, // totalPrice - couponDiscount
    // finalPrice null means no coupon applied — totalPrice hi final hai
    // ────────────────────────────────────────────────────────────

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

// pendingAmount = finalPrice (ya totalPrice agar coupon nahi) - paidAmount
OrderSchema.virtual("pendingAmount").get(function () {
  const effective = this.finalPrice ?? this.totalPrice ?? 0;
  return Math.max(0, effective - (this.paidAmount || 0));
});

// paymentStatus auto-set on save
OrderSchema.pre("save", function (next) {
  const paid      = this.paidAmount || 0;
  const effective = this.finalPrice ?? this.totalPrice ?? 0;

  if (paid <= 0)               this.paymentStatus = "unpaid";
  else if (paid >= effective)  this.paymentStatus = "paid";
  else                         this.paymentStatus = "partial";

  next();
});

module.exports = mongoose.model("Order", OrderSchema);