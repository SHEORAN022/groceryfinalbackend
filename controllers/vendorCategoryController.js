// const VendorCategory = require("../models/VendorCategory");
// const cloudinary = require("../utils/cloudinary");

// /* ================= Upload Helper ================= */
// const uploadToCloudinary = (buffer, folder = "vendor_categories") =>
//   new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder }, (err, result) => {
//         if (err) reject(err);
//         else resolve(result.secure_url);
//       })
//       .end(buffer);
//   });

// /* =====================================================
//    CATEGORY CRUD
// ===================================================== */

// /* ✅ CREATE CATEGORY */
// exports.createCategory = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;
//     const { name } = req.body;

//     if (!name)
//       return res.status(400).json({ success: false, message: "Name required" });

//     const exists = await VendorCategory.findOne({
//       vendor: vendorId,
//       name: name.trim(),
//     });

//     if (exists)
//       return res
//         .status(400)
//         .json({ success: false, message: "Category already exists" });

//     let image = null;
//     if (req.file) image = await uploadToCloudinary(req.file.buffer);

//     const category = await VendorCategory.create({
//       vendor: vendorId,
//       name: name.trim(),
//       image,
//     });

//     res.status(201).json({ success: true, category });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// /* ✅ READ CATEGORIES (with active subcategories only) */
// exports.getCategories = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;

//     const categories = await VendorCategory.find(
//       { vendor: vendorId, active: true },
//       {
//         name: 1,
//         image: 1,
//         active: 1,
//         subcategories: {
//           $filter: {
//             input: "$subcategories",
//             as: "sub",
//             cond: { $eq: ["$$sub.active", true] },
//           },
//         },
//       }
//     ).sort({ createdAt: -1 });

//     res.json({ success: true, categories });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// /* ✅ UPDATE CATEGORY */
// exports.updateCategory = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;
//     const { id } = req.params;
//     const { name, active } = req.body;

//     const category = await VendorCategory.findOne({
//       _id: id,
//       vendor: vendorId,
//     });

//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     if (name) category.name = name.trim();
//     if (typeof active !== "undefined") category.active = active;

//     if (req.file) {
//       category.image = await uploadToCloudinary(req.file.buffer);
//     }

//     await category.save();

//     res.json({ success: true, category });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// /* ✅ DELETE CATEGORY */
// exports.deleteCategory = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;
//     const { id } = req.params;

//     const deleted = await VendorCategory.findOneAndDelete({
//       _id: id,
//       vendor: vendorId,
//     });

//     if (!deleted)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     res.json({ success: true, message: "Category deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// /* =====================================================
//    SUB CATEGORY CRUD
// ===================================================== */

// /* ✅ CREATE SUBCATEGORY */
// exports.addSubCategory = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;
//     const { catId } = req.params;
//     const { name } = req.body;

//     if (!name)
//       return res.status(400).json({ success: false, message: "Name required" });

//     const category = await VendorCategory.findOne({
//       _id: catId,
//       vendor: vendorId,
//     });

//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const exists = category.subcategories.find(
//       (s) => s.name.toLowerCase() === name.toLowerCase().trim()
//     );

//     if (exists)
//       return res
//         .status(400)
//         .json({ success: false, message: "Subcategory already exists" });

//     let image = null;
//     if (req.file) {
//       image = await uploadToCloudinary(
//         req.file.buffer,
//         "vendor_subcategories"
//       );
//     }

//     category.subcategories.push({
//       name: name.trim(),
//       image,
//     });

//     await category.save();

//     res.status(201).json({
//       success: true,
//       subcategory: category.subcategories.at(-1),
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// /* ✅ UPDATE SUBCATEGORY */
// exports.updateSubCategory = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;
//     const { catId, subId } = req.params;
//     const { name, active } = req.body;

//     const category = await VendorCategory.findOne({
//       _id: catId,
//       vendor: vendorId,
//     });

//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const sub = category.subcategories.id(subId);
//     if (!sub)
//       return res
//         .status(404)
//         .json({ success: false, message: "Subcategory not found" });

//     if (name) sub.name = name.trim();
//     if (typeof active !== "undefined") sub.active = active;

//     if (req.file) {
//       sub.image = await uploadToCloudinary(
//         req.file.buffer,
//         "vendor_subcategories"
//       );
//     }

//     await category.save();

//     res.json({ success: true, subcategory: sub });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// /* ✅ DELETE SUBCATEGORY */
// exports.deleteSubCategory = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;
//     const { catId, subId } = req.params;

//     const category = await VendorCategory.findOne({
//       _id: catId,
//       vendor: vendorId,
//     });

//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     category.subcategories = category.subcategories.filter(
//       (s) => s._id.toString() !== subId
//     );

//     await category.save();

//     res.json({ success: true, message: "Subcategory deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

const VendorCategory = require("../models/VendorCategory");
const cloudinary = require("../utils/cloudinary");

/* ================= Upload Helper ================= */
const uploadToCloudinary = (buffer, folder = "vendor_categories") =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });

/* ✅ CREATE CATEGORY */
exports.createCategory = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const exists = await VendorCategory.findOne({
      vendor: vendorId,
      name: name.trim(),
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    const category = await VendorCategory.create({
      vendor: vendorId,
      name: name.trim(),
      image,
      status: "pending",
      active: false,
    });

    res.status(201).json({
      success: true,
      message: "Category created and sent for admin approval",
      category,
    });
  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

/* ✅ GET ALL VENDOR'S CATEGORIES (pending + approved + rejected sabhi) */
exports.getCategories = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const categories = await VendorCategory.find({
      vendor: vendorId,
    }).sort({ createdAt: -1 });

    const result = categories.map((cat) => {
      const obj = cat.toObject();
      // approved category mein sirf active subcategories dikhao
      if (cat.status === "approved") {
        obj.subcategories = obj.subcategories.filter((s) => s.active);
      }
      return obj;
    });

    res.json({
      success: true,
      categories: result,
    });
  } catch (err) {
    console.error("Get Categories Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

/* ✅ UPDATE CATEGORY */
exports.updateCategory = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { id } = req.params;
    const { name } = req.body;

    const category = await VendorCategory.findOne({
      _id: id,
      vendor: vendorId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name?.trim()) {
      category.name = name.trim();
      category.status = "pending";
      category.active = false;
    }

    if (req.file) {
      category.image = await uploadToCloudinary(req.file.buffer);
      category.status = "pending";
      category.active = false;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated and sent for re-approval",
      category,
    });
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

/* ✅ DELETE CATEGORY */
exports.deleteCategory = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { id } = req.params;

    const deleted = await VendorCategory.findOneAndDelete({
      _id: id,
      vendor: vendorId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("Delete Category Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

/* ✅ ADD SUBCATEGORY */
exports.addSubCategory = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { catId } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required",
      });
    }

    const category = await VendorCategory.findOne({
      _id: catId,
      vendor: vendorId,
      status: "approved",
      active: true,
    });

    if (!category) {
      return res.status(403).json({
        success: false,
        message: "Category not approved by admin",
      });
    }

    const exists = category.subcategories.find(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists",
      });
    }

    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, "vendor_subcategories");
    }

    category.subcategories.push({
      name: name.trim(),
      image,
      active: true,
    });

    await category.save();

    res.status(201).json({
      success: true,
      subcategory: category.subcategories.at(-1),
    });
  } catch (err) {
    console.error("Add SubCategory Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add subcategory",
    });
  }
};

/* ✅ UPDATE SUBCATEGORY */
exports.updateSubCategory = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { catId, subId } = req.params;
    const { name, active } = req.body;

    const category = await VendorCategory.findOne({
      _id: catId,
      vendor: vendorId,
      status: "approved",
      active: true,
    });

    if (!category) {
      return res.status(403).json({
        success: false,
        message: "Category not approved",
      });
    }

    const sub = category.subcategories.id(subId);
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    if (name?.trim()) sub.name = name.trim();
    if (typeof active !== "undefined") sub.active = active;

    if (req.file) {
      sub.image = await uploadToCloudinary(req.file.buffer, "vendor_subcategories");
    }

    await category.save();

    res.json({
      success: true,
      subcategory: sub,
    });
  } catch (err) {
    console.error("Update SubCategory Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update subcategory",
    });
  }
};

/* ✅ DELETE SUBCATEGORY */
exports.deleteSubCategory = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { catId, subId } = req.params;

    const category = await VendorCategory.findOne({
      _id: catId,
      vendor: vendorId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.subcategories = category.subcategories.filter(
      (s) => s._id.toString() !== subId
    );

    await category.save();

    res.json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    console.error("Delete SubCategory Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete subcategory",
    });
  }
};