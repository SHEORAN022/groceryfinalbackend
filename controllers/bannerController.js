
const Banner = require("../models/bannerModel");
const cloudinary = require("../utils/cloudinary");


const uploadToCloudinary = (fileBuffer, folder = "banners") =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });


exports.addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const banner = await Banner.create({
      image: imageUrl,
    });

    res.json({ success: true, data: banner });
  } catch (err) {
    console.error("❌ ADD BANNER:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "active" })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= TOGGLE STATUS ================= */
exports.toggleStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Not found" });
    }

    banner.status = banner.status === "active" ? "inactive" : "active";
    await banner.save();

    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Not found" });

    let imageUrl = banner.image;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    banner.image = imageUrl;
    await banner.save();

    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};