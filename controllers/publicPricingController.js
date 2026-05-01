// const VendorBulkDiscount = require("../models/VendorBulkDiscount");
// const DiscountRule = require("../models/DiscountRule");

// exports.getPublicPricing = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     let { qty } = req.query; // optional

//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID required",
//       });
//     }

//     // 🔹 Fetch admin rules
//     const adminRules = await DiscountRule.find({ product: productId })
//       .sort({ minQty: 1 })
//       .lean();

//     // 🔹 Fetch vendor rules (only active)
//     const vendorRules = await VendorBulkDiscount.find({
//       product: productId,
//       isActive: true,
//     })
//       .populate("vendor", "name shopName")
//       .sort({ minQty: 1 })
//       .lean();

//     // 👉 Merge both
//     let allPrices = [
//       ...adminRules.map(r => ({
//         source: "admin",
//         minQty: r.minQty,
//         maxQty: r.maxQty,
//         unitPrice: r.unitPrice,
//         profit: r.profit,
//       })),

//       ...vendorRules.map(r => ({
//         source: "vendor",
//         vendorId: r.vendor?._id,
//         vendorName: r.vendor?.shopName || r.vendor?.name,
//         minQty: r.minQty,
//         maxQty: r.maxQty,
//         unitPrice: r.unitPrice,
//         profit: r.profit,
//       })),
//     ];

//     // 🔃 sort
//     allPrices.sort((a, b) => a.minQty - b.minQty);

//     // 🎯 अगर qty pass ki hai → best price nikaal
//     if (qty) {
//       qty = Number(qty);

//       const applicable = allPrices.filter(p =>
//         qty >= p.minQty &&
//         (p.maxQty === null || qty <= p.maxQty)
//       );

//       if (applicable.length === 0) {
//         return res.json({
//           success: true,
//           productId,
//           qty,
//           message: "No pricing found for this quantity",
//           data: [],
//         });
//       }

//       // 🔥 lowest price winner
//       const best = applicable.reduce((prev, curr) =>
//         curr.unitPrice < prev.unitPrice ? curr : prev
//       );

//       return res.json({
//         success: true,
//         productId,
//         qty,
//         bestPrice: best,
//         allOptions: applicable,
//       });
//     }

//     // 🔹 normal response
//     return res.json({
//       success: true,
//       productId,
//       count: allPrices.length,
//       data: allPrices,
//     });

//   } catch (err) {
//     console.error("Public Pricing Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch pricing",
//     });
//   }
// };

const mongoose = require("mongoose");
const VendorBulkDiscount = require("../models/VendorBulkDiscount");
const DiscountRule = require("../models/DiscountRule");

exports.getPublicPricing = async (req, res) => {
  try {
    const { productId } = req.params;
    let { qty } = req.query;

    // ✅ Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    // ✅ qty validation
    if (qty !== undefined) {
      qty = Number(qty);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid qty",
        });
      }
    }

    // 🔥 IMPORTANT FIX
    // Admin rules (Price._id based)
    const adminRules = await DiscountRule.find({
      product: new mongoose.Types.ObjectId(productId),
    })
      .sort({ minQty: 1 })
      .lean();

    // Vendor rules (VendorProduct._id based)
    const vendorRules = await VendorBulkDiscount.find({
      product: new mongoose.Types.ObjectId(productId),
      isActive: true,
    })
      .populate("vendor", "name shopName")
      .sort({ minQty: 1 })
      .lean();

    // ✅ Merge with override (vendor > admin)
    const map = new Map();

    // Admin first
    for (let r of adminRules) {
      const key = `${r.minQty}-${r.maxQty}`;
      map.set(key, {
        source: "admin",
        minQty: r.minQty,
        maxQty: r.maxQty,
        unitPrice: r.unitPrice,
        profit: r.profit,
      });
    }

    // Vendor override
    for (let r of vendorRules) {
      const key = `${r.minQty}-${r.maxQty}`;
      map.set(key, {
        source: "vendor",
        vendorId: r.vendor?._id,
        vendorName: r.vendor?.shopName || r.vendor?.name,
        minQty: r.minQty,
        maxQty: r.maxQty,
        unitPrice: r.unitPrice,
        profit: r.profit,
      });
    }

    const allPrices = Array.from(map.values()).sort(
      (a, b) => a.minQty - b.minQty
    );

    // ❌ No pricing found
    if (allPrices.length === 0) {
      return res.json({
        success: true,
        productId,
        message: "No pricing found (admin + vendor empty)",
        data: [],
      });
    }

    // 🎯 Qty based logic
    if (qty) {
      const applicable = allPrices.filter(
        (p) =>
          qty >= p.minQty &&
          (p.maxQty === null || qty <= p.maxQty)
      );

      if (applicable.length === 0) {
        return res.json({
          success: true,
          productId,
          qty,
          message: "No pricing found for this quantity",
          data: [],
        });
      }

      const best = applicable.reduce((prev, curr) =>
        curr.unitPrice < prev.unitPrice ? curr : prev
      );

      return res.json({
        success: true,
        productId,
        qty,
        bestPrice: best,
        allOptions: applicable,
      });
    }

    // ✅ Normal response
    return res.json({
      success: true,
      productId,
      count: allPrices.length,
      data: allPrices,
    });
  } catch (err) {
    console.error("Public Pricing Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pricing",
    });
  }
};