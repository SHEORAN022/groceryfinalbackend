const mongoose = require("mongoose");

const customHsnSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, required: true, trim: true },
  gst:         { type: Number, required: true, enum: [0, 5, 12, 18, 28], default: 0 },
  category:    { type: String, required: true, trim: true },
  isCustom:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomHsn", customHsnSchema);