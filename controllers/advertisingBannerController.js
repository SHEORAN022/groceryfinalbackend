const AdvertisingBanner = require("../models/advertisingBannerModel");
const cloudinary = require("../utils/cloudinary");

/* upload helper */
const uploadToCloudinary = (fileBuffer, folder = "advertising-banners") =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });

/* ================= ADD ================= */
exports.addAdvertisingBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const banner = await AdvertisingBanner.create({
      title: req.body.title,
      image: imageUrl,
      redirectUrl: req.body.redirectUrl,
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    res.json({ success: true, data: banner });
  } catch (err) {
    console.error("❌ ADD AD BANNER:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ================= */
exports.getAdvertisingBanners = async (req, res) => {
  try {
    const today = new Date();

    const banners = await AdvertisingBanner.find({
      status: "active",
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: today } },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteAdvertisingBanner = async (req, res) => {
  try {
    await AdvertisingBanner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= TOGGLE ================= */
exports.toggleAdvertisingBanner = async (req, res) => {
  try {
    const banner = await AdvertisingBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Not found" });

    banner.status = banner.status === "active" ? "inactive" : "active";
    await banner.save();

    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateAdvertisingBanner = async (req, res) => {
  try {
    const banner = await AdvertisingBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Not found" });

    let imageUrl = banner.image;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    banner.title = req.body.title || banner.title;
    banner.image = imageUrl;
    banner.redirectUrl = req.body.redirectUrl || banner.redirectUrl;
    banner.type = req.body.type || banner.type;
    banner.startDate = req.body.startDate || banner.startDate;
    banner.endDate = req.body.endDate || banner.endDate;

    await banner.save();

    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};