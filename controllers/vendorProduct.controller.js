// const VendorProduct = require("../models/vendorProduct");
// const VendorCategory = require("../models/VendorCategory");
// const cloudinary = require("../utils/cloudinary");

// /* ================= IMAGE UPLOAD ================= */
// const uploadToCloudinary = (buffer) =>
//   new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder: "vendor_products" }, (err, result) => {
//         if (err) reject(err);
//         else resolve(result.secure_url);
//       })
//       .end(buffer);
//   });

// /* ======================================================
//    CREATE PRODUCT
// ====================================================== */
// exports.createProduct = async (req, res) => {
//   try {
//     /* 🔍 CATEGORY VALIDATION */
//     const categoryDoc = await VendorCategory.findById(req.body.category);
//     if (!categoryDoc) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid category",
//       });
//     }

//     /* 📷 IMAGE UPLOAD */
//     let image = "";
//     if (req.file) {
//       image = await uploadToCloudinary(req.file.buffer);
//     }

//     /* ⚖️ WEIGHT */
//     let weight = { value: 1, unit: "kg" };
//     if (req.body.weight) {
//       weight = JSON.parse(req.body.weight);
//       if (weight.unit === "g") weight.unit = "gm";
//     }

//     /* 📁 SUBCATEGORY */
//     let subcategory = null;
//     if (req.body.subcategory) {
//       subcategory = JSON.parse(req.body.subcategory);
//     }

//     /* 💰 PRICE + DISCOUNT */
//     const basePrice = Number(req.body.basePrice);
//     const salePrice = Number(req.body.salePrice || basePrice);

//     if (isNaN(basePrice) || isNaN(salePrice)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid price",
//       });
//     }

//     const discount =
//       basePrice > salePrice ? basePrice - salePrice : 0;

//     /* ✅ CREATE PRODUCT */
//     const product = await VendorProduct.create({
//       vendor: req.vendor.id,
//       name: req.body.name,

//       category: categoryDoc._id,
//       subcategory,

//       weight,
//       image,
//       description: req.body.description || "",

//       basePrice,
//       salePrice,
//       discount,
//     });

//     res.json({ success: true, data: product });
//   } catch (err) {
//     console.error("❌ createProduct error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//    GET MY PRODUCTS (NORMAL LIST)
// ====================================================== */
// exports.getMyProducts = async (req, res) => {
//   try {
//     const products = await VendorProduct.find({
//       vendor: req.vendor.id,
//     })
//       .populate("category", "name image subcategories")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: products });
//   } catch (err) {
//     console.error("❌ getMyProducts error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//    CATEGORY → SUBCATEGORY → PRODUCTS (TREE RESPONSE)
// ====================================================== */
// exports.getVendorProductsTree = async (req, res) => {
//   try {
//     const vendorId = req.vendor.id;

//     const categories = await VendorCategory.find().lean();
//     const products = await VendorProduct.find({
//       vendor: vendorId,
//     }).lean();

//     const data = categories.map((cat) => {
//       const subcategories = (cat.subcategories || []).map((sub) => {
//         const subProducts = products
//           .filter(
//             (p) =>
//               String(p.category) === String(cat._id) &&
//               p.subcategory?.id === String(sub._id)
//           )
//           .map((p) => ({
//             _id: p._id,
//             vendorId: p.vendor, // ✅ vendor id
//             name: p.name,
//             image: p.image,
//             weight: p.weight,
//             basePrice: p.basePrice,
//             salePrice: p.salePrice,
//             discount:
//               p.basePrice > p.salePrice
//                 ? p.basePrice - p.salePrice
//                 : 0,
//           }));

//         return {
//           _id: sub._id,
//           name: sub.name,
//           image: sub.image,
//           products: subProducts,
//         };
//       });

//       return {
//         _id: cat._id,
//         name: cat.name,
//         image: cat.image,
//         subcategories,
//       };
//     });

//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ tree error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//    UPDATE PRODUCT
// ====================================================== */
// exports.updateProduct = async (req, res) => {
//   try {
//     const product = await VendorProduct.findOne({
//       _id: req.params.id,
//       vendor: req.vendor.id,
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     if (req.file) {
//       product.image = await uploadToCloudinary(req.file.buffer);
//     }

//     if (req.body.name !== undefined) product.name = req.body.name;
//     if (req.body.description !== undefined)
//       product.description = req.body.description;

//     if (req.body.weight) {
//       product.weight = JSON.parse(req.body.weight);
//     }

//     if (req.body.basePrice !== undefined) {
//       product.basePrice = Number(req.body.basePrice);
//     }

//     if (req.body.salePrice !== undefined) {
//       product.salePrice = Number(req.body.salePrice);
//     }

//     product.discount =
//       product.basePrice > product.salePrice
//         ? product.basePrice - product.salePrice
//         : 0;

//     await product.save();

//     res.json({ success: true, data: product });
//   } catch (err) {
//     console.error("❌ updateProduct error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//    DELETE PRODUCT
// ====================================================== */
// exports.deleteProduct = async (req, res) => {
//   try {
//     const deleted = await VendorProduct.deleteOne({
//       _id: req.params.id,
//       vendor: req.vendor.id,
//     });

//     if (!deleted.deletedCount) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ deleteProduct error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
const VendorProduct = require("../models/vendorProduct");
const VendorCategory = require("../models/VendorCategory");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");

/* ================= IMAGE UPLOAD ================= */
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "vendor_products" }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });

/* ======================================================
   CREATE PRODUCT
====================================================== */
exports.createProduct = async (req, res) => {
  try {
    const categoryDoc = await VendorCategory.findById(req.body.category);
    if (!categoryDoc)
      return res.status(400).json({ success: false, message: "Invalid category" });

    let image = "";
    if (req.file) image = await uploadToCloudinary(req.file.buffer);

    let weight = { value: 1, unit: "kg" };
    if (req.body.weight) {
      weight = JSON.parse(req.body.weight);
      if (weight.unit === "g") weight.unit = "gm";
    }

    let subcategory = null;
    if (req.body.subcategory) {
      try { subcategory = JSON.parse(req.body.subcategory); } catch {}
    }

    const basePrice = Number(req.body.basePrice);
    const salePrice = Number(req.body.salePrice || basePrice);

    if (isNaN(basePrice) || isNaN(salePrice))
      return res.status(400).json({ success: false, message: "Invalid price" });

    const discount = basePrice > salePrice ? basePrice - salePrice : 0;

    const product = await VendorProduct.create({
      vendor: req.vendor.id,
      name: req.body.name,
      category: categoryDoc._id,
      subcategory,
      weight,
      image,
      description: req.body.description || "",
      basePrice,
      salePrice,
      discount,
      status: req.body.status || "inactive",
    });

    res.json({ success: true, data: product });
  } catch (err) {
    console.error("❌ createProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   GET MY PRODUCTS (FLAT LIST)
====================================================== */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await VendorProduct.find({ vendor: req.vendor.id })
      .populate("category", "name image subcategories")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (err) {
    console.error("❌ getMyProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   TREE RESPONSE
====================================================== */
exports.getVendorProductsTree = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const categories = await VendorCategory.find().lean();
    const products = await VendorProduct.find({ vendor: vendorId }).lean();

    const data = categories.map((cat) => {
      const subcategories = (cat.subcategories || []).map((sub) => {
        const subProducts = products
          .filter(
            (p) =>
              String(p.category) === String(cat._id) &&
              p.subcategory?.id === String(sub._id)
          )
          .map((p) => ({
            _id: p._id,
            vendorId: p.vendor,
            name: p.name,
            image: p.image,
            weight: p.weight,
            basePrice: p.basePrice,
            salePrice: p.salePrice,
            discount: p.basePrice > p.salePrice ? p.basePrice - p.salePrice : 0,
          }));

        return { _id: sub._id, name: sub.name, image: sub.image, products: subProducts };
      });

      return { _id: cat._id, name: cat.name, image: cat.image, subcategories };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ tree error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   UPDATE PRODUCT
====================================================== */
exports.updateProduct = async (req, res) => {
  try {
    const product = await VendorProduct.findOne({
      _id: req.params.id,
      vendor: req.vendor.id,
    });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    if (req.file) product.image = await uploadToCloudinary(req.file.buffer);

    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.status !== undefined) product.status = req.body.status;

    if (req.body.category) product.category = req.body.category;

    if (req.body.subcategory) {
      try { product.subcategory = JSON.parse(req.body.subcategory); } catch {}
    }
    if (req.body.subcategory === "") product.subcategory = null;

    if (req.body.weight) {
      try { product.weight = JSON.parse(req.body.weight); } catch {}
    }

    if (req.body.basePrice !== undefined) product.basePrice = Number(req.body.basePrice);
    if (req.body.salePrice !== undefined) product.salePrice = Number(req.body.salePrice);

    product.discount =
      product.basePrice > product.salePrice ? product.basePrice - product.salePrice : 0;

    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    console.error("❌ updateProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   DELETE PRODUCT
====================================================== */
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await VendorProduct.deleteOne({
      _id: req.params.id,
      vendor: req.vendor.id,
    });
    if (!deleted.deletedCount)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   STATUS UPDATE
====================================================== */
exports.updateStatus = async (req, res) => {
  try {
    const updated = await VendorProduct.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor.id },
      { status: req.body.status },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   COPY PRODUCT
====================================================== */
exports.copyProduct = async (req, res) => {
  try {
    const item = await VendorProduct.findOne({
      _id: req.params.id,
      vendor: req.vendor.id,
    });
    if (!item)
      return res.status(404).json({ success: false, message: "Product not found" });

    const newItem = await VendorProduct.create({
      vendor: req.vendor.id,
      name: item.name + " (Copy)",
      category: item.category,
      subcategory: item.subcategory,
      weight: item.weight,
      image: item.image,
      description: item.description,
      basePrice: item.basePrice,
      salePrice: item.salePrice,
      discount: item.discount,
      status: "inactive",
    });

    res.json({ success: true, data: newItem });
  } catch (err) {
    console.error("❌ copyProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   BULK UPDATE
====================================================== */
exports.bulkUpdateProducts = async (req, res) => {
  try {
    const updated = [];

    for (const p of req.body.products) {
      const item = await VendorProduct.findOne({
        _id: p.id,
        vendor: req.vendor.id,
      });
      if (!item) continue;

      if (p.basePrice !== undefined) item.basePrice = Number(p.basePrice);
      if (p.salePrice !== undefined) item.salePrice = Number(p.salePrice);
      if (p.status) item.status = p.status;

      item.discount =
        item.basePrice > item.salePrice ? item.basePrice - item.salePrice : 0;

      await item.save();
      updated.push(item);
    }

    res.json({ success: true, updated });
  } catch (err) {
    console.error("❌ bulkUpdateProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   BULK DELETE
====================================================== */
exports.deleteSelected = async (req, res) => {
  try {
    await VendorProduct.deleteMany({
      _id: { $in: req.body.ids },
      vendor: req.vendor.id,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   EXPORT CSV
====================================================== */
exports.exportProducts = async (req, res) => {
  try {
    const data = await VendorProduct.find({ vendor: req.vendor.id }).populate(
      "category",
      "name"
    );

    res.setHeader("Content-Disposition", "attachment; filename=vendor_products.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    data.forEach((p) => {
      csvStream.write({
        id: p._id,
        name: p.name,
        category: p.category?.name || "",
        subcategory: p.subcategory?.name || "",
        image: p.image || "",
        weight: JSON.stringify(p.weight),
        description: p.description || "",
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        discount: p.discount,
        status: p.status,
      });
    });

    csvStream.end();
  } catch (err) {
    console.error("❌ exportProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   EXPORT SELECTED CSV
====================================================== */
exports.exportSelected = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    const data = await VendorProduct.find({
      _id: { $in: ids },
      vendor: req.vendor.id,
    }).populate("category", "name");

    res.setHeader("Content-Disposition", "attachment; filename=selected_vendor_products.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    data.forEach((p) => {
      csvStream.write({
        id: p._id,
        name: p.name,
        category: p.category?.name || "",
        subcategory: p.subcategory?.name || "",
        image: p.image || "",
        weight: JSON.stringify(p.weight),
        description: p.description || "",
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        discount: p.discount,
        status: p.status,
      });
    });

    csvStream.end();
  } catch (err) {
    console.error("❌ exportSelected error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   IMPORT CSV
====================================================== */
exports.importProducts = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "CSV file required" });

    const rows = [];
    const file = req.file.buffer.toString("utf-8");

    csv
      .parseString(file, { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        let success = 0;

        for (const r of rows) {
          try {
            const base = Number(r.basePrice || 0);
            const sale = Number(r.salePrice || base);
            const discount = base > sale ? base - sale : 0;

            /* WEIGHT */
            let weight = { value: 1, unit: "kg" };
            if (r.weight) {
              try { weight = JSON.parse(r.weight); } catch {}
            }
            if (weight.unit === "g") weight.unit = "gm";

            /* CATEGORY */
            let categoryId = null;
            if (r.category) {
              const cat = await VendorCategory.findOne({ name: r.category.trim() });
              if (!cat) {
                console.log("❌ Category not found:", r.category);
                continue;
              }
              categoryId = cat._id;
            }

            /* SUBCATEGORY */
            let subcategory = null;
            if (r.subcategory && r.category) {
              const cat = await VendorCategory.findOne({ name: r.category.trim() });
              if (cat) {
                const sub = cat.subcategories?.find(
                  (s) => s.name.toLowerCase() === r.subcategory.trim().toLowerCase()
                );
                if (sub) {
                  subcategory = { id: sub._id.toString(), name: sub.name, image: sub.image || "" };
                }
              }
            }

            /* IMAGE */
            let image = "";
            if (r.image && r.image.startsWith("http")) image = r.image.trim();

            await VendorProduct.create({
              vendor: req.vendor.id,
              name: r.name,
              category: categoryId,
              subcategory,
              weight,
              image,
              description: r.description || "",
              basePrice: base,
              salePrice: sale,
              discount,
              status: r.status || "inactive",
            });

            success++;
          } catch (e) {
            console.log("❌ Row skipped:", r.name, e.message);
          }
        }

        res.json({ success: true, imported: success });
      });
  } catch (err) {
    console.error("❌ importProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};