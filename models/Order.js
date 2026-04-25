const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    // ─── Multi-product items array ───
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order mein kam se kam ek item hona chahiye",
      },
    },

    // ─── Total price of all items ───
    totalPrice: {
      type: Number,
      required: true,
    },

    address: {
      name:    { type: String },
      phone:   { type: String },
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      pincode: { type: String },
    },

    status: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    paymentMode: {
      type: String,
      enum: ["cash", "online", "cod"],
      default: "cash",
    },

    assignedRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);