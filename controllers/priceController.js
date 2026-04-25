// const Price      = require("../models/priceModel");
// const cloudinary = require("../utils/cloudinary");
// const Category   = require("../models/categoryModel");
// const csv        = require("fast-csv");
// const CustomHsn  = require("../models/Customhsnmodel");

// // ─────────────────────────────────────────────
// // HSN lookup — only from DB now
// // ─────────────────────────────────────────────
// async function lookupHsn(code) {
//   if (!code) return null;
//   const clean = code.trim().toUpperCase();
//   try {
//     const found = await CustomHsn.findOne({ code: clean });
//     return found || null;
//   } catch {
//     return null;
//   }
// }

// // ─────────────────────────────────────────────
// // Cloudinary helpers
// // ─────────────────────────────────────────────
// const uploadToCloudinary = (fileBuffer, folder = "price_images") =>
//   new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder }, (err, result) => {
//         if (err) return reject(err);
//         resolve(result.secure_url);
//       })
//       .end(fileBuffer);
//   });

// async function uploadPrimaryImage(files) {
//   const arr = files?.primaryImage;
//   if (!arr || arr.length === 0) return null;
//   return uploadToCloudinary(arr[0].buffer, "price_images/primary");
// }

// async function uploadGalleryImages(files, existingGallery = [], maxTotal = 5) {
//   const newFiles = files?.galleryImages || [];
//   const slotsLeft = Math.max(0, maxTotal - existingGallery.length);
//   if (newFiles.length === 0 || slotsLeft === 0) return existingGallery;
//   const newUrls = await Promise.all(
//     newFiles.slice(0, slotsLeft).map((f) => uploadToCloudinary(f.buffer, "price_images/gallery"))
//   );
//   return [...existingGallery, ...newUrls].slice(0, maxTotal);
// }

// // ─────────────────────────────────────────────
// // Daily lock helpers
// // ─────────────────────────────────────────────
// function todayStr() {
//   const n = new Date();
//   return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
// }

// async function runDailyLock() {
//   const today = todayStr();
//   const items = await Price.find();
//   for (const p of items) {
//     if (p.lastLockDate === today) continue;
//     const created = new Date(p.createdAt);
//     const now     = new Date();
//     const createdToday =
//       created.getFullYear() === now.getFullYear() &&
//       created.getMonth()    === now.getMonth()    &&
//       created.getDate()     === now.getDate();
//     if (createdToday) continue;
//     p.yesterdayLock = p.lockedPrice || 0;
//     p.lockedPrice   = p.salePrice   || 0;
//     p.brokerDisplay = p.lockedPrice - p.yesterdayLock;
//     p.lastLockDate  = today;
//     await p.save();
//   }
// }

// async function checkAutoLock() {
//   const one = await Price.findOne();
//   if (one && one.lastLockDate !== todayStr()) await runDailyLock();
// }

// // ─────────────────────────────────────────────
// // Parsers
// // ─────────────────────────────────────────────
// function parseSub(raw) {
//   if (!raw || raw === "null") return null;
//   try {
//     const s = JSON.parse(raw);
//     if (!s || !s.id) return null;
//     return { id: s.id, name: s.name || "", image: s.image || "" };
//   } catch { return null; }
// }

// function parseSubSub(raw) {
//   if (!raw || raw === "null" || raw === "") return null;
//   try {
//     const s = JSON.parse(raw);
//     if (!s || !s.id) return null;
//     return { id: s.id, name: s.name || "", image: s.image || "" };
//   } catch { return null; }
// }

// function calcSalePrice(base, pl, gst) {
//   const withoutGst = base + pl;
//   return withoutGst + (withoutGst * gst) / 100;
// }

// function buildProduct(p) {
//   return {
//     _id:            p._id,
//     name:           p.name,
//     brand:          p.brand          || "",
//     weight:         p.weight         || { value: 1, unit: "kg" },
//     basePrice:      p.basePrice,
//     profitLoss:     p.profitLoss,
//     gstPercent:     p.gstPercent     || 0,
//     hsnCode:        p.hsnCode        || "",
//     taxType:        p.taxType        || "cgst_sgst",
//     salePrice:      p.salePrice,
//     lockedPrice:    p.lockedPrice,
//     yesterdayLock:  p.yesterdayLock,
//     brokerDisplay:  p.brokerDisplay,
//     lastLockDate:   p.lastLockDate,
//     description:    p.description,
//     image:          p.image          || "",
//     galleryImages:  p.galleryImages  || [],
//     status:         p.status,
//     createdAt:      p.createdAt,
//     subSubcategory: p.subSubcategory,
//   };
// }

// async function buildValidMaps() {
//   const allCategories  = await Category.find();
//   const validSubMap    = {};
//   const validSubSubMap = {};
//   allCategories.forEach((cat) => {
//     (cat.subcategories || []).forEach((sub) => {
//       validSubMap[String(sub._id)] = true;
//       (sub.subSubcategories || []).forEach((ss) => {
//         validSubSubMap[String(ss._id)] = true;
//       });
//     });
//   });
//   return { validSubMap, validSubSubMap };
// }

// /* ══════════════════════════════════════════════════════════════
//    HSN ROUTES — DB only (no static list)
// ══════════════════════════════════════════════════════════════ */

// // GET /api/prices/hsn-codes
// // Returns all HSN codes from DB (custom only, no static)
// exports.getHsnCodes = async (req, res) => {
//   try {
//     const { search, category } = req.query;

//     let results = await CustomHsn.find().lean();

//     // Map to standard shape
//     results = results.map((h) => ({
//       code:        h.code,
//       description: h.description,
//       gst:         h.gst,
//       category:    h.category,
//       isCustom:    true,
//       _id:         h._id,
//     }));

//     if (category) {
//       results = results.filter(
//         (h) => h.category.toLowerCase() === category.toLowerCase()
//       );
//     }

//     if (search) {
//       const q = search.toLowerCase();
//       results = results.filter(
//         (h) =>
//           h.code.includes(q) ||
//           h.description.toLowerCase().includes(q) ||
//           h.category.toLowerCase().includes(q)
//       );
//     }

//     res.json({ success: true, total: results.length, data: results });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/prices/hsn-codes/:code
// exports.getHsnByCode = async (req, res) => {
//   try {
//     const hsn = await lookupHsn(req.params.code);
//     if (!hsn) return res.status(404).json({ success: false, message: `HSN code ${req.params.code} not found` });
//     res.json({ success: true, data: hsn });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ══════════════════════════════════════════════════════════════
//    GET PRICES
// ══════════════════════════════════════════════════════════════ */
// exports.getPrices = async (req, res) => {
//   try {
//     await checkAutoLock();
//     const { validSubMap, validSubSubMap } = await buildValidMaps();
//     const prices = await Price.find().populate("category", "name image");
//     const result = {};

//     prices.forEach((p) => {
//       if (!p.category?._id) return;
//       const subId    = p.subcategory?.id    ? String(p.subcategory.id)    : null;
//       const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
//       const safeSubId    = validSubMap[subId]       ? subId    : null;
//       const safeSubSubId = validSubSubMap[subSubId] ? subSubId : null;
//       const catId     = String(p.category._id);
//       const subKey    = safeSubId    || "NO_SUB";
//       const subSubKey = safeSubSubId || "NO_SUBSUB";

//       if (!result[catId]) {
//         result[catId] = { id: p.category._id, name: p.category.name, image: p.category.image, subcategories: {} };
//       }
//       if (!result[catId].subcategories[subKey]) {
//         result[catId].subcategories[subKey] = {
//           id: p.subcategory?.id || null, name: p.subcategory?.name || "Others",
//           image: p.subcategory?.image || "", subSubcategories: {},
//         };
//       }
//       if (!result[catId].subcategories[subKey].subSubcategories[subSubKey]) {
//         result[catId].subcategories[subKey].subSubcategories[subSubKey] = {
//           id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
//           image: p.subSubcategory?.image || "", products: [],
//         };
//       }
//       result[catId].subcategories[subKey].subSubcategories[subSubKey].products.push(buildProduct(p));
//     });

//     const data = Object.values(result).map((cat) => ({
//       id: cat.id, name: cat.name, image: cat.image,
//       subcategories: Object.values(cat.subcategories).map((sub) => ({
//         id: sub.id, name: sub.name, image: sub.image,
//         subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
//       })),
//     }));

//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ getPrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getWebsitePrices = async (req, res) => {
//   try {
//     await checkAutoLock();
//     const { validSubMap, validSubSubMap } = await buildValidMaps();
//     const prices = await Price.find({ status: "active", category: { $ne: null }, subcategory: { $ne: null } }).populate("category", "name image");
//     const result = {};

//     prices.forEach((p) => {
//       const category    = p.category;
//       const subcategory = p.subcategory;
//       if (!category?._id || !subcategory?.id) return;
//       const catId    = String(category._id);
//       const subId    = String(subcategory.id);
//       const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
//       if (!validSubMap[subId]) return;
//       if (subSubId && !validSubSubMap[subSubId]) return;
//       const subSubKey = subSubId || "NO_SUBSUB";

//       if (!result[catId]) result[catId] = { id: category._id, name: category.name, image: category.image, subcategories: {} };
//       if (!result[catId].subcategories[subId]) {
//         result[catId].subcategories[subId] = { id: subcategory.id, name: subcategory.name, image: subcategory.image, subSubcategories: {} };
//       }
//       if (!result[catId].subcategories[subId].subSubcategories[subSubKey]) {
//         result[catId].subcategories[subId].subSubcategories[subSubKey] = {
//           id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
//           image: p.subSubcategory?.image || "", products: [],
//         };
//       }
//       result[catId].subcategories[subId].subSubcategories[subSubKey].products.push(buildProduct(p));
//     });

//     const data = Object.values(result).map((cat) => ({
//       id: cat.id, name: cat.name, image: cat.image,
//       subcategories: Object.values(cat.subcategories).map((sub) => ({
//         id: sub.id, name: sub.name, image: sub.image,
//         subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
//       })),
//     }));

//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ getWebsitePrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ══════════════════════════════════════════════════════════════
//    CREATE PRICE
// ══════════════════════════════════════════════════════════════ */
// exports.createPrice = async (req, res) => {
//   try {
//     console.log("📦 CREATE FILES:", req.files);
//     console.log("📦 CREATE BODY:", req.body);

//     const uploadedPrimary  = await uploadPrimaryImage(req.files);
//     const primaryImageUrl  = uploadedPrimary || req.body.existingPrimaryUrl || "";
//     const galleryImageUrls = await uploadGalleryImages(req.files, [], 5);

//     const base    = Number(req.body.basePrice || 0);
//     const pl      = Number(req.body.profitLoss || 0);
//     const hsnCode = (req.body.hsnCode || "").trim().toUpperCase();

//     // DB lookup
//     const hsnEntry = await lookupHsn(hsnCode);

//     const gst =
//       req.body.gstPercent !== undefined && req.body.gstPercent !== ""
//         ? Number(req.body.gstPercent)
//         : (hsnEntry?.gst ?? 0);

//     let weight = { value: 1, unit: "kg" };
//     if (req.body.weight) {
//       try { weight = JSON.parse(req.body.weight); } catch {}
//     }
//     if (weight.unit === "g") weight.unit = "gm";
//     if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) weight.unit = "kg";

//     const subcategory    = parseSub(req.body.subcategory);
//     const subSubcategory = parseSubSub(req.body.subSubcategory);
//     const sale           = calcSalePrice(base, pl, gst);

//     const created = await Price.create({
//       name:           req.body.name,
//       brand:          req.body.brand       || "",
//       category:       req.body.category,
//       subcategory,
//       subSubcategory,
//       weight,
//       basePrice:      base,
//       profitLoss:     pl,
//       salePrice:      sale,
//       gstPercent:     gst,
//       hsnCode,
//       taxType:        req.body.taxType     || "cgst_sgst",
//       lockedPrice:    0,
//       yesterdayLock:  0,
//       brokerDisplay:  sale,
//       lastLockDate:   "",
//       description:    req.body.description || "",
//       status:         req.body.status      || "inactive",
//       image:          primaryImageUrl,
//       galleryImages:  galleryImageUrls,
//     });

//     res.json({ success: true, data: created });
//   } catch (err) {
//     console.error("❌ CREATE ERROR:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ══════════════════════════════════════════════════════════════
//    UPDATE PRICE
// ══════════════════════════════════════════════════════════════ */
// exports.updatePrice = async (req, res) => {
//   try {
//     console.log("📦 UPDATE FILES:", req.files);
//     console.log("📦 UPDATE BODY:", req.body);

//     const item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false, message: "Product not found" });

//     // Primary Image
//     const hasPrimaryFile = req.files?.primaryImage?.length > 0;
//     const keepPrimary    = req.body.keepPrimaryImage !== "false";

//     if (hasPrimaryFile) {
//       item.image = await uploadPrimaryImage(req.files);
//     } else if (!keepPrimary) {
//       item.image = "";
//     }

//     // Gallery
//     let existingGallery = [];
//     if (req.body.existingGallery) {
//       try { existingGallery = JSON.parse(req.body.existingGallery); } catch {}
//     }
//     item.galleryImages = await uploadGalleryImages(req.files, existingGallery, 5);

//     // Basic fields
//     if (req.body.name        !== undefined) item.name        = req.body.name;
//     if (req.body.brand       !== undefined) item.brand       = req.body.brand;
//     if (req.body.category    !== undefined) item.category    = req.body.category;
//     if (req.body.status      !== undefined) item.status      = req.body.status;
//     if (req.body.description !== undefined) item.description = req.body.description;

//     if (req.body.subcategory    !== undefined) item.subcategory    = parseSub(req.body.subcategory);
//     if (req.body.subSubcategory !== undefined) item.subSubcategory = parseSubSub(req.body.subSubcategory);

//     if (req.body.weight !== undefined) {
//       try {
//         item.weight = typeof req.body.weight === "string"
//           ? JSON.parse(req.body.weight)
//           : req.body.weight;
//       } catch {}
//     }

//     if (req.body.basePrice  !== undefined) item.basePrice  = Number(req.body.basePrice);
//     if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

//     // HSN — DB lookup
//     const hsnCode  = (req.body.hsnCode || item.hsnCode || "").trim().toUpperCase();
//     item.hsnCode   = hsnCode;
//     const hsnEntry = await lookupHsn(hsnCode);

//     // GST
//     let gst;
//     if (req.body.gstPercent !== undefined && req.body.gstPercent !== "") {
//       gst = Number(req.body.gstPercent);
//     } else {
//       gst = hsnEntry?.gst ?? item.gstPercent ?? 0;
//     }
//     item.gstPercent = gst;

//     item.taxType       = req.body.taxType || item.taxType || "cgst_sgst";
//     item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), gst);
//     item.brokerDisplay = item.salePrice - item.lockedPrice;

//     await item.save();
//     res.json({ success: true, data: buildProduct(item) });
//   } catch (err) {
//     console.error("❌ Update error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ══════════════════════════════════════════════════════════════
//    COPY PRODUCT
// ══════════════════════════════════════════════════════════════ */
// exports.copyPrice = async (req, res) => {
//   try {
//     const item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false, message: "Product not found" });

//     const newItem = await Price.create({
//       name:           item.name + " (Copy)",
//       brand:          item.brand          || "",
//       category:       item.category,
//       subcategory:    item.subcategory,
//       subSubcategory: item.subSubcategory || null,
//       weight:         item.weight,
//       basePrice:      item.basePrice,
//       profitLoss:     item.profitLoss,
//       salePrice:      item.salePrice,
//       gstPercent:     item.gstPercent     || 0,
//       hsnCode:        item.hsnCode        || "",
//       taxType:        item.taxType        || "cgst_sgst",
//       lockedPrice:    0,
//       yesterdayLock:  0,
//       brokerDisplay:  0,
//       lastLockDate:   "",
//       description:    item.description,
//       status:         "inactive",
//       image:          item.image          || "",
//       galleryImages:  item.galleryImages  || [],
//     });

//     res.json({ success: true, data: newItem });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.updateDiff = async (req, res) => {
//   try {
//     const item = await Price.findById(req.params.id);
//     if (!item) return res.status(404).json({ success: false });
//     const diff      = Number(req.body.diff);
//     item.profitLoss = diff;
//     item.salePrice  = calcSalePrice(Number(item.basePrice), diff, Number(item.gstPercent || 0));
//     item.brokerDisplay = item.salePrice - item.lockedPrice;
//     await item.save();
//     res.json({ success: true, data: item });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.updateStatus = async (req, res) => {
//   try {
//     const updated = await Price.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
//     res.json({ success: true, data: updated });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.deletePrice = async (req, res) => {
//   try {
//     await Price.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.deleteSelected = async (req, res) => {
//   try {
//     await Price.deleteMany({ _id: { $in: req.body.ids } });
//     res.json({ success: true });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.bulkUpdatePrices = async (req, res) => {
//   try {
//     const updated = [];
//     for (const p of req.body.products) {
//       const item = await Price.findById(p.id);
//       if (!item) continue;
//       if (p.basePrice  !== undefined) item.basePrice  = Number(p.basePrice);
//       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);
//       if (p.gstPercent !== undefined) item.gstPercent = Number(p.gstPercent);
//       if (p.hsnCode    !== undefined) item.hsnCode    = (p.hsnCode || "").toUpperCase();
//       if (p.taxType    !== undefined) item.taxType    = p.taxType;
//       if (p.brand      !== undefined) item.brand      = p.brand;
//       if (p.status)                   item.status     = p.status;
//       item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), Number(item.gstPercent || 0));
//       item.brokerDisplay = item.salePrice - item.lockedPrice;
//       await item.save();
//       updated.push(item);
//     }
//     res.json({ success: true, updated });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.importPrices = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: "CSV file required" });
//     const rows = [];
//     csv.parseString(req.file.buffer.toString("utf-8"), { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         let successCount = 0;
//         for (const r of rows) {
//           try {
//             const base    = Number(r.basePrice || 0);
//             const pl      = Number(r.profitLoss || 0);
//             const hsnCode = (r.hsnCode || "").trim().toUpperCase();
//             const hsnEntry = await lookupHsn(hsnCode);
//             const gst = r.gstPercent ? Number(r.gstPercent) : (hsnEntry?.gst ?? 0);

//             let weight = { value: 1, unit: "kg" };
//             if (r.weight) { try { weight = JSON.parse(r.weight); } catch {} }
//             if (weight.unit === "g") weight.unit = "gm";

//             let categoryId = null;
//             if (r.category) {
//               const cat = await Category.findOne({ name: r.category.trim() });
//               if (!cat) continue;
//               categoryId = cat._id;
//             }

//             let subcategory = null, subSubcategory = null;
//             if (r.subcategory && r.category) {
//               const cat = await Category.findOne({ name: r.category.trim() });
//               if (cat) {
//                 const sub = cat.subcategories?.find((s) => s.name.toLowerCase() === r.subcategory.trim().toLowerCase());
//                 if (sub) subcategory = { id: sub._id.toString(), name: sub.name, image: sub.image || "" };
//               }
//             }
//             if (r.subSubcategory && subcategory) {
//               const cat = await Category.findOne({ name: r.category.trim() });
//               if (cat) {
//                 const sub = cat.subcategories?.find((s) => s._id.toString() === subcategory.id);
//                 if (sub) {
//                   const ss = (sub.subSubcategories || []).find((x) => x.name.toLowerCase() === r.subSubcategory.trim().toLowerCase());
//                   if (ss) subSubcategory = { id: ss._id.toString(), name: ss.name, image: ss.image || "" };
//                 }
//               }
//             }

//             const imageUrl = r.image && r.image.startsWith("http") ? r.image.trim() : "";
//             const sale = calcSalePrice(base, pl, gst);

//             await Price.create({
//               name: r.name, brand: r.brand || "", category: categoryId,
//               subcategory, subSubcategory, weight,
//               basePrice: base, profitLoss: pl, salePrice: sale,
//               gstPercent: gst, hsnCode, taxType: r.taxType || "cgst_sgst",
//               lockedPrice: 0, yesterdayLock: 0, brokerDisplay: sale, lastLockDate: "",
//               description: r.description || "", status: r.status || "inactive",
//               image: imageUrl, galleryImages: [],
//             });
//             successCount++;
//           } catch (e) { console.log("❌ Row skipped:", r.name, e.message); }
//         }
//         res.json({ success: true, imported: successCount });
//       });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.exportPrices = async (req, res) => {
//   try {
//     const data = await Price.find().populate("category", "name");
//     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
//     res.setHeader("Content-Type", "text/csv");
//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);
//     data.forEach((p) => {
//       csvStream.write({
//         id: p._id, name: p.name, brand: p.brand || "",
//         category: p.category?.name || "", subcategory: p.subcategory?.name || "",
//         subSubcategory: p.subSubcategory?.name || "",
//         image: p.image || "",
//         galleryImages: (p.galleryImages || []).join("|"),
//         weight: JSON.stringify(p.weight),
//         basePrice: p.basePrice, profitLoss: p.profitLoss,
//         gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
//         taxType: p.taxType || "cgst_sgst",
//         salePrice: p.salePrice, lockedPrice: p.lockedPrice,
//         yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
//       });
//     });
//     csvStream.end();
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.exportSelected = async (req, res) => {
//   try {
//     const ids  = req.body.ids || [];
//     const data = await Price.find({ _id: { $in: ids } }).populate("category", "name");
//     res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
//     res.setHeader("Content-Type", "text/csv");
//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);
//     data.forEach((p) => {
//       csvStream.write({
//         id: p._id, name: p.name, brand: p.brand || "",
//         category: p.category?.name || "", subcategory: p.subcategory?.name || "",
//         subSubcategory: p.subSubcategory?.name || "",
//         image: p.image || "",
//         galleryImages: (p.galleryImages || []).join("|"),
//         weight: JSON.stringify(p.weight),
//         basePrice: p.basePrice, profitLoss: p.profitLoss,
//         gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
//         taxType: p.taxType || "cgst_sgst",
//         salePrice: p.salePrice, lockedPrice: p.lockedPrice,
//         yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
//       });
//     });
//     csvStream.end();
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.setGST = async (req, res) => {
//   try {
//     const { productId, gstPercent, hsnCode, taxType } = req.body;
//     const price = await Price.findById(productId);
//     if (!price) return res.status(404).json({ success: false });
//     price.gstPercent = Number(gstPercent);
//     price.hsnCode    = (hsnCode || "").toUpperCase();
//     price.taxType    = taxType;
//     await price.save();
//     res.json({ success: true, data: price });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.getGSTList = async (req, res) => {
//   try {
//     const data = await Price.find().select("name gstPercent hsnCode taxType");
//     res.json(data);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// exports.addDiscount = async (req, res) => {
//   try {
//     const { product, minQty, maxQty, discountPercent } = req.body;
//     const price = await Price.findById(product);
//     if (!price) return res.status(404).json({ success: false });
//     price.discounts.push({ minQty: Number(minQty), maxQty: Number(maxQty), discountPercent: Number(discountPercent) });
//     await price.save();
//     res.json({ success: true, data: price });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.getDiscountList = async (req, res) => {
//   try {
//     const prices = await Price.find().select("name discounts");
//     const list = [];
//     prices.forEach((p) =>
//       p.discounts.forEach((d) =>
//         list.push({ _id: d._id, product: { name: p.name }, minQty: d.minQty, maxQty: d.maxQty, discountPercent: d.discountPercent })
//       )
//     );
//     res.json(list);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

const Price      = require("../models/priceModel");
const cloudinary = require("../utils/cloudinary");
const Category   = require("../models/categoryModel");
const csv        = require("fast-csv");
const CustomHsn  = require("../models/Customhsnmodel");

// ─────────────────────────────────────────────
// HSN lookup — only from DB
// ─────────────────────────────────────────────
async function lookupHsn(code) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  try {
    const found = await CustomHsn.findOne({ code: clean });
    return found || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Cloudinary helpers
// ─────────────────────────────────────────────
const uploadToCloudinary = (fileBuffer, folder = "price_images") =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });

async function uploadPrimaryImage(files) {
  const arr = files?.primaryImage;
  if (!arr || arr.length === 0) return null;
  return uploadToCloudinary(arr[0].buffer, "price_images/primary");
}

async function uploadGalleryImages(files, existingGallery = [], maxTotal = 5) {
  const newFiles  = files?.galleryImages || [];
  const slotsLeft = Math.max(0, maxTotal - existingGallery.length);
  if (newFiles.length === 0 || slotsLeft === 0) return existingGallery;
  const newUrls = await Promise.all(
    newFiles.slice(0, slotsLeft).map((f) =>
      uploadToCloudinary(f.buffer, "price_images/gallery")
    )
  );
  return [...existingGallery, ...newUrls].slice(0, maxTotal);
}

// ─────────────────────────────────────────────
// Daily lock helpers
// ─────────────────────────────────────────────
function todayStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(
    n.getDate()
  ).padStart(2, "0")}`;
}

async function runDailyLock() {
  const today = todayStr();
  const items = await Price.find();
  for (const p of items) {
    if (p.lastLockDate === today) continue;
    const created      = new Date(p.createdAt);
    const now          = new Date();
    const createdToday =
      created.getFullYear() === now.getFullYear() &&
      created.getMonth()    === now.getMonth()    &&
      created.getDate()     === now.getDate();
    if (createdToday) continue;
    p.yesterdayLock = p.lockedPrice || 0;
    p.lockedPrice   = p.salePrice   || 0;
    p.brokerDisplay = p.lockedPrice - p.yesterdayLock;
    p.lastLockDate  = today;
    await p.save();
  }
}

async function checkAutoLock() {
  const one = await Price.findOne();
  if (one && one.lastLockDate !== todayStr()) await runDailyLock();
}

// ─────────────────────────────────────────────
// Parsers
// ─────────────────────────────────────────────
function parseSub(raw) {
  if (!raw || raw === "null") return null;
  try {
    const s = JSON.parse(raw);
    if (!s || !s.id) return null;
    return { id: s.id, name: s.name || "", image: s.image || "" };
  } catch {
    return null;
  }
}

function parseSubSub(raw) {
  if (!raw || raw === "null" || raw === "") return null;
  try {
    const s = JSON.parse(raw);
    if (!s || !s.id) return null;
    return { id: s.id, name: s.name || "", image: s.image || "" };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// GST + CESS Calculation
// ─────────────────────────────────────────────

/**
 * calcGstBreakdown
 * ──────────────────────────────────────────────────────────────
 * base        : product base price (number)
 * pl          : profit / loss added on top (number, can be negative)
 * gstPercent  : GST rate e.g. 5, 12, 18, 28  (number)
 * cessPercent : Compensation Cess rate e.g. 0, 1, 5 (number)
 * taxType     : "cgst_sgst"  →  split GST into CGST + SGST
 *               "igst"       →  full GST as IGST
 *
 * Returns all fields that are stored in the Price document.
 */
function calcGstBreakdown(base, pl, gstPercent, cessPercent, taxType) {
  const priceExcludingGst = base + pl;                                  // taxable value
  const gstAmount         = (priceExcludingGst * gstPercent)  / 100;
  const cessAmount        = (priceExcludingGst * cessPercent) / 100;
  const totalTaxAmount    = gstAmount + cessAmount;
  const salePrice         = priceExcludingGst + totalTaxAmount;

  // Split rates
  const cgstPercent = taxType === "cgst_sgst" ? gstPercent / 2 : 0;
  const sgstPercent = taxType === "cgst_sgst" ? gstPercent / 2 : 0;
  const igstPercent = taxType === "igst"      ? gstPercent     : 0;

  // Split amounts
  const cgstAmount = taxType === "cgst_sgst" ? gstAmount / 2 : 0;
  const sgstAmount = taxType === "cgst_sgst" ? gstAmount / 2 : 0;
  const igstAmount = taxType === "igst"      ? gstAmount     : 0;

  return {
    priceExcludingGst: round2(priceExcludingGst),
    gstAmount:         round2(gstAmount),
    cgstPercent:       round2(cgstPercent),
    sgstPercent:       round2(sgstPercent),
    igstPercent:       round2(igstPercent),
    cgstAmount:        round2(cgstAmount),
    sgstAmount:        round2(sgstAmount),
    igstAmount:        round2(igstAmount),
    cessAmount:        round2(cessAmount),
    totalTaxAmount:    round2(totalTaxAmount),
    salePrice:         round2(salePrice),
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ─────────────────────────────────────────────
// buildProduct — shape returned to frontend
// ─────────────────────────────────────────────
function buildProduct(p) {
  return {
    _id:               p._id,
    name:              p.name,
    brand:             p.brand            || "",
    weight:            p.weight           || { value: 1, unit: "kg" },
    basePrice:         p.basePrice,
    profitLoss:        p.profitLoss,
    // ── Tax ──
    gstPercent:        p.gstPercent       ?? 0,
    cessPercent:       p.cessPercent      ?? 0,
    hsnCode:           p.hsnCode          || "",
    taxType:           p.taxType          || "cgst_sgst",
    // ── Computed breakdown ──
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
    // ── Pricing ──
    salePrice:         p.salePrice,
    lockedPrice:       p.lockedPrice,
    yesterdayLock:     p.yesterdayLock,
    brokerDisplay:     p.brokerDisplay,
    lastLockDate:      p.lastLockDate,
    description:       p.description,
    image:             p.image             || "",
    galleryImages:     p.galleryImages     || [],
    status:            p.status,
    createdAt:         p.createdAt,
    subSubcategory:    p.subSubcategory,
  };
}

async function buildValidMaps() {
  const allCategories  = await Category.find();
  const validSubMap    = {};
  const validSubSubMap = {};
  allCategories.forEach((cat) => {
    (cat.subcategories || []).forEach((sub) => {
      validSubMap[String(sub._id)] = true;
      (sub.subSubcategories || []).forEach((ss) => {
        validSubSubMap[String(ss._id)] = true;
      });
    });
  });
  return { validSubMap, validSubSubMap };
}

/* ══════════════════════════════════════════════════════════════
   HSN ROUTES
══════════════════════════════════════════════════════════════ */
exports.getHsnCodes = async (req, res) => {
  try {
    const { search, category } = req.query;
    let results = await CustomHsn.find().lean();

    results = results.map((h) => ({
      code:        h.code,
      description: h.description,
      gst:         h.gst,
      cess:        h.cess ?? 0,
      category:    h.category,
      isCustom:    true,
      _id:         h._id,
    }));

    if (category) {
      results = results.filter(
        (h) => h.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (h) =>
          h.code.includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.category.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, total: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHsnByCode = async (req, res) => {
  try {
    const hsn = await lookupHsn(req.params.code);
    if (!hsn)
      return res
        .status(404)
        .json({ success: false, message: `HSN code ${req.params.code} not found` });
    res.json({ success: true, data: hsn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   GET PRICES
══════════════════════════════════════════════════════════════ */
exports.getPrices = async (req, res) => {
  try {
    await checkAutoLock();
    const { validSubMap, validSubSubMap } = await buildValidMaps();
    const prices = await Price.find().populate("category", "name image");
    const result = {};

    prices.forEach((p) => {
      if (!p.category?._id) return;
      const subId    = p.subcategory?.id    ? String(p.subcategory.id)    : null;
      const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
      const safeSubId    = validSubMap[subId]       ? subId    : null;
      const safeSubSubId = validSubSubMap[subSubId] ? subSubId : null;
      const catId     = String(p.category._id);
      const subKey    = safeSubId    || "NO_SUB";
      const subSubKey = safeSubSubId || "NO_SUBSUB";

      if (!result[catId]) {
        result[catId] = {
          id:            p.category._id,
          name:          p.category.name,
          image:         p.category.image,
          subcategories: {},
        };
      }
      if (!result[catId].subcategories[subKey]) {
        result[catId].subcategories[subKey] = {
          id:              p.subcategory?.id || null,
          name:            p.subcategory?.name || "Others",
          image:           p.subcategory?.image || "",
          subSubcategories: {},
        };
      }
      if (!result[catId].subcategories[subKey].subSubcategories[subSubKey]) {
        result[catId].subcategories[subKey].subSubcategories[subSubKey] = {
          id:       p.subSubcategory?.id || null,
          name:     p.subSubcategory?.name || "General",
          image:    p.subSubcategory?.image || "",
          products: [],
        };
      }
      result[catId].subcategories[subKey].subSubcategories[subSubKey].products.push(
        buildProduct(p)
      );
    });

    const data = Object.values(result).map((cat) => ({
      id:   cat.id,
      name: cat.name,
      image: cat.image,
      subcategories: Object.values(cat.subcategories).map((sub) => ({
        id:    sub.id,
        name:  sub.name,
        image: sub.image,
        subSubcategories: Object.values(sub.subSubcategories).filter(
          (ss) => ss.id !== null
        ),
      })),
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ getPrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWebsitePrices = async (req, res) => {
  try {
    await checkAutoLock();
    const { validSubMap, validSubSubMap } = await buildValidMaps();
    const prices = await Price.find({
      status:      "active",
      category:    { $ne: null },
      subcategory: { $ne: null },
    }).populate("category", "name image");
    const result = {};

    prices.forEach((p) => {
      const category    = p.category;
      const subcategory = p.subcategory;
      if (!category?._id || !subcategory?.id) return;
      const catId    = String(category._id);
      const subId    = String(subcategory.id);
      const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
      if (!validSubMap[subId]) return;
      if (subSubId && !validSubSubMap[subSubId]) return;
      const subSubKey = subSubId || "NO_SUBSUB";

      if (!result[catId])
        result[catId] = {
          id:            category._id,
          name:          category.name,
          image:         category.image,
          subcategories: {},
        };
      if (!result[catId].subcategories[subId]) {
        result[catId].subcategories[subId] = {
          id:               subcategory.id,
          name:             subcategory.name,
          image:            subcategory.image,
          subSubcategories: {},
        };
      }
      if (!result[catId].subcategories[subId].subSubcategories[subSubKey]) {
        result[catId].subcategories[subId].subSubcategories[subSubKey] = {
          id:       p.subSubcategory?.id || null,
          name:     p.subSubcategory?.name || "General",
          image:    p.subSubcategory?.image || "",
          products: [],
        };
      }
      result[catId].subcategories[subId].subSubcategories[subSubKey].products.push(
        buildProduct(p)
      );
    });

    const data = Object.values(result).map((cat) => ({
      id:   cat.id,
      name: cat.name,
      image: cat.image,
      subcategories: Object.values(cat.subcategories).map((sub) => ({
        id:    sub.id,
        name:  sub.name,
        image: sub.image,
        subSubcategories: Object.values(sub.subSubcategories).filter(
          (ss) => ss.id !== null
        ),
      })),
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ getWebsitePrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   CREATE PRICE
══════════════════════════════════════════════════════════════ */
exports.createPrice = async (req, res) => {
  try {
    console.log("📦 CREATE FILES:", req.files);
    console.log("📦 CREATE BODY:",  req.body);

    const uploadedPrimary  = await uploadPrimaryImage(req.files);
    const primaryImageUrl  = uploadedPrimary || req.body.existingPrimaryUrl || "";
    const galleryImageUrls = await uploadGalleryImages(req.files, [], 5);

    const base    = Number(req.body.basePrice  || 0);
    const pl      = Number(req.body.profitLoss || 0);
    const hsnCode = (req.body.hsnCode || "").trim().toUpperCase();

    const hsnEntry = await lookupHsn(hsnCode);

    const gst =
      req.body.gstPercent !== undefined && req.body.gstPercent !== ""
        ? Number(req.body.gstPercent)
        : (hsnEntry?.gst ?? 0);

    const cess =
      req.body.cessPercent !== undefined && req.body.cessPercent !== ""
        ? Number(req.body.cessPercent)
        : (hsnEntry?.cess ?? 0);

    let weight = { value: 1, unit: "kg" };
    if (req.body.weight) {
      try { weight = JSON.parse(req.body.weight); } catch {}
    }
    if (weight.unit === "g")  weight.unit = "gm";
    if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) weight.unit = "kg";

    const subcategory    = parseSub(req.body.subcategory);
    const subSubcategory = parseSubSub(req.body.subSubcategory);
    const taxType        = req.body.taxType || "cgst_sgst";

    const breakdown = calcGstBreakdown(base, pl, gst, cess, taxType);

    const created = await Price.create({
      name:           req.body.name,
      brand:          req.body.brand       || "",
      category:       req.body.category,
      subcategory,
      subSubcategory,
      weight,
      basePrice:      base,
      profitLoss:     pl,
      salePrice:      breakdown.salePrice,
      gstPercent:     gst,
      cessPercent:    cess,
      hsnCode,
      taxType,
      // breakdown
      priceExcludingGst: breakdown.priceExcludingGst,
      gstAmount:         breakdown.gstAmount,
      cgstPercent:       breakdown.cgstPercent,
      sgstPercent:       breakdown.sgstPercent,
      igstPercent:       breakdown.igstPercent,
      cgstAmount:        breakdown.cgstAmount,
      sgstAmount:        breakdown.sgstAmount,
      igstAmount:        breakdown.igstAmount,
      cessAmount:        breakdown.cessAmount,
      totalTaxAmount:    breakdown.totalTaxAmount,
      // lock defaults
      lockedPrice:    0,
      yesterdayLock:  0,
      brokerDisplay:  breakdown.salePrice,
      lastLockDate:   "",
      description:    req.body.description || "",
      status:         req.body.status      || "inactive",
      image:          primaryImageUrl,
      galleryImages:  galleryImageUrls,
    });

    res.json({ success: true, data: created });
  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   UPDATE PRICE
══════════════════════════════════════════════════════════════ */
exports.updatePrice = async (req, res) => {
  try {
    console.log("📦 UPDATE FILES:", req.files);
    console.log("📦 UPDATE BODY:",  req.body);

    const item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Product not found" });

    // ── Primary image ──
    const hasPrimaryFile = req.files?.primaryImage?.length > 0;
    const keepPrimary    = req.body.keepPrimaryImage !== "false";
    if (hasPrimaryFile) {
      item.image = await uploadPrimaryImage(req.files);
    } else if (!keepPrimary) {
      item.image = "";
    }

    // ── Gallery ──
    let existingGallery = [];
    if (req.body.existingGallery) {
      try { existingGallery = JSON.parse(req.body.existingGallery); } catch {}
    }
    item.galleryImages = await uploadGalleryImages(req.files, existingGallery, 5);

    // ── Basic fields ──
    if (req.body.name        !== undefined) item.name        = req.body.name;
    if (req.body.brand       !== undefined) item.brand       = req.body.brand;
    if (req.body.category    !== undefined) item.category    = req.body.category;
    if (req.body.status      !== undefined) item.status      = req.body.status;
    if (req.body.description !== undefined) item.description = req.body.description;

    if (req.body.subcategory    !== undefined) item.subcategory    = parseSub(req.body.subcategory);
    if (req.body.subSubcategory !== undefined) item.subSubcategory = parseSubSub(req.body.subSubcategory);

    if (req.body.weight !== undefined) {
      try {
        item.weight =
          typeof req.body.weight === "string"
            ? JSON.parse(req.body.weight)
            : req.body.weight;
      } catch {}
    }

    if (req.body.basePrice  !== undefined) item.basePrice  = Number(req.body.basePrice);
    if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

    // ── HSN ──
    const hsnCode  = (req.body.hsnCode || item.hsnCode || "").trim().toUpperCase();
    item.hsnCode   = hsnCode;
    const hsnEntry = await lookupHsn(hsnCode);

    // ── GST ──
    let gst;
    if (req.body.gstPercent !== undefined && req.body.gstPercent !== "") {
      gst = Number(req.body.gstPercent);
    } else {
      gst = hsnEntry?.gst ?? item.gstPercent ?? 0;
    }
    item.gstPercent = gst;

    // ── CESS ──
    let cess;
    if (req.body.cessPercent !== undefined && req.body.cessPercent !== "") {
      cess = Number(req.body.cessPercent);
    } else {
      cess = hsnEntry?.cess ?? item.cessPercent ?? 0;
    }
    item.cessPercent = cess;

    item.taxType = req.body.taxType || item.taxType || "cgst_sgst";

    // ── Recalculate breakdown ──
    const breakdown = calcGstBreakdown(
      Number(item.basePrice),
      Number(item.profitLoss || 0),
      gst,
      cess,
      item.taxType
    );

    item.salePrice         = breakdown.salePrice;
    item.priceExcludingGst = breakdown.priceExcludingGst;
    item.gstAmount         = breakdown.gstAmount;
    item.cgstPercent       = breakdown.cgstPercent;
    item.sgstPercent       = breakdown.sgstPercent;
    item.igstPercent       = breakdown.igstPercent;
    item.cgstAmount        = breakdown.cgstAmount;
    item.sgstAmount        = breakdown.sgstAmount;
    item.igstAmount        = breakdown.igstAmount;
    item.cessAmount        = breakdown.cessAmount;
    item.totalTaxAmount    = breakdown.totalTaxAmount;
    item.brokerDisplay     = item.salePrice - item.lockedPrice;

    await item.save();
    res.json({ success: true, data: buildProduct(item) });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   COPY PRODUCT
══════════════════════════════════════════════════════════════ */
exports.copyPrice = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Product not found" });

    const newItem = await Price.create({
      name:              item.name + " (Copy)",
      brand:             item.brand          || "",
      category:          item.category,
      subcategory:       item.subcategory,
      subSubcategory:    item.subSubcategory || null,
      weight:            item.weight,
      basePrice:         item.basePrice,
      profitLoss:        item.profitLoss,
      salePrice:         item.salePrice,
      gstPercent:        item.gstPercent     || 0,
      cessPercent:       item.cessPercent    || 0,
      hsnCode:           item.hsnCode        || "",
      taxType:           item.taxType        || "cgst_sgst",
      // breakdown
      priceExcludingGst: item.priceExcludingGst || 0,
      gstAmount:         item.gstAmount         || 0,
      cgstPercent:       item.cgstPercent        || 0,
      sgstPercent:       item.sgstPercent        || 0,
      igstPercent:       item.igstPercent        || 0,
      cgstAmount:        item.cgstAmount         || 0,
      sgstAmount:        item.sgstAmount         || 0,
      igstAmount:        item.igstAmount         || 0,
      cessAmount:        item.cessAmount         || 0,
      totalTaxAmount:    item.totalTaxAmount     || 0,
      // lock defaults
      lockedPrice:    0,
      yesterdayLock:  0,
      brokerDisplay:  0,
      lastLockDate:   "",
      description:    item.description,
      status:         "inactive",
      image:          item.image          || "",
      galleryImages:  item.galleryImages  || [],
    });

    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   QUICK UPDATE DIFF (profit/loss only)
══════════════════════════════════════════════════════════════ */
exports.updateDiff = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false });

    item.profitLoss = Number(req.body.diff);

    const breakdown = calcGstBreakdown(
      Number(item.basePrice),
      item.profitLoss,
      Number(item.gstPercent  || 0),
      Number(item.cessPercent || 0),
      item.taxType || "cgst_sgst"
    );

    item.salePrice         = breakdown.salePrice;
    item.priceExcludingGst = breakdown.priceExcludingGst;
    item.gstAmount         = breakdown.gstAmount;
    item.cgstPercent       = breakdown.cgstPercent;
    item.sgstPercent       = breakdown.sgstPercent;
    item.igstPercent       = breakdown.igstPercent;
    item.cgstAmount        = breakdown.cgstAmount;
    item.sgstAmount        = breakdown.sgstAmount;
    item.igstAmount        = breakdown.igstAmount;
    item.cessAmount        = breakdown.cessAmount;
    item.totalTaxAmount    = breakdown.totalTaxAmount;
    item.brokerDisplay     = item.salePrice - item.lockedPrice;

    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await Price.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSelected = async (req, res) => {
  try {
    await Price.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   BULK UPDATE
══════════════════════════════════════════════════════════════ */
exports.bulkUpdatePrices = async (req, res) => {
  try {
    const updated = [];
    for (const p of req.body.products) {
      const item = await Price.findById(p.id);
      if (!item) continue;

      if (p.basePrice  !== undefined) item.basePrice  = Number(p.basePrice);
      if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);
      if (p.gstPercent !== undefined) item.gstPercent = Number(p.gstPercent);
      if (p.cessPercent !== undefined) item.cessPercent = Number(p.cessPercent);
      if (p.hsnCode    !== undefined) item.hsnCode    = (p.hsnCode || "").toUpperCase();
      if (p.taxType    !== undefined) item.taxType    = p.taxType;
      if (p.brand      !== undefined) item.brand      = p.brand;
      if (p.status)                   item.status     = p.status;

      const breakdown = calcGstBreakdown(
        Number(item.basePrice),
        Number(item.profitLoss || 0),
        Number(item.gstPercent  || 0),
        Number(item.cessPercent || 0),
        item.taxType || "cgst_sgst"
      );

      item.salePrice         = breakdown.salePrice;
      item.priceExcludingGst = breakdown.priceExcludingGst;
      item.gstAmount         = breakdown.gstAmount;
      item.cgstPercent       = breakdown.cgstPercent;
      item.sgstPercent       = breakdown.sgstPercent;
      item.igstPercent       = breakdown.igstPercent;
      item.cgstAmount        = breakdown.cgstAmount;
      item.sgstAmount        = breakdown.sgstAmount;
      item.igstAmount        = breakdown.igstAmount;
      item.cessAmount        = breakdown.cessAmount;
      item.totalTaxAmount    = breakdown.totalTaxAmount;
      item.brokerDisplay     = item.salePrice - item.lockedPrice;

      await item.save();
      updated.push(item);
    }
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   IMPORT / EXPORT
══════════════════════════════════════════════════════════════ */
exports.importPrices = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "CSV file required" });

    const rows = [];
    csv
      .parseString(req.file.buffer.toString("utf-8"), { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        let successCount = 0;
        for (const r of rows) {
          try {
            const base    = Number(r.basePrice  || 0);
            const pl      = Number(r.profitLoss || 0);
            const hsnCode = (r.hsnCode || "").trim().toUpperCase();
            const hsnEntry = await lookupHsn(hsnCode);
            const gst  = r.gstPercent  ? Number(r.gstPercent)  : (hsnEntry?.gst  ?? 0);
            const cess = r.cessPercent ? Number(r.cessPercent) : (hsnEntry?.cess ?? 0);
            const taxType = r.taxType || "cgst_sgst";

            let weight = { value: 1, unit: "kg" };
            if (r.weight) {
              try { weight = JSON.parse(r.weight); } catch {}
            }
            if (weight.unit === "g") weight.unit = "gm";

            let categoryId = null;
            if (r.category) {
              const cat = await Category.findOne({ name: r.category.trim() });
              if (!cat) continue;
              categoryId = cat._id;
            }

            let subcategory = null, subSubcategory = null;
            if (r.subcategory && r.category) {
              const cat = await Category.findOne({ name: r.category.trim() });
              if (cat) {
                const sub = cat.subcategories?.find(
                  (s) => s.name.toLowerCase() === r.subcategory.trim().toLowerCase()
                );
                if (sub)
                  subcategory = { id: sub._id.toString(), name: sub.name, image: sub.image || "" };
              }
            }
            if (r.subSubcategory && subcategory) {
              const cat = await Category.findOne({ name: r.category.trim() });
              if (cat) {
                const sub = cat.subcategories?.find(
                  (s) => s._id.toString() === subcategory.id
                );
                if (sub) {
                  const ss = (sub.subSubcategories || []).find(
                    (x) => x.name.toLowerCase() === r.subSubcategory.trim().toLowerCase()
                  );
                  if (ss)
                    subSubcategory = { id: ss._id.toString(), name: ss.name, image: ss.image || "" };
                }
              }
            }

            const imageUrl =
              r.image && r.image.startsWith("http") ? r.image.trim() : "";

            const breakdown = calcGstBreakdown(base, pl, gst, cess, taxType);

            await Price.create({
              name:              r.name,
              brand:             r.brand || "",
              category:          categoryId,
              subcategory,
              subSubcategory,
              weight,
              basePrice:         base,
              profitLoss:        pl,
              salePrice:         breakdown.salePrice,
              gstPercent:        gst,
              cessPercent:       cess,
              hsnCode,
              taxType,
              priceExcludingGst: breakdown.priceExcludingGst,
              gstAmount:         breakdown.gstAmount,
              cgstPercent:       breakdown.cgstPercent,
              sgstPercent:       breakdown.sgstPercent,
              igstPercent:       breakdown.igstPercent,
              cgstAmount:        breakdown.cgstAmount,
              sgstAmount:        breakdown.sgstAmount,
              igstAmount:        breakdown.igstAmount,
              cessAmount:        breakdown.cessAmount,
              totalTaxAmount:    breakdown.totalTaxAmount,
              lockedPrice:       0,
              yesterdayLock:     0,
              brokerDisplay:     breakdown.salePrice,
              lastLockDate:      "",
              description:       r.description || "",
              status:            r.status       || "inactive",
              image:             imageUrl,
              galleryImages:     [],
            });
            successCount++;
          } catch (e) {
            console.log("❌ Row skipped:", r.name, e.message);
          }
        }
        res.json({ success: true, imported: successCount });
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportPrices = async (req, res) => {
  try {
    const data = await Price.find().populate("category", "name");
    res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
    res.setHeader("Content-Type", "text/csv");
    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);
    data.forEach((p) => {
      csvStream.write({
        id:                p._id,
        name:              p.name,
        brand:             p.brand              || "",
        category:          p.category?.name     || "",
        subcategory:       p.subcategory?.name  || "",
        subSubcategory:    p.subSubcategory?.name || "",
        image:             p.image              || "",
        galleryImages:     (p.galleryImages || []).join("|"),
        weight:            JSON.stringify(p.weight),
        basePrice:         p.basePrice,
        profitLoss:        p.profitLoss,
        gstPercent:        p.gstPercent          || 0,
        cessPercent:       p.cessPercent         || 0,
        hsnCode:           p.hsnCode             || "",
        taxType:           p.taxType             || "cgst_sgst",
        priceExcludingGst: p.priceExcludingGst   || 0,
        gstAmount:         p.gstAmount           || 0,
        cgstPercent:       p.cgstPercent         || 0,
        sgstPercent:       p.sgstPercent         || 0,
        igstPercent:       p.igstPercent         || 0,
        cgstAmount:        p.cgstAmount          || 0,
        sgstAmount:        p.sgstAmount          || 0,
        igstAmount:        p.igstAmount          || 0,
        cessAmount:        p.cessAmount          || 0,
        totalTaxAmount:    p.totalTaxAmount      || 0,
        salePrice:         p.salePrice,
        lockedPrice:       p.lockedPrice,
        yesterdayLock:     p.yesterdayLock,
        brokerDisplay:     p.brokerDisplay,
        status:            p.status,
      });
    });
    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportSelected = async (req, res) => {
  try {
    const ids  = req.body.ids || [];
    const data = await Price.find({ _id: { $in: ids } }).populate("category", "name");
    res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
    res.setHeader("Content-Type", "text/csv");
    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);
    data.forEach((p) => {
      csvStream.write({
        id:                p._id,
        name:              p.name,
        brand:             p.brand              || "",
        category:          p.category?.name     || "",
        subcategory:       p.subcategory?.name  || "",
        subSubcategory:    p.subSubcategory?.name || "",
        image:             p.image              || "",
        galleryImages:     (p.galleryImages || []).join("|"),
        weight:            JSON.stringify(p.weight),
        basePrice:         p.basePrice,
        profitLoss:        p.profitLoss,
        gstPercent:        p.gstPercent          || 0,
        cessPercent:       p.cessPercent         || 0,
        hsnCode:           p.hsnCode             || "",
        taxType:           p.taxType             || "cgst_sgst",
        priceExcludingGst: p.priceExcludingGst   || 0,
        gstAmount:         p.gstAmount           || 0,
        cgstPercent:       p.cgstPercent         || 0,
        sgstPercent:       p.sgstPercent         || 0,
        igstPercent:       p.igstPercent         || 0,
        cgstAmount:        p.cgstAmount          || 0,
        sgstAmount:        p.sgstAmount          || 0,
        igstAmount:        p.igstAmount          || 0,
        cessAmount:        p.cessAmount          || 0,
        totalTaxAmount:    p.totalTaxAmount      || 0,
        salePrice:         p.salePrice,
        lockedPrice:       p.lockedPrice,
        yesterdayLock:     p.yesterdayLock,
        brokerDisplay:     p.brokerDisplay,
        status:            p.status,
      });
    });
    csvStream.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   GST / CESS LIST
══════════════════════════════════════════════════════════════ */
exports.setGST = async (req, res) => {
  try {
    const { productId, gstPercent, cessPercent, hsnCode, taxType } = req.body;
    const price = await Price.findById(productId);
    if (!price) return res.status(404).json({ success: false });

    price.gstPercent  = Number(gstPercent);
    price.cessPercent = Number(cessPercent || 0);
    price.hsnCode     = (hsnCode || "").toUpperCase();
    price.taxType     = taxType;

    const breakdown = calcGstBreakdown(
      Number(price.basePrice),
      Number(price.profitLoss || 0),
      price.gstPercent,
      price.cessPercent,
      price.taxType
    );
    price.salePrice         = breakdown.salePrice;
    price.priceExcludingGst = breakdown.priceExcludingGst;
    price.gstAmount         = breakdown.gstAmount;
    price.cgstPercent       = breakdown.cgstPercent;
    price.sgstPercent       = breakdown.sgstPercent;
    price.igstPercent       = breakdown.igstPercent;
    price.cgstAmount        = breakdown.cgstAmount;
    price.sgstAmount        = breakdown.sgstAmount;
    price.igstAmount        = breakdown.igstAmount;
    price.cessAmount        = breakdown.cessAmount;
    price.totalTaxAmount    = breakdown.totalTaxAmount;

    await price.save();
    res.json({ success: true, data: price });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGSTList = async (req, res) => {
  try {
    const data = await Price.find().select(
      "name gstPercent cessPercent hsnCode taxType priceExcludingGst gstAmount cgstAmount sgstAmount igstAmount cessAmount totalTaxAmount salePrice"
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addDiscount = async (req, res) => {
  try {
    const { product, minQty, maxQty, discountPercent } = req.body;
    const price = await Price.findById(product);
    if (!price) return res.status(404).json({ success: false });
    price.discounts.push({
      minQty:          Number(minQty),
      maxQty:          Number(maxQty),
      discountPercent: Number(discountPercent),
    });
    await price.save();
    res.json({ success: true, data: price });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDiscountList = async (req, res) => {
  try {
    const prices = await Price.find().select("name discounts");
    const list   = [];
    prices.forEach((p) =>
      p.discounts.forEach((d) =>
        list.push({
          _id:             d._id,
          product:         { name: p.name },
          minQty:          d.minQty,
          maxQty:          d.maxQty,
          discountPercent: d.discountPercent,
        })
      )
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};