// const Category = require("../models/categoryModel");
// const cloudinary = require("../utils/cloudinary");

// /** Upload buffer to cloudinary **/
// const uploadToCloudinary = (fileBuffer, folder = "category_images") => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder }, (err, result) => {
//         if (err) reject(err);
//         else resolve(result.secure_url);
//       })
//       .end(fileBuffer);
//   });
// };

// /** Extract publicId from cloudinary URL **/
// const extractPublicId = (url) => {
//   try {
//     const parts = url.split("/");
//     const last = parts.pop();
//     return last.split(".")[0];
//   } catch {
//     return null;
//   }
// };

// const deleteCloudinaryImage = (url) => {
//   if (!url) return;
//   const publicId = extractPublicId(url);
//   if (publicId) cloudinary.uploader.destroy(`category_images/${publicId}`);
// };

// /* =========================================================
//    CATEGORY CRUD
// ========================================================= */

// exports.createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name)
//       return res.status(400).json({ success: false, message: "Category name is required" });

//     const existing = await Category.findOne({ name: name.trim() });
//     if (existing)
//       return res.status(400).json({ success: false, message: "Category already exists" });

//     let imageUrl = null;
//     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

//     const category = await Category.create({ name: name.trim(), image: imageUrl });
//     res.status(201).json({ success: true, message: "Category created successfully", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.updateCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     if (name) category.name = name.trim();
//     if (req.file) {
//       deleteCloudinaryImage(category.image);
//       category.image = await uploadToCloudinary(req.file.buffer);
//     }

//     await category.save();
//     res.json({ success: true, message: "Category updated successfully", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     // Delete all images recursively
//     deleteCloudinaryImage(category.image);
//     for (const sub of category.subcategories) {
//       deleteCloudinaryImage(sub.image);
//       for (const subsub of sub.subSubcategories) {
//         deleteCloudinaryImage(subsub.image);
//       }
//     }

//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Category deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// /* =========================================================
//    SUBCATEGORY CRUD  (Level 2)
//    POST   /api/categories/:id/sub
//    PUT    /api/categories/:id/sub/:subId
//    DELETE /api/categories/:id/sub/:subId
// ========================================================= */

// exports.addSubcategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name)
//       return res.status(400).json({ success: false, message: "Subcategory name is required" });

//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const exists = category.subcategories.find(
//       (s) => s.name.toLowerCase() === name.trim().toLowerCase()
//     );
//     if (exists)
//       return res.status(400).json({ success: false, message: "Subcategory already exists" });

//     let imageUrl = null;
//     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

//     category.subcategories.push({ name: name.trim(), image: imageUrl });
//     await category.save();

//     const newSub = category.subcategories[category.subcategories.length - 1];
//     res.status(201).json({ success: true, message: "Subcategory added", subcategory: newSub, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.updateSubcategory = async (req, res) => {
//   try {
//     const { name, active } = req.body;
//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const sub = category.subcategories.id(req.params.subId);
//     if (!sub)
//       return res.status(404).json({ success: false, message: "Subcategory not found" });

//     if (name) sub.name = name.trim();
//     if (typeof active !== "undefined") sub.active = active === "true" || active === true;
//     if (req.file) {
//       deleteCloudinaryImage(sub.image);
//       sub.image = await uploadToCloudinary(req.file.buffer);
//     }

//     await category.save();
//     res.json({ success: true, message: "Subcategory updated", subcategory: sub, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.deleteSubcategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const sub = category.subcategories.id(req.params.subId);
//     if (!sub)
//       return res.status(404).json({ success: false, message: "Subcategory not found" });

//     // Delete sub + all sub-subcategory images
//     deleteCloudinaryImage(sub.image);
//     for (const subsub of sub.subSubcategories) {
//       deleteCloudinaryImage(subsub.image);
//     }

//     sub.deleteOne();
//     await category.save();
//     res.json({ success: true, message: "Subcategory deleted", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// /* =========================================================
//    SUB-SUBCATEGORY CRUD  (Level 3 - Optional)
//    POST   /api/categories/:id/sub/:subId/subsub
//    PUT    /api/categories/:id/sub/:subId/subsub/:subSubId
//    DELETE /api/categories/:id/sub/:subId/subsub/:subSubId
// ========================================================= */

// exports.addSubSubcategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name)
//       return res.status(400).json({ success: false, message: "Sub-subcategory name is required" });

//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const sub = category.subcategories.id(req.params.subId);
//     if (!sub)
//       return res.status(404).json({ success: false, message: "Subcategory not found" });

//     const exists = sub.subSubcategories.find(
//       (s) => s.name.toLowerCase() === name.trim().toLowerCase()
//     );
//     if (exists)
//       return res.status(400).json({ success: false, message: "Sub-subcategory already exists" });

//     let imageUrl = null;
//     if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

//     sub.subSubcategories.push({ name: name.trim(), image: imageUrl });
//     await category.save();

//     const newSubSub = sub.subSubcategories[sub.subSubcategories.length - 1];
//     res.status(201).json({ success: true, message: "Sub-subcategory added", subSubcategory: newSubSub, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.updateSubSubcategory = async (req, res) => {
//   try {
//     const { name, active } = req.body;
//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const sub = category.subcategories.id(req.params.subId);
//     if (!sub)
//       return res.status(404).json({ success: false, message: "Subcategory not found" });

//     const subSub = sub.subSubcategories.id(req.params.subSubId);
//     if (!subSub)
//       return res.status(404).json({ success: false, message: "Sub-subcategory not found" });

//     if (name) subSub.name = name.trim();
//     if (typeof active !== "undefined") subSub.active = active === "true" || active === true;
//     if (req.file) {
//       deleteCloudinaryImage(subSub.image);
//       subSub.image = await uploadToCloudinary(req.file.buffer);
//     }

//     await category.save();
//     res.json({ success: true, message: "Sub-subcategory updated", subSubcategory: subSub, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.deleteSubSubcategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category)
//       return res.status(404).json({ success: false, message: "Category not found" });

//     const sub = category.subcategories.id(req.params.subId);
//     if (!sub)
//       return res.status(404).json({ success: false, message: "Subcategory not found" });

//     const subSub = sub.subSubcategories.id(req.params.subSubId);
//     if (!subSub)
//       return res.status(404).json({ success: false, message: "Sub-subcategory not found" });

//     deleteCloudinaryImage(subSub.image);
//     subSub.deleteOne();
//     await category.save();
//     res.json({ success: true, message: "Sub-subcategory deleted", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };


const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");

/** Upload buffer to cloudinary **/
const uploadToCloudinary = (fileBuffer, folder = "category_images") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

/** Extract publicId from cloudinary URL **/
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const last = parts.pop();
    return last.split(".")[0];
  } catch {
    return null;
  }
};

const deleteCloudinaryImage = (url) => {
  if (!url) return;
  const publicId = extractPublicId(url);
  if (publicId) cloudinary.uploader.destroy(`category_images/${publicId}`);
};

/* =========================================================
   CATEGORY CRUD
========================================================= */

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Category name is required" });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing)
      return res.status(400).json({ success: false, message: "Category already exists" });

    let imageUrl = null;
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    const category = await Category.create({ name: name.trim(), image: imageUrl });
    res.status(201).json({ success: true, message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    if (name) category.name = name.trim();
    if (req.file) {
      deleteCloudinaryImage(category.image);
      category.image = await uploadToCloudinary(req.file.buffer);
    }

    await category.save();
    res.json({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    // Delete all images recursively (3 levels)
    deleteCloudinaryImage(category.image);
    for (const sub of category.subcategories) {
      deleteCloudinaryImage(sub.image);
      for (const subsub of sub.subSubcategories) {
        deleteCloudinaryImage(subsub.image);
      }
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* =========================================================
   SUBCATEGORY CRUD  (Level 2)
   POST   /api/categories/:id/sub
   PUT    /api/categories/:id/sub/:subId
   DELETE /api/categories/:id/sub/:subId
========================================================= */

exports.addSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Subcategory name is required" });

    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const exists = category.subcategories.find(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists)
      return res.status(400).json({ success: false, message: "Subcategory already exists" });

    let imageUrl = null;
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    category.subcategories.push({ name: name.trim(), image: imageUrl });
    await category.save();

    const newSub = category.subcategories[category.subcategories.length - 1];
    res.status(201).json({ success: true, message: "Subcategory added", subcategory: newSub, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { name, active } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const sub = category.subcategories.id(req.params.subId);
    if (!sub)
      return res.status(404).json({ success: false, message: "Subcategory not found" });

    if (name) sub.name = name.trim();
    if (typeof active !== "undefined") sub.active = active === "true" || active === true;
    if (req.file) {
      deleteCloudinaryImage(sub.image);
      sub.image = await uploadToCloudinary(req.file.buffer);
    }

    await category.save();
    res.json({ success: true, message: "Subcategory updated", subcategory: sub, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const sub = category.subcategories.id(req.params.subId);
    if (!sub)
      return res.status(404).json({ success: false, message: "Subcategory not found" });

    // Delete sub image + all sub-subcategory images
    deleteCloudinaryImage(sub.image);
    for (const subsub of sub.subSubcategories) {
      deleteCloudinaryImage(subsub.image);
    }

    sub.deleteOne();
    await category.save();
    res.json({ success: true, message: "Subcategory deleted", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* =========================================================
   SUB-SUBCATEGORY CRUD  (Level 3 — products live here)
   POST   /api/categories/:id/sub/:subId/subsub
   PUT    /api/categories/:id/sub/:subId/subsub/:subSubId
   DELETE /api/categories/:id/sub/:subId/subsub/:subSubId
========================================================= */

exports.addSubSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Sub-subcategory name is required" });

    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const sub = category.subcategories.id(req.params.subId);
    if (!sub)
      return res.status(404).json({ success: false, message: "Subcategory not found" });

    const exists = sub.subSubcategories.find(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists)
      return res.status(400).json({ success: false, message: "Sub-subcategory already exists" });

    let imageUrl = null;
    if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer);

    sub.subSubcategories.push({ name: name.trim(), image: imageUrl });
    await category.save();

    const newSubSub = sub.subSubcategories[sub.subSubcategories.length - 1];
    res.status(201).json({
      success: true,
      message: "Sub-subcategory added",
      subSubcategory: newSubSub,
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.updateSubSubcategory = async (req, res) => {
  try {
    const { name, active } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const sub = category.subcategories.id(req.params.subId);
    if (!sub)
      return res.status(404).json({ success: false, message: "Subcategory not found" });

    const subSub = sub.subSubcategories.id(req.params.subSubId);
    if (!subSub)
      return res.status(404).json({ success: false, message: "Sub-subcategory not found" });

    if (name) subSub.name = name.trim();
    if (typeof active !== "undefined") subSub.active = active === "true" || active === true;
    if (req.file) {
      deleteCloudinaryImage(subSub.image);
      subSub.image = await uploadToCloudinary(req.file.buffer);
    }

    await category.save();
    res.json({
      success: true,
      message: "Sub-subcategory updated",
      subSubcategory: subSub,
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.deleteSubSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const sub = category.subcategories.id(req.params.subId);
    if (!sub)
      return res.status(404).json({ success: false, message: "Subcategory not found" });

    const subSub = sub.subSubcategories.id(req.params.subSubId);
    if (!subSub)
      return res.status(404).json({ success: false, message: "Sub-subcategory not found" });

    deleteCloudinaryImage(subSub.image);
    subSub.deleteOne();
    await category.save();
    res.json({ success: true, message: "Sub-subcategory deleted", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
