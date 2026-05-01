const mongoose = require("mongoose");

// ── Models ────────────────────────────────────────────────────────────────────
const Price         = require("../models/priceModel");     // Admin products
const VendorProduct = require("../models/vendorProduct");  // Vendor products

/* ══════════════════════════════════════════════════════════════════════════════
   STATUS FILTER HELPER
   "active"   → { status: "active" }
   "inactive" → { status: "inactive" }
   "all"      → {}   (no filter)
   default    → { status: "active" }
══════════════════════════════════════════════════════════════════════════════ */
function statusFilter(status) {
  if (status === "inactive") return { status: "inactive" };
  if (status === "all")      return {};
  return { status: "active" }; // default
}

/* ══════════════════════════════════════════════════════════════════════════════
   SHAPE — Admin (Price model)
══════════════════════════════════════════════════════════════════════════════ */
function buildAdminProduct(p) {
  return {
    _id:               p._id,
    source:            "admin",
    adminId:           p._id,
    name:              p.name,
    brand:             p.brand             || "",
    category:          p.category          || null,
    subcategory:       p.subcategory       || null,
    subSubcategory:    p.subSubcategory    || null,
    weight:            p.weight            || { value: 1, unit: "kg" },
    description:       p.description      || "",
    image:             p.image             || "",
    galleryImages:     p.galleryImages     || [],
    basePrice:         p.basePrice         || 0,
    profitLoss:        p.profitLoss        || 0,
    salePrice:         p.salePrice         || 0,
    lockedPrice:       p.lockedPrice       || 0,
    yesterdayLock:     p.yesterdayLock     || 0,
    brokerDisplay:     p.brokerDisplay     || 0,
    gstPercent:        p.gstPercent        ?? 0,
    cessPercent:       p.cessPercent       ?? 0,
    hsnCode:           p.hsnCode           || "",
    taxType:           p.taxType           || "cgst_sgst",
    priceExcludingGst: p.priceExcludingGst ?? 0,
    gstAmount:         p.gstAmount         ?? 0,
    cgstPercent:       p.cgstPercent       ?? 0,
    sgstPercent:       p.sgstPercent       ?? 0,
    igstPercent:       p.igstPercent       ?? 0,
    cgstAmount:        p.cgstAmount        ?? 0,
    sgstAmount:        p.sgstAmount        ?? 0,
    igstAmount:        p.igstAmount        ?? 0,
    cessAmount:        p.cessAmount        ?? 0,
    totalTaxAmount:    p.totalTaxAmount    ?? 0,
    status:            p.status,
    createdAt:         p.createdAt,
    updatedAt:         p.updatedAt,
  };
}

/* ══════════════════════════════════════════════════════════════════════════════
   SHAPE — Vendor (VendorProduct model)
══════════════════════════════════════════════════════════════════════════════ */
function buildVendorProduct(p) {
  const isPopulated = p.vendor && typeof p.vendor === "object" && p.vendor._id;
  return {
    _id:               p._id,
    source:            "vendor",
    vendorId:          isPopulated ? p.vendor._id : p.vendor,
    vendorInfo:        isPopulated
                         ? {
                             _id:   p.vendor._id,
                             name:  p.vendor.name  || "",
                             email: p.vendor.email || "",
                             phone: p.vendor.phone || "",
                           }
                         : null,
    name:              p.name,
    brand:             p.brand             || "",
    category:          p.category          || null,
    subcategory:       p.subcategory       || null,
    subSubCategory:    p.subSubCategory    || null,
    weight:            p.weight            || { value: 1, unit: "kg" },
    description:       p.description      || "",
    image:             p.image             || "",
    galleryImages:     p.galleryImages     || [],
    basePrice:         p.basePrice         || 0,
    profit:            p.profit            || 0,
    salePrice:         p.salePrice         || 0,
    discount:          p.discount          || 0,
    gstPercent:        p.gstPercent        ?? 0,
    cessPercent:       p.cessPercent       ?? 0,
    hsnCode:           p.hsnCode           || "",
    taxType:           p.taxType           || "cgst_sgst",
    priceExcludingGst: p.priceExcludingGst ?? 0,
    gstAmount:         p.gstAmount         ?? 0,
    cgstPercent:       p.cgstPercent       ?? 0,
    sgstPercent:       p.sgstPercent       ?? 0,
    igstPercent:       p.igstPercent       ?? 0,
    cgstAmount:        p.cgstAmount        ?? 0,
    sgstAmount:        p.sgstAmount        ?? 0,
    igstAmount:        p.igstAmount        ?? 0,
    cessAmount:        p.cessAmount        ?? 0,
    totalTaxAmount:    p.totalTaxAmount    ?? 0,
    validTill:         p.validTill         || null,
    status:            p.status,
    createdAt:         p.createdAt,
    updatedAt:         p.updatedAt,
  };
}

/* ══════════════════════════════════════════════════════════════════════════════
   1.  GET ALL PUBLIC PRODUCTS  —  Admin + Vendor properly merged
       GET /api/public/products

   ✅ FIX 1: DB-level pagination on EACH collection separately, then merged.
             Admin products page 1 + Vendor products page 1 → merged on server.
             This ensures BOTH sources appear on every page.

   ✅ FIX 2: Only existing (non-deleted) records come — no soft-delete field
             exists so hard-deleted rows simply won't appear.

   Query params:
     source   : "admin" | "vendor" | (empty = both)
     status   : "active" (default) | "inactive" | "all"
     search   : name / brand search
     vendorId : filter vendor products to one vendor
     page     : page number  (default 1)
     limit    : items per page total (default 20, max 100)
              → internally split: half from admin, half from vendor
══════════════════════════════════════════════════════════════════════════════ */
exports.getAllPublicProducts = async (req, res) => {
  try {
    const {
      source,
      status   = "active",
      search,
      vendorId,
      page     = 1,
      limit    = 20,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    const sf           = statusFilter(status);
    const searchRegex  = search ? new RegExp(search, "i") : null;

    // ── Admin query ───────────────────────────────────────────────
    const adminQuery = { ...sf };
    if (searchRegex) adminQuery.$or = [{ name: searchRegex }, { brand: searchRegex }];

    // ── Vendor query ──────────────────────────────────────────────
    const vendorQuery = { ...sf };
    if (vendorId) {
      if (!mongoose.Types.ObjectId.isValid(vendorId))
        return res.status(400).json({ success: false, message: "Invalid vendorId" });
      vendorQuery.vendor = new mongoose.Types.ObjectId(vendorId);
    }
    if (searchRegex) vendorQuery.$or = [{ name: searchRegex }, { brand: searchRegex }];

    // ── Decide how many to fetch from each source ─────────────────
    // If source=admin only: full limit from admin, 0 from vendor (and vice versa)
    // If both: split limit half-half so both appear on every page
    let adminLimit  = 0;
    let vendorLimit = 0;

    if (!source || source === "both") {
      // Split evenly — admin gets ceil, vendor gets floor
      adminLimit  = Math.ceil(limitNum / 2);
      vendorLimit = limitNum - adminLimit;
    } else if (source === "admin") {
      adminLimit  = limitNum;
      vendorLimit = 0;
    } else if (source === "vendor") {
      adminLimit  = 0;
      vendorLimit = limitNum;
    }

    const adminSkip  = (pageNum - 1) * adminLimit;
    const vendorSkip = (pageNum - 1) * vendorLimit;

    // ── Parallel fetch from both collections ──────────────────────
    const [
      adminProducts,
      adminTotal,
      vendorProducts,
      vendorTotal,
    ] = await Promise.all([
      adminLimit > 0
        ? Price.find(adminQuery)
            .populate("category", "name image")
            .sort({ createdAt: -1 })
            .skip(adminSkip)
            .limit(adminLimit)
            .lean()
        : [],

      adminLimit > 0
        ? Price.countDocuments(adminQuery)
        : 0,

      vendorLimit > 0
        ? VendorProduct.find(vendorQuery)
            .populate("category", "name image")
            .populate("vendor", "name email phone")
            .sort({ createdAt: -1 })
            .skip(vendorSkip)
            .limit(vendorLimit)
            .lean()
        : [],

      vendorLimit > 0
        ? VendorProduct.countDocuments(vendorQuery)
        : 0,
    ]);

    // ── Shape + merge ─────────────────────────────────────────────
    // Interleave: admin[0], vendor[0], admin[1], vendor[1] ...
    // so the response always has both sources visibly mixed
    const shaped = [];
    const maxLen = Math.max(adminProducts.length, vendorProducts.length);
    for (let i = 0; i < maxLen; i++) {
      if (adminProducts[i])  shaped.push(buildAdminProduct(adminProducts[i]));
      if (vendorProducts[i]) shaped.push(buildVendorProduct(vendorProducts[i]));
    }

    const totalPages = Math.max(
      adminLimit  > 0 ? Math.ceil(adminTotal  / adminLimit)  : 0,
      vendorLimit > 0 ? Math.ceil(vendorTotal / vendorLimit) : 0,
    );

    return res.json({
      success: true,
      total: adminTotal + vendorTotal,
      page:   pageNum,
      limit:  limitNum,
      pages:  totalPages,
      counts: {
        admin:  adminTotal,
        vendor: vendorTotal,
      },
      data: shaped,
    });
  } catch (err) {
    console.error("getAllPublicProducts error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════════════════════
   2.  GET ADMIN PRODUCTS ONLY
       GET /api/public/products/admin

   Query params: status, search, page, limit
══════════════════════════════════════════════════════════════════════════════ */
exports.getAdminPublicProducts = async (req, res) => {
  try {
    const {
      status = "active",
      search,
      page   = 1,
      limit  = 20,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip     = (pageNum - 1) * limitNum;

    const query = { ...statusFilter(status) };
    if (search) {
      const rx = new RegExp(search, "i");
      query.$or = [{ name: rx }, { brand: rx }];
    }

    const [products, total] = await Promise.all([
      Price.find(query)
        .populate("category", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Price.countDocuments(query),
    ]);

    return res.json({
      success: true,
      total,
      page:   pageNum,
      limit:  limitNum,
      pages:  Math.ceil(total / limitNum),
      data:   products.map(buildAdminProduct),
    });
  } catch (err) {
    console.error("getAdminPublicProducts error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════════════════════
   3.  GET VENDOR PRODUCTS ONLY
       GET /api/public/products/vendor
       GET /api/public/products/vendor?vendorId=<ObjectId>

   Query params: vendorId, status, search, page, limit
══════════════════════════════════════════════════════════════════════════════ */
exports.getVendorPublicProducts = async (req, res) => {
  try {
    const {
      vendorId,
      status = "active",
      search,
      page   = 1,
      limit  = 20,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip     = (pageNum - 1) * limitNum;

    const query = { ...statusFilter(status) };

    if (vendorId) {
      if (!mongoose.Types.ObjectId.isValid(vendorId))
        return res.status(400).json({ success: false, message: "Invalid vendorId" });
      query.vendor = new mongoose.Types.ObjectId(vendorId);
    }

    if (search) {
      const rx = new RegExp(search, "i");
      query.$or = [{ name: rx }, { brand: rx }];
    }

    const [products, total] = await Promise.all([
      VendorProduct.find(query)
        .populate("category", "name image")
        .populate("vendor", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      VendorProduct.countDocuments(query),
    ]);

    return res.json({
      success: true,
      total,
      page:   pageNum,
      limit:  limitNum,
      pages:  Math.ceil(total / limitNum),
      data:   products.map(buildVendorProduct),
    });
  } catch (err) {
    console.error("getVendorPublicProducts error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════════════════════
   4.  GET SINGLE PRODUCT BY ID
       GET /api/public/products/:id
       GET /api/public/products/:id?source=admin   → force admin
       GET /api/public/products/:id?source=vendor  → force vendor
══════════════════════════════════════════════════════════════════════════════ */
exports.getPublicProductById = async (req, res) => {
  try {
    const { id }     = req.params;
    const { source } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid product id" });

    if (!source || source === "admin") {
      const p = await Price.findById(id).populate("category", "name image").lean();
      if (p) return res.json({ success: true, data: buildAdminProduct(p) });
    }

    if (!source || source === "vendor") {
      const p = await VendorProduct.findById(id)
        .populate("category", "name image")
        .populate("vendor", "name email phone")
        .lean();
      if (p) return res.json({ success: true, data: buildVendorProduct(p) });
    }

    return res.status(404).json({ success: false, message: "Product not found" });
  } catch (err) {
    console.error("getPublicProductById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════════════════════
   5.  GET PRODUCTS TREE  (category → subcategory → subSub → products)
       GET /api/public/products/tree
       GET /api/public/products/tree?source=admin | vendor
       GET /api/public/products/tree?status=all
══════════════════════════════════════════════════════════════════════════════ */
exports.getPublicProductsTree = async (req, res) => {
  try {
    const { source, status = "active" } = req.query;
    const sf = statusFilter(status);

    // ── Admin tree ────────────────────────────────────────────────
    let adminTree = [];
    if (!source || source === "admin") {
      const products = await Price.find(sf)
        .populate("category", "name image")
        .lean();

      const catMap = {};
      for (const p of products) {
        if (!p.category?._id) continue;
        const catId  = String(p.category._id);
        const subKey = p.subcategory?.id    || "NO_SUB";
        const ssKey  = p.subSubcategory?.id || "NO_SUBSUB";

        catMap[catId] ??= {
          _id: p.category._id, name: p.category.name,
          image: p.category.image || "", source: "admin", subcategories: {},
        };
        catMap[catId].subcategories[subKey] ??= {
          id: p.subcategory?.id || null, name: p.subcategory?.name || "Others",
          image: p.subcategory?.image || "", subSubcategories: {},
        };
        catMap[catId].subcategories[subKey].subSubcategories[ssKey] ??= {
          id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
          image: p.subSubcategory?.image || "", products: [],
        };
        catMap[catId].subcategories[subKey].subSubcategories[ssKey].products.push(
          buildAdminProduct(p)
        );
      }

      adminTree = Object.values(catMap).map((c) => ({
        ...c,
        subcategories: Object.values(c.subcategories).map((s) => ({
          ...s,
          subSubcategories: Object.values(s.subSubcategories),
        })),
      }));
    }

    // ── Vendor tree ───────────────────────────────────────────────
    let vendorTree = [];
    if (!source || source === "vendor") {
      const products = await VendorProduct.find(sf)
        .populate("category", "name image")
        .populate("vendor", "name email phone")
        .lean();

      const catMap = {};
      for (const p of products) {
        if (!p.category?._id) continue;
        const catId  = String(p.category._id);
        const subKey = p.subcategory?.id      || "NO_SUB";
        const ssKey  = p.subSubCategory?.id   || "NO_SUBSUB";

        catMap[catId] ??= {
          _id: p.category._id, name: p.category.name,
          image: p.category.image || "", source: "vendor", subcategories: {},
        };
        catMap[catId].subcategories[subKey] ??= {
          id: p.subcategory?.id || null, name: p.subcategory?.name || "Others",
          image: p.subcategory?.image || "", subSubcategories: {},
        };
        catMap[catId].subcategories[subKey].subSubcategories[ssKey] ??= {
          id: p.subSubCategory?.id || null, name: p.subSubCategory?.name || "General",
          image: p.subSubCategory?.image || "", products: [],
        };
        catMap[catId].subcategories[subKey].subSubcategories[ssKey].products.push(
          buildVendorProduct(p)
        );
      }

      vendorTree = Object.values(catMap).map((c) => ({
        ...c,
        subcategories: Object.values(c.subcategories).map((s) => ({
          ...s,
          subSubcategories: Object.values(s.subSubcategories),
        })),
      }));
    }

    return res.json({
      success: true,
      data: { admin: adminTree, vendor: vendorTree },
    });
  } catch (err) {
    console.error("getPublicProductsTree error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};