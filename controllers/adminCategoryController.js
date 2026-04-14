// const VendorCategory = require("../models/VendorCategory");

// /* ✅ GET ALL CATEGORIES (admin ke liye sabhi vendors ki) */
// exports.getAllVendorCategories = async (req, res) => {
//   try {
//     const { status } = req.query;

//     const filter = {};
//     if (status && ["pending", "approved", "rejected"].includes(status)) {
//       filter.status = status;
//     }

//     const categories = await VendorCategory.find(filter)
//       .populate("vendor", "name email phone")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       total: categories.length,
//       categories,
//     });
//   } catch (err) {
//     console.error("Admin Get Categories Error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* ✅ APPROVE CATEGORY */
// exports.approveCategory = async (req, res) => {
//   try {
//     const category = await VendorCategory.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     category.status = "approved";
//     category.active = true;

//     category.subcategories.forEach((sub) => {
//       sub.active = true;
//     });

//     await category.save();

//     res.json({
//       success: true,
//       message: "Category approved successfully",
//       category,
//     });
//   } catch (err) {
//     console.error("Approve Category Error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* ✅ REJECT CATEGORY */
// exports.rejectCategory = async (req, res) => {
//   try {
//     const category = await VendorCategory.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     category.status = "rejected";
//     category.active = false;

//     category.subcategories.forEach((sub) => {
//       sub.active = false;
//     });

//     await category.save();

//     res.json({
//       success: true,
//       message: "Category rejected successfully",
//       category,
//     });
//   } catch (err) {
//     console.error("Reject Category Error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


const VendorCategory = require("../models/VendorCategory");

/* ================================================================
   GET ALL VENDOR CATEGORIES (with filters)
   ================================================================ */
exports.getAllVendorCategories = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const categories = await VendorCategory.find(filter)
      .populate("vendor", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: categories.length,
      categories,
    });
  } catch (err) {
    console.error("Admin Get Categories Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================================================
   APPROVE CATEGORY
   — category + all subcategories + all sub-subcategories active = true
   ================================================================ */
exports.approveCategory = async (req, res) => {
  try {
    const category = await VendorCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    category.status = "approved";
    category.active = true;

    category.subcategories.forEach((sub) => {
      sub.active = true;
      (sub.subSubCategories || []).forEach((ss) => {
        ss.active = true;
      });
    });

    await category.save();

    res.json({
      success: true,
      message: "Category approved successfully ✅",
      category,
    });
  } catch (err) {
    console.error("Approve Category Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================================================
   REJECT CATEGORY
   — category + all subcategories + all sub-subcategories active = false
   ================================================================ */
exports.rejectCategory = async (req, res) => {
  try {
    const category = await VendorCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    category.status = "rejected";
    category.active = false;

    category.subcategories.forEach((sub) => {
      sub.active = false;
      (sub.subSubCategories || []).forEach((ss) => {
        ss.active = false;
      });
    });

    await category.save();

    res.json({
      success: true,
      message: "Category rejected ❌",
      category,
    });
  } catch (err) {
    console.error("Reject Category Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================================================
   GET SINGLE CATEGORY DETAIL (admin ke liye full detail)
   ================================================================ */
exports.getCategoryDetail = async (req, res) => {
  try {
    const category = await VendorCategory.findById(req.params.id)
      .populate("vendor", "name email phone");

    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, category });
  } catch (err) {
    console.error("Get Category Detail Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================================================
   DELETE CATEGORY (admin)
   ================================================================ */
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await VendorCategory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    console.error("Admin Delete Category Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
