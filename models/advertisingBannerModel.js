const mongoose = require("mongoose");

const advertisingBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: "",
  },

  image: {
    type: String,
    required: true,
  },

  redirectUrl: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    enum: ["home", "category", "product", "popup"],
    default: "home",
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AdvertisingBanner", advertisingBannerSchema);