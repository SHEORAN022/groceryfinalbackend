
// // // const Price      = require("../models/priceModel");
// // // const cloudinary = require("../utils/cloudinary");
// // // const Category   = require("../models/categoryModel");
// // // const csv        = require("fast-csv");

// // // /* ══════════════════════════════════════════════════════════════
// // //    HSN MASTER DATA
// // // ══════════════════════════════════════════════════════════════ */
// // // const HSN_CODES = [
// // //   // Dairy & Eggs
// // //   { code: "0401", description: "Milk & Cream (not concentrated, no added sugar)", gst: 0,  category: "Dairy & Eggs" },
// // //   { code: "0402", description: "Milk & Cream (concentrated or with added sugar)",  gst: 5,  category: "Dairy & Eggs" },
// // //   { code: "0403", description: "Buttermilk, Curd, Yoghurt, Kefir",                gst: 5,  category: "Dairy & Eggs" },
// // //   { code: "0404", description: "Whey & Products of Natural Milk Constituents",     gst: 5,  category: "Dairy & Eggs" },
// // //   { code: "0405", description: "Butter & Other Fats / Oils Derived from Milk",    gst: 12, category: "Dairy & Eggs" },
// // //   { code: "0406", description: "Cheese & Curd",                                   gst: 12, category: "Dairy & Eggs" },
// // //   { code: "0407", description: "Birds' Eggs in Shell — Fresh or Preserved",       gst: 0,  category: "Dairy & Eggs" },
// // //   { code: "0408", description: "Birds' Eggs (not in shell) & Egg Yolks",          gst: 5,  category: "Dairy & Eggs" },
// // //   // Meat & Poultry
// // //   { code: "0201", description: "Meat of Bovine Animals (fresh or chilled)",       gst: 0,  category: "Meat & Poultry" },
// // //   { code: "0202", description: "Meat of Bovine Animals (frozen)",                 gst: 0,  category: "Meat & Poultry" },
// // //   { code: "0207", description: "Meat & Edible Offal of Poultry",                  gst: 0,  category: "Meat & Poultry" },
// // //   { code: "0210", description: "Meat & Offal (salted, dried or smoked)",          gst: 12, category: "Meat & Poultry" },
// // //   // Fish & Seafood
// // //   { code: "0302", description: "Fish — Fresh or Chilled (excluding fillets)",     gst: 0,  category: "Fish & Seafood" },
// // //   { code: "0303", description: "Fish (frozen, excluding fillets)",                 gst: 0,  category: "Fish & Seafood" },
// // //   { code: "0304", description: "Fish Fillets & Other Fish Meat",                  gst: 5,  category: "Fish & Seafood" },
// // //   { code: "0306", description: "Crustaceans — Prawns, Shrimps, Crabs, Lobsters", gst: 5,  category: "Fish & Seafood" },
// // //   // Vegetables
// // //   { code: "0701", description: "Potatoes (fresh or chilled)",                     gst: 0,  category: "Vegetables" },
// // //   { code: "0702", description: "Tomatoes (fresh or chilled)",                     gst: 0,  category: "Vegetables" },
// // //   { code: "0703", description: "Onions, Shallots, Garlic, Leeks",                 gst: 0,  category: "Vegetables" },
// // //   { code: "0704", description: "Cabbages, Cauliflowers, Kohlrabi, Kale",          gst: 0,  category: "Vegetables" },
// // //   { code: "0706", description: "Carrots, Turnips, Beetroot, Radishes",            gst: 0,  category: "Vegetables" },
// // //   { code: "0707", description: "Cucumbers & Gherkins (fresh or chilled)",         gst: 0,  category: "Vegetables" },
// // //   { code: "0709", description: "Other Vegetables (fresh or chilled)",             gst: 0,  category: "Vegetables" },
// // //   { code: "0710", description: "Vegetables — Frozen",                             gst: 5,  category: "Vegetables" },
// // //   { code: "0711", description: "Vegetables (provisionally preserved)",            gst: 5,  category: "Vegetables" },
// // //   // Fruits & Nuts
// // //   { code: "0801", description: "Coconuts, Brazil Nuts, Cashew Nuts",              gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0802", description: "Almonds, Walnuts, Hazelnuts, Pistachios",         gst: 5,  category: "Fruits & Nuts" },
// // //   { code: "0803", description: "Bananas (fresh or dried)",                        gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0804", description: "Dates, Figs, Pineapples, Avocados, Mangoes",      gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0805", description: "Citrus Fruits — Oranges, Lemons, Limes",         gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0806", description: "Grapes (fresh or dried)",                         gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0807", description: "Melons, Watermelons & Papayas",                   gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0808", description: "Apples, Pears, Quinces",                          gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0809", description: "Apricots, Cherries, Peaches, Plums",              gst: 0,  category: "Fruits & Nuts" },
// // //   { code: "0810", description: "Strawberries, Raspberries, Kiwis & Other Fruits", gst: 0,  category: "Fruits & Nuts" },
// // //   // Cereals & Grains
// // //   { code: "1001", description: "Wheat & Meslin",                                  gst: 0,  category: "Cereals & Grains" },
// // //   { code: "1003", description: "Barley",                                           gst: 0,  category: "Cereals & Grains" },
// // //   { code: "1006", description: "Rice",                                             gst: 0,  category: "Cereals & Grains" },
// // //   { code: "1008", description: "Buckwheat, Millet, Canary Seeds, Other Cereals",  gst: 0,  category: "Cereals & Grains" },
// // //   // Flour & Milling
// // //   { code: "1101", description: "Wheat or Meslin Flour (Maida, Atta)",             gst: 0,  category: "Flour & Milling" },
// // //   { code: "1102", description: "Cereal Flours — Corn, Rice (other than wheat)",   gst: 0,  category: "Flour & Milling" },
// // //   { code: "1105", description: "Flour, Meal, Powder & Flakes of Potato",          gst: 5,  category: "Flour & Milling" },
// // //   { code: "1108", description: "Starches — Wheat, Corn, Potato, Tapioca",         gst: 12, category: "Flour & Milling" },
// // //   // Pulses & Legumes
// // //   { code: "0713", description: "Dried Leguminous Vegetables — Dal, Lentils, Peas",gst: 0,  category: "Pulses & Legumes" },
// // //   { code: "1106", description: "Flour & Meal of Dried Leguminous Vegetables",     gst: 0,  category: "Pulses & Legumes" },
// // //   // Oils & Fats
// // //   { code: "1507", description: "Soya-bean Oil & Its Fractions",                   gst: 5,  category: "Oils & Fats" },
// // //   { code: "1511", description: "Palm Oil & Its Fractions",                         gst: 5,  category: "Oils & Fats" },
// // //   { code: "1512", description: "Sunflower-seed, Safflower or Cotton-seed Oil",    gst: 5,  category: "Oils & Fats" },
// // //   { code: "1513", description: "Coconut (Copra) Oil & Its Fractions",             gst: 5,  category: "Oils & Fats" },
// // //   { code: "1514", description: "Rapeseed, Mustard & Canola Oil",                  gst: 5,  category: "Oils & Fats" },
// // //   { code: "1515", description: "Other Fixed Vegetable Oils — Groundnut, Linseed", gst: 5,  category: "Oils & Fats" },
// // //   { code: "1516", description: "Hydrogenated Vegetable Fats & Oils (Vanaspati)",  gst: 5,  category: "Oils & Fats" },
// // //   // Sugar & Sweeteners
// // //   { code: "1701", description: "Cane or Beet Sugar & Chemically Pure Sucrose",    gst: 5,  category: "Sugar & Sweeteners" },
// // //   { code: "1702", description: "Lactose, Maltose, Glucose, Fructose Syrups",      gst: 18, category: "Sugar & Sweeteners" },
// // //   { code: "1703", description: "Molasses from the Extraction of Sugar",           gst: 28, category: "Sugar & Sweeteners" },
// // //   { code: "1704", description: "Sugar Confectionery (no cocoa) — Candies, Toffee",gst: 18, category: "Sugar & Sweeteners" },
// // //   // Beverages
// // //   { code: "0901", description: "Coffee (roasted or instant) & Coffee Husks",      gst: 5,  category: "Beverages" },
// // //   { code: "0902", description: "Tea (green or black, whether flavoured)",          gst: 5,  category: "Beverages" },
// // //   { code: "2201", description: "Natural Mineral Water & Aerated Water",            gst: 0,  category: "Beverages" },
// // //   { code: "2202", description: "Waters with Sugar / Flavour & Non-Alcoholic Drinks",gst: 12, category: "Beverages" },
// // //   { code: "2203", description: "Beer Made from Malt",                              gst: 28, category: "Beverages" },
// // //   { code: "1806", description: "Chocolate & Cocoa-based Food Products",            gst: 18, category: "Beverages" },
// // //   // Spices & Condiments
// // //   { code: "0904", description: "Pepper, Dried Chilli & Capsicum",                 gst: 0,  category: "Spices & Condiments" },
// // //   { code: "0906", description: "Cinnamon & Cinnamon-tree Flowers",                gst: 0,  category: "Spices & Condiments" },
// // //   { code: "0907", description: "Cloves (whole fruit, cloves & stems)",            gst: 0,  category: "Spices & Condiments" },
// // //   { code: "0908", description: "Nutmeg, Mace & Cardamoms",                        gst: 0,  category: "Spices & Condiments" },
// // //   { code: "0910", description: "Ginger, Saffron, Turmeric, Thyme, Curry Powder", gst: 0,  category: "Spices & Condiments" },
// // //   { code: "2103", description: "Sauces, Mixed Condiments & Seasonings, Mustard",  gst: 12, category: "Spices & Condiments" },
// // //   { code: "2104", description: "Soups, Broths & Homogenized Composite Food",      gst: 18, category: "Spices & Condiments" },
// // //   // Processed Foods
// // //   { code: "1601", description: "Sausages & Similar Products of Meat or Blood",    gst: 12, category: "Processed Foods" },
// // //   { code: "1602", description: "Other Prepared / Preserved Meat, Offal or Blood", gst: 12, category: "Processed Foods" },
// // //   { code: "1901", description: "Malt Extract, Infant Food, Cereal-based Preparations",gst: 18, category: "Processed Foods" },
// // //   { code: "1902", description: "Pasta, Noodles, Couscous — Uncooked",             gst: 12, category: "Processed Foods" },
// // //   { code: "1904", description: "Puffed Rice, Cornflakes, Popcorn & Breakfast Cereals",gst: 18, category: "Processed Foods" },
// // //   { code: "1905", description: "Bread, Pastry, Cakes, Biscuits & Bakery Products",gst: 0,  category: "Processed Foods" },
// // //   { code: "2005", description: "Other Prepared Vegetables (not frozen)",           gst: 12, category: "Processed Foods" },
// // //   { code: "2007", description: "Jams, Jellies, Marmalades & Fruit Purées",        gst: 12, category: "Processed Foods" },
// // //   { code: "2009", description: "Fruit Juices & Vegetable Juices",                 gst: 12, category: "Processed Foods" },
// // //   // Personal Care
// // //   { code: "3304", description: "Beauty / Makeup Preparations & Skin-care Creams", gst: 28, category: "Personal Care" },
// // //   { code: "3305", description: "Shampoos, Hair Lacquers, Hair Creams & Oils",     gst: 18, category: "Personal Care" },
// // //   { code: "3306", description: "Toothpaste, Dental Floss, Mouthwash",             gst: 18, category: "Personal Care" },
// // //   { code: "3307", description: "Shaving Products, Deodorants, Bath Preparations", gst: 28, category: "Personal Care" },
// // //   { code: "3401", description: "Soap & Organic Surface-active Products (bars)",   gst: 18, category: "Personal Care" },
// // //   // Cleaning
// // //   { code: "3402", description: "Washing Powders, Detergents & Cleaning Liquids",  gst: 18, category: "Cleaning" },
// // //   { code: "3405", description: "Polishes & Creams for Footwear, Floors, Cars",    gst: 18, category: "Cleaning" },
// // //   { code: "3808", description: "Insecticides, Rodenticides, Disinfectants",       gst: 18, category: "Cleaning" },
// // //   // Baby Products
// // //   { code: "9619", description: "Sanitary Towels, Napkins, Baby Diapers & Tampons",gst: 12, category: "Baby Products" },
// // //   // Electronics
// // //   { code: "8471", description: "Computers, Laptops, Tablets & Processing Machines",gst: 18, category: "Electronics" },
// // //   { code: "8517", description: "Telephones, Smartphones & Communication Equipment",gst: 12, category: "Electronics" },
// // //   { code: "8528", description: "Monitors, TVs, Video Projectors & Receivers",     gst: 28, category: "Electronics" },
// // //   // Stationery
// // //   { code: "4820", description: "Registers, Notebooks, Diaries, Binders, Folders", gst: 12, category: "Stationery" },
// // //   { code: "9608", description: "Ball-point, Felt-tip, Fountain Pens & Pencils",   gst: 12, category: "Stationery" },
// // //   { code: "4901", description: "Printed Books, Brochures & Similar Printed Matter",gst: 0,  category: "Stationery" },
// // // ];

// // // /* ══════════════════════════════════════════════════════════════
// // //    HSN LOOKUP HELPER
// // // ══════════════════════════════════════════════════════════════ */
// // // function lookupHsn(code) {
// // //   return HSN_CODES.find((h) => h.code === (code || "").trim()) || null;
// // // }

// // // /* ──────────────────────────────────────────────────────
// // //       CLOUDINARY UPLOAD  (single buffer → URL)
// // // ────────────────────────────────────────────────────── */
// // // const uploadToCloudinary = (fileBuffer) =>
// // //   new Promise((resolve, reject) => {
// // //     cloudinary.uploader
// // //       .upload_stream({ folder: "price_images" }, (err, result) => {
// // //         if (err) return reject(err);
// // //         resolve(result.secure_url);
// // //       })
// // //       .end(fileBuffer);
// // //   });

// // // /* ──────────────────────────────────────────────────────
// // //       UPLOAD MULTIPLE FILES  (array of multer file objects)
// // //       Returns array of Cloudinary URLs (parallel upload)
// // // ────────────────────────────────────────────────────── */
// // // async function uploadMultipleToCloudinary(files = [], limit = 4) {
// // //   if (!files || files.length === 0) return [];
// // //   return Promise.all(
// // //     files.slice(0, limit).map((f) => uploadToCloudinary(f.buffer))
// // //   );
// // // }

// // // /* ──────────────────────────────────────────────────────
// // //       MIDNIGHT AUTO LOCK
// // // ────────────────────────────────────────────────────── */
// // // function todayStr() {
// // //   const n = new Date();
// // //   return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
// // // }

// // // async function runDailyLock() {
// // //   const today = todayStr();
// // //   const items = await Price.find();
// // //   for (const p of items) {
// // //     if (p.lastLockDate === today) continue;
// // //     const created      = new Date(p.createdAt);
// // //     const now          = new Date();
// // //     const createdToday =
// // //       created.getFullYear() === now.getFullYear() &&
// // //       created.getMonth()    === now.getMonth()    &&
// // //       created.getDate()     === now.getDate();
// // //     if (createdToday) continue;
// // //     const prev      = p.lockedPrice || 0;
// // //     const sale      = p.salePrice   || 0;
// // //     p.yesterdayLock = prev;
// // //     p.lockedPrice   = sale;
// // //     p.brokerDisplay = sale - prev;
// // //     p.lastLockDate  = today;
// // //     await p.save();
// // //   }
// // //   console.log("🌙 Auto Lock Completed:", today);
// // // }

// // // async function checkAutoLock() {
// // //   const one = await Price.findOne();
// // //   if (one && one.lastLockDate !== todayStr()) {
// // //     console.log("🔥 Auto-lock Triggered via API Access");
// // //     await runDailyLock();
// // //   }
// // // }

// // // /* ──────────────────────────────────────────────────────
// // //       HELPERS
// // // ────────────────────────────────────────────────────── */
// // // function parseSub(raw) {
// // //   if (!raw || raw === "null") return null;
// // //   try {
// // //     const s = JSON.parse(raw);
// // //     if (!s || !s.id) return null;
// // //     return { id: s.id, name: s.name || "", image: s.image || "" };
// // //   } catch { return null; }
// // // }

// // // function parseSubSub(raw) {
// // //   if (!raw || raw === "null" || raw === "") return null;
// // //   try {
// // //     const s = JSON.parse(raw);
// // //     if (!s || !s.id) return null;
// // //     return { id: s.id, name: s.name || "", image: s.image || "" };
// // //   } catch { return null; }
// // // }

// // // /* ──────────────────────────────────────────────────────
// // //       buildProduct — includes multi-image fields
// // // ────────────────────────────────────────────────────── */
// // // function buildProduct(p) {
// // //   const hsnInfo = lookupHsn(p.hsnCode);

// // //   // Normalise: prefer `images[]`, fall back to legacy `image` string
// // //   const images =
// // //     p.images && p.images.length > 0
// // //       ? p.images
// // //       : p.image
// // //       ? [p.image]
// // //       : [];

// // //   return {
// // //     _id:            p._id,
// // //     name:           p.name,
// // //     brand:          p.brand          || "",
// // //     weight:         p.weight         || { value: 1, unit: "kg" },
// // //     basePrice:      p.basePrice,
// // //     profitLoss:     p.profitLoss,
// // //     gstPercent:     p.gstPercent     || 0,
// // //     hsnCode:        p.hsnCode        || "",
// // //     hsnDescription: hsnInfo?.description || "",
// // //     hsnCategory:    hsnInfo?.category    || "",
// // //     taxType:        p.taxType        || "cgst_sgst",
// // //     salePrice:      p.salePrice,
// // //     lockedPrice:    p.lockedPrice,
// // //     yesterdayLock:  p.yesterdayLock,
// // //     brokerDisplay:  p.brokerDisplay,
// // //     lastLockDate:   p.lastLockDate,
// // //     description:    p.description,
// // //     // ── multi-image ──
// // //     images,                              // full array (up to 4)
// // //     image: images[0] || "",             // primary / legacy compat
// // //     status:    p.status,
// // //     createdAt: p.createdAt,
// // //   };
// // // }

// // // function calcSalePrice(base, pl, gst) {
// // //   const withoutGst = base + pl;
// // //   return withoutGst + (withoutGst * gst) / 100;
// // // }

// // // /* ──────────────────────────────────────────────────────
// // //       VALID SUB / SUBSUB MAP BUILDER
// // // ────────────────────────────────────────────────────── */
// // // async function buildValidMaps() {
// // //   const allCategories  = await Category.find();
// // //   const validSubMap    = {};
// // //   const validSubSubMap = {};
// // //   allCategories.forEach((cat) => {
// // //     (cat.subcategories || []).forEach((sub) => {
// // //       validSubMap[String(sub._id)] = true;
// // //       (sub.subSubcategories || []).forEach((ss) => {
// // //         validSubSubMap[String(ss._id)] = true;
// // //       });
// // //     });
// // //   });
// // //   return { validSubMap, validSubSubMap };
// // // }

// // // /* ──────────────────────────────────────────────────────
// // //       HSN CODES — GET ALL
// // //       GET /api/prices/hsn-codes
// // // ────────────────────────────────────────────────────── */
// // // exports.getHsnCodes = async (req, res) => {
// // //   try {
// // //     const { search, category } = req.query;
// // //     let results = HSN_CODES;

// // //     if (category) {
// // //       results = results.filter(
// // //         (h) => h.category.toLowerCase() === category.toLowerCase()
// // //       );
// // //     }
// // //     if (search) {
// // //       const q = search.toLowerCase();
// // //       results = results.filter(
// // //         (h) =>
// // //           h.code.includes(q) ||
// // //           h.description.toLowerCase().includes(q) ||
// // //           h.category.toLowerCase().includes(q)
// // //       );
// // //     }

// // //     const grouped = results.reduce((acc, hsn) => {
// // //       if (!acc[hsn.category]) acc[hsn.category] = [];
// // //       acc[hsn.category].push(hsn);
// // //       return acc;
// // //     }, {});

// // //     res.json({
// // //       success:    true,
// // //       total:      results.length,
// // //       data:       results,
// // //       grouped,
// // //       categories: [...new Set(HSN_CODES.map((h) => h.category))],
// // //     });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       HSN CODE — LOOKUP SINGLE
// // //       GET /api/prices/hsn-codes/:code
// // // ────────────────────────────────────────────────────── */
// // // exports.getHsnByCode = async (req, res) => {
// // //   try {
// // //     const hsn = lookupHsn(req.params.code);
// // //     if (!hsn) {
// // //       return res
// // //         .status(404)
// // //         .json({ success: false, message: `HSN code ${req.params.code} not found` });
// // //     }
// // //     res.json({ success: true, data: hsn });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       GET ALL PRICES  (Admin)
// // // ────────────────────────────────────────────────────── */
// // // exports.getPrices = async (req, res) => {
// // //   try {
// // //     await checkAutoLock();
// // //     const { validSubMap, validSubSubMap } = await buildValidMaps();
// // //     const prices = await Price.find().populate("category", "name image");
// // //     const result = {};

// // //     prices.forEach((p) => {
// // //       if (!p.category?._id) return;
// // //       const subId    = p.subcategory?.id    ? String(p.subcategory.id)    : null;
// // //       const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
// // //       if (subId    && !validSubMap[subId])       return;
// // //       if (subSubId && !validSubSubMap[subSubId]) return;

// // //       const catId     = String(p.category._id);
// // //       const subKey    = subId    || "NO_SUB";
// // //       const subSubKey = subSubId || "NO_SUBSUB";

// // //       if (!result[catId]) {
// // //         result[catId] = {
// // //           id: p.category._id, name: p.category.name, image: p.category.image,
// // //           subcategories: {},
// // //         };
// // //       }
// // //       if (!result[catId].subcategories[subKey]) {
// // //         result[catId].subcategories[subKey] = {
// // //           id: p.subcategory?.id || null, name: p.subcategory?.name || "Others",
// // //           image: p.subcategory?.image || "", subSubcategories: {},
// // //         };
// // //       }
// // //       if (!result[catId].subcategories[subKey].subSubcategories[subSubKey]) {
// // //         result[catId].subcategories[subKey].subSubcategories[subSubKey] = {
// // //           id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
// // //           image: p.subSubcategory?.image || "", products: [],
// // //         };
// // //       }
// // //       result[catId].subcategories[subKey].subSubcategories[subSubKey].products.push(
// // //         buildProduct(p)
// // //       );
// // //     });

// // //     const data = Object.values(result).map((cat) => ({
// // //       id: cat.id, name: cat.name, image: cat.image,
// // //       subcategories: Object.values(cat.subcategories).map((sub) => ({
// // //         id: sub.id, name: sub.name, image: sub.image,
// // //         subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
// // //       })),
// // //     }));

// // //     res.json({ success: true, data });
// // //   } catch (err) {
// // //     console.error("❌ getPrices error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       GET WEBSITE PRICES  (Active only)
// // // ────────────────────────────────────────────────────── */
// // // exports.getWebsitePrices = async (req, res) => {
// // //   try {
// // //     await checkAutoLock();
// // //     const { validSubMap, validSubSubMap } = await buildValidMaps();
// // //     const prices = await Price.find({
// // //       status: "active", category: { $ne: null }, subcategory: { $ne: null },
// // //     }).populate("category", "name image");
// // //     const result = {};

// // //     prices.forEach((p) => {
// // //       const category    = p.category;
// // //       const subcategory = p.subcategory;
// // //       if (!category?._id || !subcategory?.id) return;
// // //       const catId    = String(category._id);
// // //       const subId    = String(subcategory.id);
// // //       const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
// // //       if (!validSubMap[subId]) return;
// // //       if (subSubId && !validSubSubMap[subSubId]) return;
// // //       const subSubKey = subSubId || "NO_SUBSUB";

// // //       if (!result[catId]) {
// // //         result[catId] = { id: category._id, name: category.name, image: category.image, subcategories: {} };
// // //       }
// // //       if (!result[catId].subcategories[subId]) {
// // //         result[catId].subcategories[subId] = {
// // //           id: subcategory.id, name: subcategory.name, image: subcategory.image, subSubcategories: {},
// // //         };
// // //       }
// // //       if (!result[catId].subcategories[subId].subSubcategories[subSubKey]) {
// // //         result[catId].subcategories[subId].subSubcategories[subSubKey] = {
// // //           id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
// // //           image: p.subSubcategory?.image || "", products: [],
// // //         };
// // //       }
// // //       result[catId].subcategories[subId].subSubcategories[subSubKey].products.push(
// // //         buildProduct(p)
// // //       );
// // //     });

// // //     const data = Object.values(result).map((cat) => ({
// // //       id: cat.id, name: cat.name, image: cat.image,
// // //       subcategories: Object.values(cat.subcategories).map((sub) => ({
// // //         id: sub.id, name: sub.name, image: sub.image,
// // //         subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
// // //       })),
// // //     }));

// // //     res.json({ success: true, data });
// // //   } catch (err) {
// // //     console.error("❌ getWebsitePrices error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       CREATE PRICE
// // //       Route must use:  upload.array("files", 4)
// // // ────────────────────────────────────────────────────── */
// // // exports.createPrice = async (req, res) => {
// // //   try {
// // //     // ── Upload all new images in parallel ──
// // //     const uploadedImages = await uploadMultipleToCloudinary(req.files, 4);

// // //     const base     = Number(req.body.basePrice);
// // //     const pl       = Number(req.body.profitLoss || 0);
// // //     const hsnCode  = req.body.hsnCode || "";
// // //     const hsnEntry = lookupHsn(hsnCode);

// // //     // Auto-fill GST from HSN if not provided
// // //     const gst =
// // //       req.body.gstPercent !== undefined && req.body.gstPercent !== ""
// // //         ? Number(req.body.gstPercent)
// // //         : (hsnEntry?.gst ?? 0);

// // //     let weight = { value: 1, unit: "kg" };
// // //     if (req.body.weight) {
// // //       try { weight = JSON.parse(req.body.weight); } catch {}
// // //     }
// // //     if (weight.unit === "g") weight.unit = "gm";
// // //     if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) weight.unit = "kg";

// // //     const subcategory    = parseSub(req.body.subcategory);
// // //     const subSubcategory = parseSubSub(req.body.subSubcategory);
// // //     const sale           = calcSalePrice(base, pl, gst);

// // //     const created = await Price.create({
// // //       name:          req.body.name,
// // //       brand:         req.body.brand       || "",
// // //       category:      req.body.category,
// // //       subcategory,
// // //       subSubcategory,
// // //       weight,
// // //       basePrice:     base,
// // //       profitLoss:    pl,
// // //       salePrice:     sale,
// // //       gstPercent:    gst,
// // //       hsnCode,
// // //       taxType:       req.body.taxType     || "cgst_sgst",
// // //       lockedPrice:   0,
// // //       yesterdayLock: 0,
// // //       brokerDisplay: sale,
// // //       lastLockDate:  "",
// // //       description:   req.body.description || "",
// // //       status:        req.body.status      || "inactive",
// // //       // ── multi-image fields ──
// // //       images: uploadedImages,                   // up to 4 URLs
// // //       image:  uploadedImages[0] || "",          // primary / legacy
// // //     });

// // //     res.json({ success: true, data: created });
// // //   } catch (err) {
// // //     console.error("❌ CREATE ERROR:", err.message);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       UPDATE PRICE
// // //       Route must use:  upload.array("files", 4)
// // // ────────────────────────────────────────────────────── */
// // // exports.updatePrice = async (req, res) => {
// // //   try {
// // //     const item = await Price.findById(req.params.id);
// // //     if (!item) return res.status(404).json({ success: false });

// // //     /* ── Image handling ──────────────────────────────────────
// // //        Frontend sends:
// // //          existingImages  → JSON array of Cloudinary URLs to KEEP
// // //          files           → any brand-new image files to upload
// // //        We merge: kept + newly-uploaded, capped at 4.
// // //     ──────────────────────────────────────────────────────── */
// // //     let existingImages = [];
// // //     if (req.body.existingImages) {
// // //       try { existingImages = JSON.parse(req.body.existingImages); } catch {}
// // //     }

// // //     // Upload new files into remaining slots
// // //     const slotsLeft      = Math.max(0, 4 - existingImages.length);
// // //     const newlyUploaded  = await uploadMultipleToCloudinary(req.files, slotsLeft);
// // //     const mergedImages   = [...existingImages, ...newlyUploaded].slice(0, 4);

// // //     item.images = mergedImages;
// // //     item.image  = mergedImages[0] || item.image || "";  // keep legacy in sync

// // //     /* ── Other fields ── */
// // //     if (req.body.category)              item.category    = req.body.category;
// // //     if (req.body.name)                  item.name        = req.body.name;
// // //     if (req.body.description)           item.description = req.body.description;
// // //     if (req.body.status)                item.status      = req.body.status;
// // //     if (req.body.brand !== undefined)   item.brand       = req.body.brand;

// // //     if (req.body.subcategory !== undefined)
// // //       item.subcategory    = parseSub(req.body.subcategory);
// // //     if (req.body.subSubcategory !== undefined)
// // //       item.subSubcategory = parseSubSub(req.body.subSubcategory);

// // //     if (req.body.weight) {
// // //       try {
// // //         item.weight =
// // //           typeof req.body.weight === "string"
// // //             ? JSON.parse(req.body.weight)
// // //             : req.body.weight;
// // //       } catch {}
// // //     }

// // //     if (req.body.basePrice  !== undefined) item.basePrice  = Number(req.body.basePrice);
// // //     if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

// // //     // HSN — auto-fill GST if HSN changed and gstPercent not explicitly sent
// // //     if (req.body.hsnCode !== undefined) {
// // //       item.hsnCode = req.body.hsnCode;
// // //       if (req.body.gstPercent === undefined || req.body.gstPercent === "") {
// // //         const hsnEntry = lookupHsn(req.body.hsnCode);
// // //         if (hsnEntry) item.gstPercent = hsnEntry.gst;
// // //       }
// // //     }

// // //     const gst =
// // //       req.body.gstPercent !== undefined && req.body.gstPercent !== ""
// // //         ? Number(req.body.gstPercent)
// // //         : Number(item.gstPercent || 0);

// // //     item.gstPercent    = gst;
// // //     item.taxType       = req.body.taxType || item.taxType || "cgst_sgst";
// // //     item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), gst);
// // //     item.brokerDisplay = item.salePrice - item.lockedPrice;

// // //     await item.save();
// // //     res.json({ success: true, data: item });
// // //   } catch (err) {
// // //     console.error("❌ Update error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       QUICK P/L UPDATE
// // // ────────────────────────────────────────────────────── */
// // // exports.updateDiff = async (req, res) => {
// // //   try {
// // //     const item = await Price.findById(req.params.id);
// // //     if (!item) return res.status(404).json({ success: false });
// // //     const diff         = Number(req.body.diff);
// // //     item.profitLoss    = diff;
// // //     item.salePrice     = calcSalePrice(Number(item.basePrice), diff, Number(item.gstPercent || 0));
// // //     item.brokerDisplay = item.salePrice - item.lockedPrice;
// // //     await item.save();
// // //     res.json({ success: true, data: item });
// // //   } catch (err) {
// // //     console.error("❌ updateDiff error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       STATUS UPDATE
// // // ────────────────────────────────────────────────────── */
// // // exports.updateStatus = async (req, res) => {
// // //   try {
// // //     const updated = await Price.findByIdAndUpdate(
// // //       req.params.id,
// // //       { status: req.body.status },
// // //       { new: true }
// // //     );
// // //     res.json({ success: true, data: updated });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       DELETE SINGLE
// // // ────────────────────────────────────────────────────── */
// // // exports.deletePrice = async (req, res) => {
// // //   try {
// // //     await Price.findByIdAndDelete(req.params.id);
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       DELETE SELECTED (bulk)
// // // ────────────────────────────────────────────────────── */
// // // exports.deleteSelected = async (req, res) => {
// // //   try {
// // //     await Price.deleteMany({ _id: { $in: req.body.ids } });
// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       COPY PRODUCT  — copies all images
// // // ────────────────────────────────────────────────────── */
// // // exports.copyPrice = async (req, res) => {
// // //   try {
// // //     const item    = await Price.findById(req.params.id);
// // //     if (!item) return res.status(404).json({ success: false, message: "Product not found" });

// // //     const newItem = await Price.create({
// // //       name:           item.name,
// // //       brand:          item.brand           || "",
// // //       category:       item.category,
// // //       subcategory:    item.subcategory,
// // //       subSubcategory: item.subSubcategory  || null,
// // //       weight:         item.weight,
// // //       basePrice:      item.basePrice,
// // //       profitLoss:     item.profitLoss,
// // //       salePrice:      item.salePrice,
// // //       gstPercent:     item.gstPercent      || 0,
// // //       hsnCode:        item.hsnCode         || "",
// // //       taxType:        item.taxType         || "cgst_sgst",
// // //       lockedPrice:    0,
// // //       yesterdayLock:  0,
// // //       brokerDisplay:  0,
// // //       lastLockDate:   "",
// // //       description:    item.description,
// // //       status:         item.status,
// // //       // ── copy all images ──
// // //       images: item.images && item.images.length > 0 ? item.images : [],
// // //       image:  item.image  || "",
// // //     });

// // //     res.json({ success: true, data: newItem });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       BULK UPDATE
// // // ────────────────────────────────────────────────────── */
// // // exports.bulkUpdatePrices = async (req, res) => {
// // //   try {
// // //     const updated = [];
// // //     for (const p of req.body.products) {
// // //       const item = await Price.findById(p.id);
// // //       if (!item) continue;

// // //       if (p.basePrice  !== undefined) item.basePrice  = Number(p.basePrice);
// // //       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);
// // //       if (p.gstPercent !== undefined) item.gstPercent = Number(p.gstPercent);
// // //       if (p.hsnCode    !== undefined) item.hsnCode    = p.hsnCode;
// // //       if (p.taxType    !== undefined) item.taxType    = p.taxType;
// // //       if (p.brand      !== undefined) item.brand      = p.brand;
// // //       if (p.status)                   item.status     = p.status;

// // //       item.salePrice     = calcSalePrice(
// // //         Number(item.basePrice),
// // //         Number(item.profitLoss || 0),
// // //         Number(item.gstPercent || 0)
// // //       );
// // //       item.brokerDisplay = item.salePrice - item.lockedPrice;
// // //       await item.save();
// // //       updated.push(item);
// // //     }
// // //     res.json({ success: true, updated });
// // //   } catch (err) {
// // //     console.error("❌ bulkUpdatePrices error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       IMPORT CSV
// // //       (CSV only supports a single image URL column)
// // // ────────────────────────────────────────────────────── */
// // // exports.importPrices = async (req, res) => {
// // //   try {
// // //     if (!req.file)
// // //       return res.status(400).json({ success: false, message: "CSV file required" });

// // //     const rows = [];
// // //     csv
// // //       .parseString(req.file.buffer.toString("utf-8"), { headers: true })
// // //       .on("data", (row) => rows.push(row))
// // //       .on("end", async () => {
// // //         let successCount = 0;
// // //         for (const r of rows) {
// // //           try {
// // //             const base     = Number(r.basePrice || 0);
// // //             const pl       = Number(r.profitLoss || 0);
// // //             const hsnCode  = r.hsnCode || "";
// // //             const hsnEntry = lookupHsn(hsnCode);
// // //             const gst      = r.gstPercent ? Number(r.gstPercent) : (hsnEntry?.gst ?? 0);

// // //             let weight = { value: 1, unit: "kg" };
// // //             if (r.weight) { try { weight = JSON.parse(r.weight); } catch {} }
// // //             if (weight.unit === "g") weight.unit = "gm";

// // //             let categoryId = null;
// // //             if (r.category) {
// // //               const cat = await Category.findOne({ name: r.category.trim() });
// // //               if (!cat) { console.log("❌ Category not found:", r.category); continue; }
// // //               categoryId = cat._id;
// // //             }

// // //             let subcategory = null;
// // //             if (r.subcategory && r.category) {
// // //               const cat = await Category.findOne({ name: r.category.trim() });
// // //               if (cat) {
// // //                 const sub = cat.subcategories?.find(
// // //                   (s) => s.name.toLowerCase() === r.subcategory.trim().toLowerCase()
// // //                 );
// // //                 if (sub)
// // //                   subcategory = { id: sub._id.toString(), name: sub.name, image: sub.image || "" };
// // //               }
// // //             }

// // //             let subSubcategory = null;
// // //             if (r.subSubcategory && subcategory) {
// // //               const cat = await Category.findOne({ name: r.category.trim() });
// // //               if (cat) {
// // //                 const sub = cat.subcategories?.find(
// // //                   (s) => s._id.toString() === subcategory.id
// // //                 );
// // //                 if (sub) {
// // //                   const ss = (sub.subSubcategories || []).find(
// // //                     (x) => x.name.toLowerCase() === r.subSubcategory.trim().toLowerCase()
// // //                   );
// // //                   if (ss)
// // //                     subSubcategory = { id: ss._id.toString(), name: ss.name, image: ss.image || "" };
// // //                 }
// // //               }
// // //             }

// // //             // CSV supports one image URL; wrap in array for `images` field
// // //             const imageUrl = r.image && r.image.startsWith("http") ? r.image.trim() : "";
// // //             const sale     = calcSalePrice(base, pl, gst);

// // //             await Price.create({
// // //               name:          r.name,
// // //               brand:         r.brand        || "",
// // //               category:      categoryId,
// // //               subcategory,
// // //               subSubcategory,
// // //               weight,
// // //               basePrice:     base,
// // //               profitLoss:    pl,
// // //               salePrice:     sale,
// // //               gstPercent:    gst,
// // //               hsnCode,
// // //               taxType:       r.taxType      || "cgst_sgst",
// // //               lockedPrice:   0,
// // //               yesterdayLock: 0,
// // //               brokerDisplay: sale,
// // //               lastLockDate:  "",
// // //               description:   r.description  || "",
// // //               status:        r.status       || "inactive",
// // //               images:        imageUrl ? [imageUrl] : [],
// // //               image:         imageUrl,
// // //             });
// // //             successCount++;
// // //           } catch (e) {
// // //             console.log("❌ Row skipped:", r.name, e.message);
// // //           }
// // //         }
// // //         res.json({ success: true, imported: successCount });
// // //       });
// // //   } catch (err) {
// // //     console.error("❌ importPrices error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       EXPORT ALL CSV
// // //       (Exports primary image + comma-joined images array)
// // // ────────────────────────────────────────────────────── */
// // // exports.exportPrices = async (req, res) => {
// // //   try {
// // //     const data = await Price.find().populate("category", "name");
// // //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// // //     res.setHeader("Content-Type", "text/csv");
// // //     const csvStream = csv.format({ headers: true });
// // //     csvStream.pipe(res);
// // //     data.forEach((p) => {
// // //       const hsnInfo  = lookupHsn(p.hsnCode);
// // //       const images   = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
// // //       csvStream.write({
// // //         id:             p._id,
// // //         name:           p.name,
// // //         brand:          p.brand               || "",
// // //         category:       p.category?.name      || "",
// // //         subcategory:    p.subcategory?.name    || "",
// // //         subSubcategory: p.subSubcategory?.name || "",
// // //         image:          images[0]             || "",   // primary image (legacy col)
// // //         images:         images.join("|"),              // all images pipe-separated
// // //         weight:         JSON.stringify(p.weight),
// // //         basePrice:      p.basePrice,
// // //         profitLoss:     p.profitLoss,
// // //         gstPercent:     p.gstPercent           || 0,
// // //         hsnCode:        p.hsnCode              || "",
// // //         hsnDescription: hsnInfo?.description   || "",
// // //         taxType:        p.taxType              || "cgst_sgst",
// // //         salePrice:      p.salePrice,
// // //         lockedPrice:    p.lockedPrice,
// // //         yesterdayLock:  p.yesterdayLock,
// // //         brokerDisplay:  p.brokerDisplay,
// // //         status:         p.status,
// // //       });
// // //     });
// // //     csvStream.end();
// // //   } catch (err) {
// // //     console.error("❌ exportPrices error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       EXPORT SELECTED CSV
// // // ────────────────────────────────────────────────────── */
// // // exports.exportSelected = async (req, res) => {
// // //   try {
// // //     const ids  = req.body.ids || [];
// // //     const data = await Price.find({ _id: { $in: ids } }).populate("category", "name");
// // //     res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
// // //     res.setHeader("Content-Type", "text/csv");
// // //     const csvStream = csv.format({ headers: true });
// // //     csvStream.pipe(res);
// // //     data.forEach((p) => {
// // //       const hsnInfo = lookupHsn(p.hsnCode);
// // //       const images  = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
// // //       csvStream.write({
// // //         id:             p._id,
// // //         name:           p.name,
// // //         brand:          p.brand               || "",
// // //         category:       p.category?.name      || "",
// // //         subcategory:    p.subcategory?.name    || "",
// // //         subSubcategory: p.subSubcategory?.name || "",
// // //         image:          images[0]             || "",
// // //         images:         images.join("|"),
// // //         weight:         JSON.stringify(p.weight),
// // //         basePrice:      p.basePrice,
// // //         profitLoss:     p.profitLoss,
// // //         gstPercent:     p.gstPercent           || 0,
// // //         hsnCode:        p.hsnCode              || "",
// // //         hsnDescription: hsnInfo?.description   || "",
// // //         taxType:        p.taxType              || "cgst_sgst",
// // //         salePrice:      p.salePrice,
// // //         lockedPrice:    p.lockedPrice,
// // //         yesterdayLock:  p.yesterdayLock,
// // //         brokerDisplay:  p.brokerDisplay,
// // //         status:         p.status,
// // //       });
// // //     });
// // //     csvStream.end();
// // //   } catch (err) {
// // //     console.error("❌ exportSelected error:", err);
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       GST
// // // ────────────────────────────────────────────────────── */
// // // exports.setGST = async (req, res) => {
// // //   try {
// // //     const { productId, gstPercent, hsnCode, taxType } = req.body;
// // //     const price = await Price.findById(productId);
// // //     if (!price) return res.status(404).json({ success: false });
// // //     price.gstPercent = Number(gstPercent);
// // //     price.hsnCode    = hsnCode;
// // //     price.taxType    = taxType;
// // //     await price.save();
// // //     res.json({ success: true, data: price });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // exports.getGSTList = async (req, res) => {
// // //   try {
// // //     const data = await Price.find().select("name gstPercent hsnCode taxType");
// // //     res.json(data);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // /* ──────────────────────────────────────────────────────
// // //       DISCOUNTS
// // // ────────────────────────────────────────────────────── */
// // // exports.addDiscount = async (req, res) => {
// // //   try {
// // //     const { product, minQty, maxQty, discountPercent } = req.body;
// // //     const price = await Price.findById(product);
// // //     if (!price) return res.status(404).json({ success: false });
// // //     price.discounts.push({
// // //       minQty:          Number(minQty),
// // //       maxQty:          Number(maxQty),
// // //       discountPercent: Number(discountPercent),
// // //     });
// // //     await price.save();
// // //     res.json({ success: true, data: price });
// // //   } catch (err) {
// // //     res.status(500).json({ success: false, message: err.message });
// // //   }
// // // };

// // // exports.getDiscountList = async (req, res) => {
// // //   try {
// // //     const prices = await Price.find().select("name discounts");
// // //     const list   = [];
// // //     prices.forEach((p) =>
// // //       p.discounts.forEach((d) =>
// // //         list.push({
// // //           _id:             d._id,
// // //           product:         { name: p.name },
// // //           minQty:          d.minQty,
// // //           maxQty:          d.maxQty,
// // //           discountPercent: d.discountPercent,
// // //         })
// // //       )
// // //     );
// // //     res.json(list);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };


// // const Price      = require("../models/priceModel");
// // const cloudinary = require("../utils/cloudinary");
// // const Category   = require("../models/categoryModel");
// // const csv        = require("fast-csv");


// // const HSN_CODES = [
// //   { code: "0401", description: "Milk & Cream (not concentrated, no added sugar)", gst: 0,  category: "Dairy & Eggs" },
// //   { code: "0402", description: "Milk & Cream (concentrated or with added sugar)",  gst: 5,  category: "Dairy & Eggs" },
// //   { code: "0403", description: "Buttermilk, Curd, Yoghurt, Kefir",                gst: 5,  category: "Dairy & Eggs" },
// //   { code: "0404", description: "Whey & Products of Natural Milk Constituents",     gst: 5,  category: "Dairy & Eggs" },
// //   { code: "0405", description: "Butter & Other Fats / Oils Derived from Milk",    gst: 12, category: "Dairy & Eggs" },
// //   { code: "0406", description: "Cheese & Curd",                                   gst: 12, category: "Dairy & Eggs" },
// //   { code: "0407", description: "Birds' Eggs in Shell — Fresh or Preserved",       gst: 0,  category: "Dairy & Eggs" },
// //   { code: "0408", description: "Birds' Eggs (not in shell) & Egg Yolks",          gst: 5,  category: "Dairy & Eggs" },
// //   { code: "0201", description: "Meat of Bovine Animals (fresh or chilled)",       gst: 0,  category: "Meat & Poultry" },
// //   { code: "0202", description: "Meat of Bovine Animals (frozen)",                 gst: 0,  category: "Meat & Poultry" },
// //   { code: "0207", description: "Meat & Edible Offal of Poultry",                  gst: 0,  category: "Meat & Poultry" },
// //   { code: "0210", description: "Meat & Offal (salted, dried or smoked)",          gst: 12, category: "Meat & Poultry" },
// //   { code: "0302", description: "Fish — Fresh or Chilled (excluding fillets)",     gst: 0,  category: "Fish & Seafood" },
// //   { code: "0303", description: "Fish (frozen, excluding fillets)",                 gst: 0,  category: "Fish & Seafood" },
// //   { code: "0304", description: "Fish Fillets & Other Fish Meat",                  gst: 5,  category: "Fish & Seafood" },
// //   { code: "0306", description: "Crustaceans — Prawns, Shrimps, Crabs, Lobsters", gst: 5,  category: "Fish & Seafood" },
// //   { code: "0701", description: "Potatoes (fresh or chilled)",                     gst: 0,  category: "Vegetables" },
// //   { code: "0702", description: "Tomatoes (fresh or chilled)",                     gst: 0,  category: "Vegetables" },
// //   { code: "0703", description: "Onions, Shallots, Garlic, Leeks",                 gst: 0,  category: "Vegetables" },
// //   { code: "0709", description: "Other Vegetables (fresh or chilled)",             gst: 0,  category: "Vegetables" },
// //   { code: "0710", description: "Vegetables — Frozen",                             gst: 5,  category: "Vegetables" },
// //   { code: "0801", description: "Coconuts, Brazil Nuts, Cashew Nuts",              gst: 0,  category: "Fruits & Nuts" },
// //   { code: "0802", description: "Almonds, Walnuts, Hazelnuts, Pistachios",         gst: 5,  category: "Fruits & Nuts" },
// //   { code: "0803", description: "Bananas (fresh or dried)",                        gst: 0,  category: "Fruits & Nuts" },
// //   { code: "0804", description: "Dates, Figs, Pineapples, Avocados, Mangoes",      gst: 0,  category: "Fruits & Nuts" },
// //   { code: "0805", description: "Citrus Fruits — Oranges, Lemons, Limes",         gst: 0,  category: "Fruits & Nuts" },
// //   { code: "1001", description: "Wheat & Meslin",                                  gst: 0,  category: "Cereals & Grains" },
// //   { code: "1006", description: "Rice",                                             gst: 0,  category: "Cereals & Grains" },
// //   { code: "1101", description: "Wheat or Meslin Flour (Maida, Atta)",             gst: 0,  category: "Flour & Milling" },
// //   { code: "0713", description: "Dried Leguminous Vegetables — Dal, Lentils, Peas",gst: 0,  category: "Pulses & Legumes" },
// //   { code: "1507", description: "Soya-bean Oil & Its Fractions",                   gst: 5,  category: "Oils & Fats" },
// //   { code: "1511", description: "Palm Oil & Its Fractions",                         gst: 5,  category: "Oils & Fats" },
// //   { code: "1512", description: "Sunflower-seed, Safflower or Cotton-seed Oil",    gst: 5,  category: "Oils & Fats" },
// //   { code: "1514", description: "Rapeseed, Mustard & Canola Oil",                  gst: 5,  category: "Oils & Fats" },
// //   { code: "1701", description: "Cane or Beet Sugar & Chemically Pure Sucrose",    gst: 5,  category: "Sugar & Sweeteners" },
// //   { code: "1704", description: "Sugar Confectionery (no cocoa) — Candies, Toffee",gst: 18, category: "Sugar & Sweeteners" },
// //   { code: "0901", description: "Coffee (roasted or instant) & Coffee Husks",      gst: 5,  category: "Beverages" },
// //   { code: "0902", description: "Tea (green or black, whether flavoured)",          gst: 5,  category: "Beverages" },
// //   { code: "2201", description: "Natural Mineral Water & Aerated Water",            gst: 0,  category: "Beverages" },
// //   { code: "2202", description: "Waters with Sugar / Flavour & Non-Alcoholic Drinks",gst: 12, category: "Beverages" },
// //   { code: "1806", description: "Chocolate & Cocoa-based Food Products",            gst: 18, category: "Beverages" },
// //   { code: "0904", description: "Pepper, Dried Chilli & Capsicum",                 gst: 0,  category: "Spices & Condiments" },
// //   { code: "0910", description: "Ginger, Saffron, Turmeric, Thyme, Curry Powder", gst: 0,  category: "Spices & Condiments" },
// //   { code: "2103", description: "Sauces, Mixed Condiments & Seasonings, Mustard",  gst: 12, category: "Spices & Condiments" },
// //   { code: "1902", description: "Pasta, Noodles, Couscous — Uncooked",             gst: 12, category: "Processed Foods" },
// //   { code: "1905", description: "Bread, Pastry, Cakes, Biscuits & Bakery Products",gst: 0,  category: "Processed Foods" },
// //   { code: "2007", description: "Jams, Jellies, Marmalades & Fruit Purées",        gst: 12, category: "Processed Foods" },
// //   { code: "2009", description: "Fruit Juices & Vegetable Juices",                 gst: 12, category: "Processed Foods" },
// //   { code: "3304", description: "Beauty / Makeup Preparations & Skin-care Creams", gst: 28, category: "Personal Care" },
// //   { code: "3305", description: "Shampoos, Hair Lacquers, Hair Creams & Oils",     gst: 18, category: "Personal Care" },
// //   { code: "3306", description: "Toothpaste, Dental Floss, Mouthwash",             gst: 18, category: "Personal Care" },
// //   { code: "3401", description: "Soap & Organic Surface-active Products (bars)",   gst: 18, category: "Personal Care" },
// //   { code: "3402", description: "Washing Powders, Detergents & Cleaning Liquids",  gst: 18, category: "Cleaning" },
// //   { code: "8517", description: "Telephones, Smartphones & Communication Equipment",gst: 12, category: "Electronics" },
// //   { code: "8528", description: "Monitors, TVs, Video Projectors & Receivers",     gst: 28, category: "Electronics" },
// //   { code: "4820", description: "Registers, Notebooks, Diaries, Binders, Folders", gst: 12, category: "Stationery" },
// //   { code: "4901", description: "Printed Books, Brochures & Similar Printed Matter",gst: 0,  category: "Stationery" },
// // ];

// // function lookupHsn(code) {
// //   return HSN_CODES.find((h) => h.code === (code || "").trim()) || null;
// // }


// // const uploadToCloudinary = (fileBuffer, folder = "price_images") =>
// //   new Promise((resolve, reject) => {
// //     cloudinary.uploader
// //       .upload_stream({ folder }, (err, result) => {
// //         if (err) return reject(err);
// //         resolve(result.secure_url);
// //       })
// //       .end(fileBuffer);
// //   });


// // async function uploadPrimaryImage(files) {
// //   const arr = files?.primaryImage;
// //   if (!arr || arr.length === 0) return null; // null = no new file uploaded
// //   return uploadToCloudinary(arr[0].buffer, "price_images/primary");
// // }


// // async function uploadGalleryImages(files, existingGallery = [], maxTotal = 3) {
// //   // existingGallery = URLs to keep (sent from frontend)
// //   const newFiles = files?.galleryImages || [];
// //   const slotsLeft = Math.max(0, maxTotal - existingGallery.length);
// //   if (newFiles.length === 0 || slotsLeft === 0) return existingGallery;

// //   const newUrls = await Promise.all(
// //     newFiles.slice(0, slotsLeft).map((f) =>
// //       uploadToCloudinary(f.buffer, "price_images/gallery")
// //     )
// //   );
// //   return [...existingGallery, ...newUrls].slice(0, maxTotal);
// // }


// // function todayStr() {
// //   const n = new Date();
// //   return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
// // }

// // async function runDailyLock() {
// //   const today = todayStr();
// //   const items = await Price.find();
// //   for (const p of items) {
// //     if (p.lastLockDate === today) continue;
// //     const created = new Date(p.createdAt);
// //     const now     = new Date();
// //     const createdToday =
// //       created.getFullYear() === now.getFullYear() &&
// //       created.getMonth()    === now.getMonth()    &&
// //       created.getDate()     === now.getDate();
// //     if (createdToday) continue;
// //     p.yesterdayLock = p.lockedPrice || 0;
// //     p.lockedPrice   = p.salePrice   || 0;
// //     p.brokerDisplay = p.lockedPrice - p.yesterdayLock;
// //     p.lastLockDate  = today;
// //     await p.save();
// //   }
// // }

// // async function checkAutoLock() {
// //   const one = await Price.findOne();
// //   if (one && one.lastLockDate !== todayStr()) await runDailyLock();
// // }

// // function parseSub(raw) {
// //   if (!raw || raw === "null") return null;
// //   try {
// //     const s = JSON.parse(raw);
// //     if (!s || !s.id) return null;
// //     return { id: s.id, name: s.name || "", image: s.image || "" };
// //   } catch { return null; }
// // }

// // function parseSubSub(raw) {
// //   if (!raw || raw === "null" || raw === "") return null;
// //   try {
// //     const s = JSON.parse(raw);
// //     if (!s || !s.id) return null;
// //     return { id: s.id, name: s.name || "", image: s.image || "" };
// //   } catch { return null; }
// // }

// // function calcSalePrice(base, pl, gst) {
// //   const withoutGst = base + pl;
// //   return withoutGst + (withoutGst * gst) / 100;
// // }


// // function buildProduct(p) {
// //   const hsnInfo = lookupHsn(p.hsnCode);
// //   return {
// //     _id:            p._id,
// //     name:           p.name,
// //     brand:          p.brand          || "",
// //     weight:         p.weight         || { value: 1, unit: "kg" },
// //     basePrice:      p.basePrice,
// //     profitLoss:     p.profitLoss,
// //     gstPercent:     p.gstPercent     || 0,
// //     hsnCode:        p.hsnCode        || "",
// //     hsnDescription: hsnInfo?.description || "",
// //     hsnCategory:    hsnInfo?.category    || "",
// //     taxType:        p.taxType        || "cgst_sgst",
// //     salePrice:      p.salePrice,
// //     lockedPrice:    p.lockedPrice,
// //     yesterdayLock:  p.yesterdayLock,
// //     brokerDisplay:  p.brokerDisplay,
// //     lastLockDate:   p.lastLockDate,
// //     description:    p.description,
// //     // ── Separate image fields ──
// //     image:         p.image         || "",          // primary image
// //     galleryImages: p.galleryImages || [],           // gallery (up to 3)
// //     status:        p.status,
// //     createdAt:     p.createdAt,
// //     subSubcategory: p.subSubcategory,
// //   };
// // }

// // async function buildValidMaps() {
// //   const allCategories  = await Category.find();
// //   const validSubMap    = {};
// //   const validSubSubMap = {};
// //   allCategories.forEach((cat) => {
// //     (cat.subcategories || []).forEach((sub) => {
// //       validSubMap[String(sub._id)] = true;
// //       (sub.subSubcategories || []).forEach((ss) => {
// //         validSubSubMap[String(ss._id)] = true;
// //       });
// //     });
// //   });
// //   return { validSubMap, validSubSubMap };
// // }

// // /* ══════════════════════════════════════════════════════════════
// //    HSN ROUTES
// // ══════════════════════════════════════════════════════════════ */
// // exports.getHsnCodes = async (req, res) => {
// //   try {
// //     const { search, category } = req.query;
// //     let results = HSN_CODES;
// //     if (category) results = results.filter((h) => h.category.toLowerCase() === category.toLowerCase());
// //     if (search) {
// //       const q = search.toLowerCase();
// //       results = results.filter(
// //         (h) => h.code.includes(q) || h.description.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)
// //       );
// //     }
// //     const grouped = results.reduce((acc, hsn) => {
// //       if (!acc[hsn.category]) acc[hsn.category] = [];
// //       acc[hsn.category].push(hsn);
// //       return acc;
// //     }, {});
// //     res.json({ success: true, total: results.length, data: results, grouped, categories: [...new Set(HSN_CODES.map((h) => h.category))] });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.getHsnByCode = async (req, res) => {
// //   try {
// //     const hsn = lookupHsn(req.params.code);
// //     if (!hsn) return res.status(404).json({ success: false, message: `HSN code ${req.params.code} not found` });
// //     res.json({ success: true, data: hsn });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };



// // exports.getPrices = async (req, res) => {
// //   try {
// //     await checkAutoLock();
// //     const { validSubMap, validSubSubMap } = await buildValidMaps();
// //     const prices = await Price.find().populate("category", "name image");

// //     const result = {};

// //     prices.forEach((p) => {
// //       if (!p.category?._id) return;

// //       const subId    = p.subcategory?.id    ? String(p.subcategory.id)    : null;
// //       const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;

// //       // ✅ FIX: never skip product
// //       const safeSubId    = validSubMap[subId]       ? subId    : null;
// //       const safeSubSubId = validSubSubMap[subSubId] ? subSubId : null;

// //       const catId     = String(p.category._id);
// //       const subKey    = safeSubId    || "NO_SUB";
// //       const subSubKey = safeSubSubId || "NO_SUBSUB";

// //       if (!result[catId]) {
// //         result[catId] = {
// //           id: p.category._id,
// //           name: p.category.name,
// //           image: p.category.image,
// //           subcategories: {},
// //         };
// //       }

// //       if (!result[catId].subcategories[subKey]) {
// //         result[catId].subcategories[subKey] = {
// //           id: p.subcategory?.id || null,
// //           name: p.subcategory?.name || "Others",
// //           image: p.subcategory?.image || "",
// //           subSubcategories: {},
// //         };
// //       }

// //       if (!result[catId].subcategories[subKey].subSubcategories[subSubKey]) {
// //         result[catId].subcategories[subKey].subSubcategories[subSubKey] = {
// //           id: p.subSubcategory?.id || null,
// //           name: p.subSubcategory?.name || "General",
// //           image: p.subSubcategory?.image || "",
// //           products: [],
// //         };
// //       }

// //       result[catId].subcategories[subKey].subSubcategories[subSubKey].products.push(
// //         buildProduct(p)
// //       );
// //     });

// //     const data = Object.values(result).map((cat) => ({
// //       id: cat.id,
// //       name: cat.name,
// //       image: cat.image,
// //       subcategories: Object.values(cat.subcategories).map((sub) => ({
// //         id: sub.id,
// //         name: sub.name,
// //         image: sub.image,
// //         subSubcategories: Object.values(sub.subSubcategories).filter(
// //           (ss) => ss.id !== null
// //         ),
// //       })),
// //     }));

// //     res.json({ success: true, data });

// //   } catch (err) {
// //     console.error("❌ getPrices error:", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };


// // exports.getWebsitePrices = async (req, res) => {
// //   try {
// //     await checkAutoLock();
// //     const { validSubMap, validSubSubMap } = await buildValidMaps();
// //     const prices = await Price.find({ status: "active", category: { $ne: null }, subcategory: { $ne: null } }).populate("category", "name image");
// //     const result = {};

// //     prices.forEach((p) => {
// //       const category    = p.category;
// //       const subcategory = p.subcategory;
// //       if (!category?._id || !subcategory?.id) return;
// //       const catId    = String(category._id);
// //       const subId    = String(subcategory.id);
// //       const subSubId = p.subSubcategory?.id ? String(p.subSubcategory.id) : null;
// //       if (!validSubMap[subId]) return;
// //       if (subSubId && !validSubSubMap[subSubId]) return;
// //       const subSubKey = subSubId || "NO_SUBSUB";

// //       if (!result[catId]) result[catId] = { id: category._id, name: category.name, image: category.image, subcategories: {} };
// //       if (!result[catId].subcategories[subId]) {
// //         result[catId].subcategories[subId] = { id: subcategory.id, name: subcategory.name, image: subcategory.image, subSubcategories: {} };
// //       }
// //       if (!result[catId].subcategories[subId].subSubcategories[subSubKey]) {
// //         result[catId].subcategories[subId].subSubcategories[subSubKey] = {
// //           id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
// //           image: p.subSubcategory?.image || "", products: [],
// //         };
// //       }
// //       result[catId].subcategories[subId].subSubcategories[subSubKey].products.push(buildProduct(p));
// //     });

// //     const data = Object.values(result).map((cat) => ({
// //       id: cat.id, name: cat.name, image: cat.image,
// //       subcategories: Object.values(cat.subcategories).map((sub) => ({
// //         id: sub.id, name: sub.name, image: sub.image,
// //         subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
// //       })),
// //     }));

// //     res.json({ success: true, data });
// //   } catch (err) {
// //     console.error("❌ getWebsitePrices error:", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };


// // exports.createPrice = async (req, res) => {
// //   try {
// //       console.log("📦 CREATE FILES:", req.files);
// //     console.log("📦 CREATE BODY:", req.body);
// //     const primaryImageUrl = await uploadPrimaryImage(req.files) || "";

// //     // Upload gallery images (no existing gallery on create)
// //     // const galleryImageUrls = await uploadGalleryImages(req.files, [], 3);
// // const galleryImageUrls = await uploadGalleryImages(req.files, [], 5);
// //     const base     = Number(req.body.basePrice);
// //     const pl       = Number(req.body.profitLoss || 0);
// //     const hsnCode  = req.body.hsnCode || "";
// //     const hsnEntry = lookupHsn(hsnCode);
// //     const gst      = req.body.gstPercent !== undefined && req.body.gstPercent !== ""
// //       ? Number(req.body.gstPercent)
// //       : (hsnEntry?.gst ?? 0);

// //     let weight = { value: 1, unit: "kg" };
// //     if (req.body.weight) { try { weight = JSON.parse(req.body.weight); } catch {} }
// //     if (weight.unit === "g") weight.unit = "gm";
// //     if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) weight.unit = "kg";

// //     const subcategory    = parseSub(req.body.subcategory);
// //     const subSubcategory = parseSubSub(req.body.subSubcategory);
// //     const sale           = calcSalePrice(base, pl, gst);

// //     const created = await Price.create({
// //       name:           req.body.name,
// //       brand:          req.body.brand       || "",
// //       category:       req.body.category,
// //       subcategory,
// //       subSubcategory,
// //       weight,
// //       basePrice:      base,
// //       profitLoss:     pl,
// //       salePrice:      sale,
// //       gstPercent:     gst,
// //       hsnCode,
// //       taxType:        req.body.taxType     || "cgst_sgst",
// //       lockedPrice:    0,
// //       yesterdayLock:  0,
// //       brokerDisplay:  sale,
// //       lastLockDate:   "",
// //       description:    req.body.description || "",
// //       status:         req.body.status      || "inactive",
// //       image:          primaryImageUrl,          // primary image
// //       galleryImages:  galleryImageUrls,          // gallery (up to 3)
// //     });

// //     res.json({ success: true, data: created });
// //   } catch (err) {
// //     console.error("❌ CREATE ERROR:", err.message);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };


// // exports.updatePrice = async (req, res) => {
// //   try {
// //     console.log("📦 UPDATE FILES:", req.files);
// //     console.log("📦 UPDATE BODY:", req.body);
// //     const item = await Price.findById(req.params.id);
// //     if (!item) return res.status(404).json({ success: false, message: "Product not found" });

// //     /* ── Primary Image ── */
// //     const hasPrimaryFile = req.files?.primaryImage?.length > 0;
// //     const keepPrimary    = req.body.keepPrimaryImage !== "false"; // default: keep

// //     if (hasPrimaryFile) {
// //       // New primary image uploaded → replace
// //       item.image = await uploadPrimaryImage(req.files);
// //     } else if (!keepPrimary) {
// //       // Explicitly removed
// //       item.image = "";
// //     }
// //     // else: no change to primary image

// //     /* ── Gallery Images ── */
// //     // Parse which existing gallery images to keep
// //     let existingGallery = [];
// //     if (req.body.existingGallery) {
// //       try { existingGallery = JSON.parse(req.body.existingGallery); } catch {}
// //     }
// //     // Merge existing kept URLs + newly uploaded files
// //     item.galleryImages = await uploadGalleryImages(req.files, existingGallery, 5);

// //     /* ── Other Fields ── */
// //     if (req.body.category)              item.category    = req.body.category;
// //     if (req.body.name)                  item.name        = req.body.name;
// //     if (req.body.description)           item.description = req.body.description;
// //     if (req.body.status)                item.status      = req.body.status;
// //     if (req.body.brand !== undefined)   item.brand       = req.body.brand;

// //     if (req.body.subcategory !== undefined)    item.subcategory    = parseSub(req.body.subcategory);
// //     if (req.body.subSubcategory !== undefined) item.subSubcategory = parseSubSub(req.body.subSubcategory);

// //     if (req.body.weight) {
// //       try {
// //         item.weight = typeof req.body.weight === "string" ? JSON.parse(req.body.weight) : req.body.weight;
// //       } catch {}
// //     }

// //     if (req.body.basePrice  !== undefined) item.basePrice  = Number(req.body.basePrice);
// //     if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

// //     if (req.body.hsnCode !== undefined) {
// //       item.hsnCode = req.body.hsnCode;
// //       if (req.body.gstPercent === undefined || req.body.gstPercent === "") {
// //         const hsnEntry = lookupHsn(req.body.hsnCode);
// //         if (hsnEntry) item.gstPercent = hsnEntry.gst;
// //       }
// //     }

// //     const gst = req.body.gstPercent !== undefined && req.body.gstPercent !== ""
// //       ? Number(req.body.gstPercent) : Number(item.gstPercent || 0);

// //     item.gstPercent    = gst;
// //     item.taxType       = req.body.taxType || item.taxType || "cgst_sgst";
// //     item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), gst);
// //     item.brokerDisplay = item.salePrice - item.lockedPrice;

// //     await item.save();
// //     res.json({ success: true, data: buildProduct(item) });
// //   } catch (err) {
// //     console.error("❌ Update error:", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ══════════════════════════════════════════════════════════════
// //    COPY PRODUCT
// // ══════════════════════════════════════════════════════════════ */
// // exports.copyPrice = async (req, res) => {
// //   try {
// //     const item = await Price.findById(req.params.id);
// //     if (!item) return res.status(404).json({ success: false, message: "Product not found" });

// //     const newItem = await Price.create({
// //       name:           item.name,
// //       brand:          item.brand          || "",
// //       category:       item.category,
// //       subcategory:    item.subcategory,
// //       subSubcategory: item.subSubcategory || null,
// //       weight:         item.weight,
// //       basePrice:      item.basePrice,
// //       profitLoss:     item.profitLoss,
// //       salePrice:      item.salePrice,
// //       gstPercent:     item.gstPercent     || 0,
// //       hsnCode:        item.hsnCode        || "",
// //       taxType:        item.taxType        || "cgst_sgst",
// //       lockedPrice:    0, yesterdayLock: 0, brokerDisplay: 0, lastLockDate: "",
// //       description:    item.description,
// //       status:         item.status,
// //       image:          item.image          || "",     // copy primary
// //       galleryImages:  item.galleryImages  || [],     // copy gallery
// //     });

// //     res.json({ success: true, data: newItem });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ══════════════════════════════════════════════════════════════
// //    REMAINING CONTROLLERS (unchanged logic, updated image refs)
// // ══════════════════════════════════════════════════════════════ */
// // exports.updateDiff = async (req, res) => {
// //   try {
// //     const item = await Price.findById(req.params.id);
// //     if (!item) return res.status(404).json({ success: false });
// //     const diff      = Number(req.body.diff);
// //     item.profitLoss = diff;
// //     item.salePrice  = calcSalePrice(Number(item.basePrice), diff, Number(item.gstPercent || 0));
// //     item.brokerDisplay = item.salePrice - item.lockedPrice;
// //     await item.save();
// //     res.json({ success: true, data: item });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.updateStatus = async (req, res) => {
// //   try {
// //     const updated = await Price.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
// //     res.json({ success: true, data: updated });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.deletePrice = async (req, res) => {
// //   try {
// //     await Price.findByIdAndDelete(req.params.id);
// //     res.json({ success: true });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.deleteSelected = async (req, res) => {
// //   try {
// //     await Price.deleteMany({ _id: { $in: req.body.ids } });
// //     res.json({ success: true });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.bulkUpdatePrices = async (req, res) => {
// //   try {
// //     const updated = [];
// //     for (const p of req.body.products) {
// //       const item = await Price.findById(p.id);
// //       if (!item) continue;
// //       if (p.basePrice  !== undefined) item.basePrice  = Number(p.basePrice);
// //       if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);
// //       if (p.gstPercent !== undefined) item.gstPercent = Number(p.gstPercent);
// //       if (p.hsnCode    !== undefined) item.hsnCode    = p.hsnCode;
// //       if (p.taxType    !== undefined) item.taxType    = p.taxType;
// //       if (p.brand      !== undefined) item.brand      = p.brand;
// //       if (p.status)                   item.status     = p.status;
// //       item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), Number(item.gstPercent || 0));
// //       item.brokerDisplay = item.salePrice - item.lockedPrice;
// //       await item.save();
// //       updated.push(item);
// //     }
// //     res.json({ success: true, updated });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.importPrices = async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ success: false, message: "CSV file required" });
// //     const rows = [];
// //     csv.parseString(req.file.buffer.toString("utf-8"), { headers: true })
// //       .on("data", (row) => rows.push(row))
// //       .on("end", async () => {
// //         let successCount = 0;
// //         for (const r of rows) {
// //           try {
// //             const base = Number(r.basePrice || 0), pl = Number(r.profitLoss || 0);
// //             const hsnCode = r.hsnCode || "", hsnEntry = lookupHsn(hsnCode);
// //             const gst = r.gstPercent ? Number(r.gstPercent) : (hsnEntry?.gst ?? 0);
// //             let weight = { value: 1, unit: "kg" };
// //             if (r.weight) { try { weight = JSON.parse(r.weight); } catch {} }
// //             if (weight.unit === "g") weight.unit = "gm";
// //             let categoryId = null;
// //             if (r.category) {
// //               const cat = await Category.findOne({ name: r.category.trim() });
// //               if (!cat) continue;
// //               categoryId = cat._id;
// //             }
// //             let subcategory = null, subSubcategory = null;
// //             if (r.subcategory && r.category) {
// //               const cat = await Category.findOne({ name: r.category.trim() });
// //               if (cat) {
// //                 const sub = cat.subcategories?.find((s) => s.name.toLowerCase() === r.subcategory.trim().toLowerCase());
// //                 if (sub) subcategory = { id: sub._id.toString(), name: sub.name, image: sub.image || "" };
// //               }
// //             }
// //             if (r.subSubcategory && subcategory) {
// //               const cat = await Category.findOne({ name: r.category.trim() });
// //               if (cat) {
// //                 const sub = cat.subcategories?.find((s) => s._id.toString() === subcategory.id);
// //                 if (sub) {
// //                   const ss = (sub.subSubcategories || []).find((x) => x.name.toLowerCase() === r.subSubcategory.trim().toLowerCase());
// //                   if (ss) subSubcategory = { id: ss._id.toString(), name: ss.name, image: ss.image || "" };
// //                 }
// //               }
// //             }
// //             const imageUrl = r.image && r.image.startsWith("http") ? r.image.trim() : "";
// //             const sale = calcSalePrice(base, pl, gst);
// //             await Price.create({
// //               name: r.name, brand: r.brand || "", category: categoryId,
// //               subcategory, subSubcategory, weight,
// //               basePrice: base, profitLoss: pl, salePrice: sale,
// //               gstPercent: gst, hsnCode, taxType: r.taxType || "cgst_sgst",
// //               lockedPrice: 0, yesterdayLock: 0, brokerDisplay: sale, lastLockDate: "",
// //               description: r.description || "", status: r.status || "inactive",
// //               image: imageUrl, galleryImages: [],
// //             });
// //             successCount++;
// //           } catch (e) { console.log("❌ Row skipped:", r.name, e.message); }
// //         }
// //         res.json({ success: true, imported: successCount });
// //       });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.exportPrices = async (req, res) => {
// //   try {
// //     const data = await Price.find().populate("category", "name");
// //     res.setHeader("Content-Disposition", "attachment; filename=prices.csv");
// //     res.setHeader("Content-Type", "text/csv");
// //     const csvStream = csv.format({ headers: true });
// //     csvStream.pipe(res);
// //     data.forEach((p) => {
// //       const hsnInfo = lookupHsn(p.hsnCode);
// //       csvStream.write({
// //         id: p._id, name: p.name, brand: p.brand || "",
// //         category: p.category?.name || "", subcategory: p.subcategory?.name || "",
// //         subSubcategory: p.subSubcategory?.name || "",
// //         image: p.image || "",
// //         galleryImages: (p.galleryImages || []).join("|"),
// //         weight: JSON.stringify(p.weight),
// //         basePrice: p.basePrice, profitLoss: p.profitLoss,
// //         gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
// //         hsnDescription: hsnInfo?.description || "", taxType: p.taxType || "cgst_sgst",
// //         salePrice: p.salePrice, lockedPrice: p.lockedPrice,
// //         yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
// //       });
// //     });
// //     csvStream.end();
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.exportSelected = async (req, res) => {
// //   try {
// //     const ids = req.body.ids || [];
// //     const data = await Price.find({ _id: { $in: ids } }).populate("category", "name");
// //     res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
// //     res.setHeader("Content-Type", "text/csv");
// //     const csvStream = csv.format({ headers: true });
// //     csvStream.pipe(res);
// //     data.forEach((p) => {
// //       const hsnInfo = lookupHsn(p.hsnCode);
// //       csvStream.write({
// //         id: p._id, name: p.name, brand: p.brand || "",
// //         category: p.category?.name || "", subcategory: p.subcategory?.name || "",
// //         subSubcategory: p.subSubcategory?.name || "",
// //         image: p.image || "",
// //         galleryImages: (p.galleryImages || []).join("|"),
// //         weight: JSON.stringify(p.weight),
// //         basePrice: p.basePrice, profitLoss: p.profitLoss,
// //         gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
// //         hsnDescription: hsnInfo?.description || "", taxType: p.taxType || "cgst_sgst",
// //         salePrice: p.salePrice, lockedPrice: p.lockedPrice,
// //         yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
// //       });
// //     });
// //     csvStream.end();
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.setGST = async (req, res) => {
// //   try {
// //     const { productId, gstPercent, hsnCode, taxType } = req.body;
// //     const price = await Price.findById(productId);
// //     if (!price) return res.status(404).json({ success: false });
// //     price.gstPercent = Number(gstPercent);
// //     price.hsnCode    = hsnCode;
// //     price.taxType    = taxType;
// //     await price.save();
// //     res.json({ success: true, data: price });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.getGSTList = async (req, res) => {
// //   try {
// //     const data = await Price.find().select("name gstPercent hsnCode taxType");
// //     res.json(data);
// //   } catch (err) { res.status(500).json({ message: err.message }); }
// // };

// // exports.addDiscount = async (req, res) => {
// //   try {
// //     const { product, minQty, maxQty, discountPercent } = req.body;
// //     const price = await Price.findById(product);
// //     if (!price) return res.status(404).json({ success: false });
// //     price.discounts.push({ minQty: Number(minQty), maxQty: Number(maxQty), discountPercent: Number(discountPercent) });
// //     await price.save();
// //     res.json({ success: true, data: price });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// // exports.getDiscountList = async (req, res) => {
// //   try {
// //     const prices = await Price.find().select("name discounts");
// //     const list = [];
// //     prices.forEach((p) =>
// //       p.discounts.forEach((d) =>
// //         list.push({ _id: d._id, product: { name: p.name }, minQty: d.minQty, maxQty: d.maxQty, discountPercent: d.discountPercent })
// //       )
// //     );
// //     res.json(list);
// //   } catch (err) { res.status(500).json({ message: err.message }); }
// // };


// const Price      = require("../models/priceModel");
// const cloudinary = require("../utils/cloudinary");
// const Category   = require("../models/categoryModel");
// const csv        = require("fast-csv");
// const CustomHsn = require("../models/Customhsnmodel");
// const HSN_CODES = [
//   { code: "0401", description: "Milk & Cream (not concentrated, no added sugar)", gst: 0,  category: "Dairy & Eggs" },
//   { code: "0402", description: "Milk & Cream (concentrated or with added sugar)",  gst: 5,  category: "Dairy & Eggs" },
//   { code: "0403", description: "Buttermilk, Curd, Yoghurt, Kefir",                gst: 5,  category: "Dairy & Eggs" },
//   { code: "0404", description: "Whey & Products of Natural Milk Constituents",     gst: 5,  category: "Dairy & Eggs" },
//   { code: "0405", description: "Butter & Other Fats / Oils Derived from Milk",    gst: 12, category: "Dairy & Eggs" },
//   { code: "0406", description: "Cheese & Curd",                                   gst: 12, category: "Dairy & Eggs" },
//   { code: "0407", description: "Birds' Eggs in Shell — Fresh or Preserved",       gst: 0,  category: "Dairy & Eggs" },
//   { code: "0408", description: "Birds' Eggs (not in shell) & Egg Yolks",          gst: 5,  category: "Dairy & Eggs" },
//   { code: "0201", description: "Meat of Bovine Animals (fresh or chilled)",       gst: 0,  category: "Meat & Poultry" },
//   { code: "0202", description: "Meat of Bovine Animals (frozen)",                 gst: 0,  category: "Meat & Poultry" },
//   { code: "0207", description: "Meat & Edible Offal of Poultry",                  gst: 0,  category: "Meat & Poultry" },
//   { code: "0210", description: "Meat & Offal (salted, dried or smoked)",          gst: 12, category: "Meat & Poultry" },
//   { code: "0302", description: "Fish — Fresh or Chilled (excluding fillets)",     gst: 0,  category: "Fish & Seafood" },
//   { code: "0303", description: "Fish (frozen, excluding fillets)",                 gst: 0,  category: "Fish & Seafood" },
//   { code: "0304", description: "Fish Fillets & Other Fish Meat",                  gst: 5,  category: "Fish & Seafood" },
//   { code: "0306", description: "Crustaceans — Prawns, Shrimps, Crabs, Lobsters", gst: 5,  category: "Fish & Seafood" },
//   { code: "0701", description: "Potatoes (fresh or chilled)",                     gst: 0,  category: "Vegetables" },
//   { code: "0702", description: "Tomatoes (fresh or chilled)",                     gst: 0,  category: "Vegetables" },
//   { code: "0703", description: "Onions, Shallots, Garlic, Leeks",                 gst: 0,  category: "Vegetables" },
//   { code: "0709", description: "Other Vegetables (fresh or chilled)",             gst: 0,  category: "Vegetables" },
//   { code: "0710", description: "Vegetables — Frozen",                             gst: 5,  category: "Vegetables" },
//   { code: "0801", description: "Coconuts, Brazil Nuts, Cashew Nuts",              gst: 0,  category: "Fruits & Nuts" },
//   { code: "0802", description: "Almonds, Walnuts, Hazelnuts, Pistachios",         gst: 5,  category: "Fruits & Nuts" },
//   { code: "0803", description: "Bananas (fresh or dried)",                        gst: 0,  category: "Fruits & Nuts" },
//   { code: "0804", description: "Dates, Figs, Pineapples, Avocados, Mangoes",      gst: 0,  category: "Fruits & Nuts" },
//   { code: "0805", description: "Citrus Fruits — Oranges, Lemons, Limes",         gst: 0,  category: "Fruits & Nuts" },
//   { code: "1001", description: "Wheat & Meslin",                                  gst: 0,  category: "Cereals & Grains" },
//   { code: "1006", description: "Rice",                                             gst: 0,  category: "Cereals & Grains" },
//   { code: "1101", description: "Wheat or Meslin Flour (Maida, Atta)",             gst: 0,  category: "Flour & Milling" },
//   { code: "0713", description: "Dried Leguminous Vegetables — Dal, Lentils, Peas",gst: 0,  category: "Pulses & Legumes" },
//   { code: "1507", description: "Soya-bean Oil & Its Fractions",                   gst: 5,  category: "Oils & Fats" },
//   { code: "1511", description: "Palm Oil & Its Fractions",                         gst: 5,  category: "Oils & Fats" },
//   { code: "1512", description: "Sunflower-seed, Safflower or Cotton-seed Oil",    gst: 5,  category: "Oils & Fats" },
//   { code: "1514", description: "Rapeseed, Mustard & Canola Oil",                  gst: 5,  category: "Oils & Fats" },
//   { code: "1701", description: "Cane or Beet Sugar & Chemically Pure Sucrose",    gst: 5,  category: "Sugar & Sweeteners" },
//   { code: "1704", description: "Sugar Confectionery (no cocoa) — Candies, Toffee",gst: 18, category: "Sugar & Sweeteners" },
//   { code: "0901", description: "Coffee (roasted or instant) & Coffee Husks",      gst: 5,  category: "Beverages" },
//   { code: "0902", description: "Tea (green or black, whether flavoured)",          gst: 5,  category: "Beverages" },
//   { code: "2201", description: "Natural Mineral Water & Aerated Water",            gst: 0,  category: "Beverages" },
//   { code: "2202", description: "Waters with Sugar / Flavour & Non-Alcoholic Drinks",gst: 12, category: "Beverages" },
//   { code: "1806", description: "Chocolate & Cocoa-based Food Products",            gst: 18, category: "Beverages" },
//   { code: "0904", description: "Pepper, Dried Chilli & Capsicum",                 gst: 0,  category: "Spices & Condiments" },
//   { code: "0910", description: "Ginger, Saffron, Turmeric, Thyme, Curry Powder", gst: 0,  category: "Spices & Condiments" },
//   { code: "2103", description: "Sauces, Mixed Condiments & Seasonings, Mustard",  gst: 12, category: "Spices & Condiments" },
//   { code: "1902", description: "Pasta, Noodles, Couscous — Uncooked",             gst: 12, category: "Processed Foods" },
//   { code: "1905", description: "Bread, Pastry, Cakes, Biscuits & Bakery Products",gst: 0,  category: "Processed Foods" },
//   { code: "2007", description: "Jams, Jellies, Marmalades & Fruit Purées",        gst: 12, category: "Processed Foods" },
//   { code: "2009", description: "Fruit Juices & Vegetable Juices",                 gst: 12, category: "Processed Foods" },
//   { code: "3304", description: "Beauty / Makeup Preparations & Skin-care Creams", gst: 28, category: "Personal Care" },
//   { code: "3305", description: "Shampoos, Hair Lacquers, Hair Creams & Oils",     gst: 18, category: "Personal Care" },
//   { code: "3306", description: "Toothpaste, Dental Floss, Mouthwash",             gst: 18, category: "Personal Care" },
//   { code: "3401", description: "Soap & Organic Surface-active Products (bars)",   gst: 18, category: "Personal Care" },
//   { code: "3402", description: "Washing Powders, Detergents & Cleaning Liquids",  gst: 18, category: "Cleaning" },
//   { code: "8517", description: "Telephones, Smartphones & Communication Equipment",gst: 12, category: "Electronics" },
//   { code: "8528", description: "Monitors, TVs, Video Projectors & Receivers",     gst: 28, category: "Electronics" },
//   { code: "4820", description: "Registers, Notebooks, Diaries, Binders, Folders", gst: 12, category: "Stationery" },
//   { code: "4901", description: "Printed Books, Brochures & Similar Printed Matter",gst: 0,  category: "Stationery" },
// ];

// function lookupHsn(code) {
//   return HSN_CODES.find((h) => h.code === (code || "").trim()) || null;
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
//   const hsnInfo = lookupHsn(p.hsnCode);
//   return {
//     _id:            p._id,
//     name:           p.name,
//     brand:          p.brand          || "",
//     weight:         p.weight         || { value: 1, unit: "kg" },
//     basePrice:      p.basePrice,
//     profitLoss:     p.profitLoss,
//     gstPercent:     p.gstPercent     || 0,
//     hsnCode:        p.hsnCode        || "",
//     hsnDescription: hsnInfo?.description || "",
//     hsnCategory:    hsnInfo?.category    || "",
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
//    HSN ROUTES
// ══════════════════════════════════════════════════════════════ */
// // exports.getHsnCodes = async (req, res) => {
// //   try {
// //     const { search, category } = req.query;
// //     let results = HSN_CODES;
// //     if (category) results = results.filter((h) => h.category.toLowerCase() === category.toLowerCase());
// //     if (search) {
// //       const q = search.toLowerCase();
// //       results = results.filter(
// //         (h) => h.code.includes(q) || h.description.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)
// //       );
// //     }
// //     const grouped = results.reduce((acc, hsn) => {
// //       if (!acc[hsn.category]) acc[hsn.category] = [];
// //       acc[hsn.category].push(hsn);
// //       return acc;
// //     }, {});
// //     res.json({ success: true, total: results.length, data: results, grouped, categories: [...new Set(HSN_CODES.map((h) => h.category))] });
// //   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// // };

// exports.getHsnCodes = async (req, res) => {
//   try {
//     const { search, category } = req.query;

//     // 🔥 custom HSN DB se lao
//     const customHsns = await CustomHsn.find();

//     // 🔥 merge static + custom
//     let results = [
//       ...HSN_CODES,
//       ...customHsns.map(h => ({
//         code: h.code,
//         description: h.description,
//         gst: h.gst,
//         category: h.category,
//         isCustom: true
//       }))
//     ];

//     // 🔍 filter by category
//     if (category) {
//       results = results.filter(
//         (h) => h.category.toLowerCase() === category.toLowerCase()
//       );
//     }

//     // 🔍 search filter
//     if (search) {
//       const q = search.toLowerCase();
//       results = results.filter(
//         (h) =>
//           h.code.includes(q) ||
//           h.description.toLowerCase().includes(q) ||
//           h.category.toLowerCase().includes(q)
//       );
//     }

//     res.json({
//       success: true,
//       total: results.length,
//       data: results,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.getHsnByCode = async (req, res) => {
//   try {
//     const hsn = lookupHsn(req.params.code);
//     if (!hsn) return res.status(404).json({ success: false, message: `HSN code ${req.params.code} not found` });
//     res.json({ success: true, data: hsn });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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


// // exports.createPrice = async (req, res) => {
// //   try {
// //     console.log("📦 CREATE FILES:", req.files);
// //     console.log("📦 CREATE BODY:", req.body);

// //     // Naya file upload hua? Use karo. Warna existingPrimaryUrl lo (copy case)
// //     const uploadedPrimary = await uploadPrimaryImage(req.files);
// //     const primaryImageUrl = uploadedPrimary || req.body.existingPrimaryUrl || "";

// //     const galleryImageUrls = await uploadGalleryImages(req.files, [], 5);

// //     const base    = Number(req.body.basePrice);
// //     const pl      = Number(req.body.profitLoss || 0);
// //     const hsnCode = req.body.hsnCode || "";
// //     const hsnEntry = lookupHsn(hsnCode);
// //     const gst = req.body.gstPercent !== undefined && req.body.gstPercent !== ""
// //       ? Number(req.body.gstPercent)
// //       : (hsnEntry?.gst ?? 0);

// //     let weight = { value: 1, unit: "kg" };
// //     if (req.body.weight) { try { weight = JSON.parse(req.body.weight); } catch {} }
// //     if (weight.unit === "g") weight.unit = "gm";
// //     if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) weight.unit = "kg";

// //     const subcategory    = parseSub(req.body.subcategory);
// //     const subSubcategory = parseSubSub(req.body.subSubcategory);
// //     const sale           = calcSalePrice(base, pl, gst);

// //     const created = await Price.create({
// //       name:           req.body.name,
// //       brand:          req.body.brand       || "",
// //       category:       req.body.category,
// //       subcategory,
// //       subSubcategory,
// //       weight,
// //       basePrice:      base,
// //       profitLoss:     pl,
// //       salePrice:      sale,
// //       gstPercent:     gst,
// //       hsnCode,
// //       taxType:        req.body.taxType     || "cgst_sgst",
// //       lockedPrice:    0,
// //       yesterdayLock:  0,
// //       brokerDisplay:  sale,
// //       lastLockDate:   "",
// //       description:    req.body.description || "",
// //       status:         req.body.status      || "inactive",
// //       image:          primaryImageUrl,
// //       galleryImages:  galleryImageUrls,
// //     });

// //     res.json({ success: true, data: created });
// //   } catch (err) {
// //     console.error("❌ CREATE ERROR:", err.message);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };
// exports.createPrice = async (req, res) => {
//   try {
//     console.log("📦 CREATE FILES:", req.files);
//     console.log("📦 CREATE BODY:", req.body);

//     // ─────────────────────────────
//     // IMAGE UPLOAD
//     // ─────────────────────────────
//     const uploadedPrimary = await uploadPrimaryImage(req.files);
//     const primaryImageUrl = uploadedPrimary || req.body.existingPrimaryUrl || "";

//     const galleryImageUrls = await uploadGalleryImages(req.files, [], 5);

//     // ─────────────────────────────
//     // BASIC DATA
//     // ─────────────────────────────
//     const base    = Number(req.body.basePrice || 0);
//     const pl      = Number(req.body.profitLoss || 0);
//     const hsnCode = (req.body.hsnCode || "").trim();

//     // ─────────────────────────────
//     // 🔥 HSN LOGIC (STATIC + CUSTOM)
//     // ─────────────────────────────
//     let hsnEntry = lookupHsn(hsnCode);

//     // 👉 agar static me nahi mila → DB me check
//     if (!hsnEntry && hsnCode) {
//       const custom = await CustomHsn.findOne({ code: hsnCode });
//       if (custom) {
//         hsnEntry = {
//           code: custom.code,
//           description: custom.description,
//           gst: custom.gst,
//           category: custom.category,
//         };
//       }
//     }

//     // ─────────────────────────────
//     // GST CALCULATION
//     // ─────────────────────────────
//     const gst =
//       req.body.gstPercent !== undefined && req.body.gstPercent !== ""
//         ? Number(req.body.gstPercent)
//         : (hsnEntry?.gst ?? 0);

//     // ─────────────────────────────
//     // WEIGHT PARSE
//     // ─────────────────────────────
//     let weight = { value: 1, unit: "kg" };

//     if (req.body.weight) {
//       try {
//         weight = JSON.parse(req.body.weight);
//       } catch {}
//     }

//     if (weight.unit === "g") weight.unit = "gm";

//     if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) {
//       weight.unit = "kg";
//     }

//     // ─────────────────────────────
//     // CATEGORY PARSE
//     // ─────────────────────────────
//     const subcategory    = parseSub(req.body.subcategory);
//     const subSubcategory = parseSubSub(req.body.subSubcategory);

//     // ─────────────────────────────
//     // SALE PRICE
//     // ─────────────────────────────
//     const sale = calcSalePrice(base, pl, gst);

//     // ─────────────────────────────
//     // CREATE PRODUCT
//     // ─────────────────────────────
//     const created = await Price.create({
//       name:           req.body.name,
//       brand:          req.body.brand || "",
//       category:       req.body.category,
//       subcategory,
//       subSubcategory,
//       weight,
//       basePrice:      base,
//       profitLoss:     pl,
//       salePrice:      sale,
//       gstPercent:     gst,
//       hsnCode,
//       taxType:        req.body.taxType || "cgst_sgst",
//       lockedPrice:    0,
//       yesterdayLock:  0,
//       brokerDisplay:  sale,
//       lastLockDate:   "",
//       description:    req.body.description || "",
//       status:         req.body.status || "inactive",
//       image:          primaryImageUrl,
//       galleryImages:  galleryImageUrls,
//     });

//     // ─────────────────────────────
//     // RESPONSE
//     // ─────────────────────────────
//     res.json({ success: true, data: created });

//   } catch (err) {
//     console.error("❌ CREATE ERROR:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// // exports.updatePrice = async (req, res) => {
// //   try {
// //     console.log("📦 UPDATE FILES:", req.files);
// //     console.log("📦 UPDATE BODY:", req.body);

// //     const item = await Price.findById(req.params.id);
// //     if (!item) return res.status(404).json({ success: false, message: "Product not found" });

// //     /* ── Primary Image ── */
// //     const hasPrimaryFile = req.files?.primaryImage?.length > 0;
// //     // Default: keepPrimaryImage = true. Sirf "false" string aane par false hoga.
// //     const keepPrimary = req.body.keepPrimaryImage !== "false";

// //     if (hasPrimaryFile) {
// //       // Case 1: Naya file upload hua — Cloudinary pe upload karke replace karo
// //       item.image = await uploadPrimaryImage(req.files);
// //     } else if (!keepPrimary) {
// //       // Case 2: User ne explicitly remove kiya
// //       item.image = "";
// //     }
// //     // Case 3: Koi file nahi, keepPrimary = true → image as-is (koi change nahi)

// //     /* ── Gallery Images ── */
// //     let existingGallery = [];
// //     if (req.body.existingGallery) {
// //       try { existingGallery = JSON.parse(req.body.existingGallery); } catch {}
// //     }
// //     item.galleryImages = await uploadGalleryImages(req.files, existingGallery, 5);

// //     /* ── Core Fields ── */
// //     if (req.body.name      !== undefined) item.name      = req.body.name;
// //     if (req.body.brand     !== undefined) item.brand     = req.body.brand;
// //     if (req.body.category  !== undefined) item.category  = req.body.category;
// //     if (req.body.status    !== undefined) item.status    = req.body.status;
// //     if (req.body.description !== undefined) item.description = req.body.description;

// //     if (req.body.subcategory    !== undefined) item.subcategory    = parseSub(req.body.subcategory);
// //     if (req.body.subSubcategory !== undefined) item.subSubcategory = parseSubSub(req.body.subSubcategory);

// //     if (req.body.weight !== undefined) {
// //       try {
// //         item.weight = typeof req.body.weight === "string"
// //           ? JSON.parse(req.body.weight)
// //           : req.body.weight;
// //       } catch {}
// //     }

// //     if (req.body.basePrice  !== undefined) item.basePrice  = Number(req.body.basePrice);
// //     if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

   
// // const hsnCode = req.body.hsnCode || item.hsnCode || "";

// // item.hsnCode = hsnCode;

// // // GST auto-fill (agar frontend se nahi aaya)
// // if (req.body.gstPercent === undefined || req.body.gstPercent === "") {
// //   const hsnEntry = lookupHsn(hsnCode);
// //   if (hsnEntry) item.gstPercent = hsnEntry.gst;
// // }

// //     const gst = (req.body.gstPercent !== undefined && req.body.gstPercent !== "")
// //       ? Number(req.body.gstPercent)
// //       : Number(item.gstPercent || 0);

// //     item.gstPercent    = gst;
// //     item.taxType       = req.body.taxType || item.taxType || "cgst_sgst";
// //     item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), gst);
// //     item.brokerDisplay = item.salePrice - item.lockedPrice;

// //     await item.save();
// //     res.json({ success: true, data: buildProduct(item) });
// //   } catch (err) {
// //     console.error("❌ Update error:", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };
// exports.updatePrice = async (req, res) => {
//   try {
//     console.log("📦 UPDATE FILES:", req.files);
//     console.log("📦 UPDATE BODY:", req.body);

//     const item = await Price.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     // ─────────────────────────────
//     // PRIMARY IMAGE
//     // ─────────────────────────────
//     const hasPrimaryFile = req.files?.primaryImage?.length > 0;
//     const keepPrimary = req.body.keepPrimaryImage !== "false";

//     if (hasPrimaryFile) {
//       item.image = await uploadPrimaryImage(req.files);
//     } else if (!keepPrimary) {
//       item.image = "";
//     }

//     // ─────────────────────────────
//     // GALLERY IMAGES
//     // ─────────────────────────────
//     let existingGallery = [];
//     if (req.body.existingGallery) {
//       try {
//         existingGallery = JSON.parse(req.body.existingGallery);
//       } catch {}
//     }

//     item.galleryImages = await uploadGalleryImages(req.files, existingGallery, 5);

//     // ─────────────────────────────
//     // BASIC FIELDS
//     // ─────────────────────────────
//     if (req.body.name !== undefined) item.name = req.body.name;
//     if (req.body.brand !== undefined) item.brand = req.body.brand;
//     if (req.body.category !== undefined) item.category = req.body.category;
//     if (req.body.status !== undefined) item.status = req.body.status;
//     if (req.body.description !== undefined) item.description = req.body.description;

//     if (req.body.subcategory !== undefined) {
//       item.subcategory = parseSub(req.body.subcategory);
//     }

//     if (req.body.subSubcategory !== undefined) {
//       item.subSubcategory = parseSubSub(req.body.subSubcategory);
//     }

//     // ─────────────────────────────
//     // WEIGHT
//     // ─────────────────────────────
//     if (req.body.weight !== undefined) {
//       try {
//         item.weight =
//           typeof req.body.weight === "string"
//             ? JSON.parse(req.body.weight)
//             : req.body.weight;
//       } catch {}
//     }

//     // ─────────────────────────────
//     // PRICE
//     // ─────────────────────────────
//     if (req.body.basePrice !== undefined) {
//       item.basePrice = Number(req.body.basePrice);
//     }

//     if (req.body.profitLoss !== undefined) {
//       item.profitLoss = Number(req.body.profitLoss);
//     }

//     // ─────────────────────────────
//     // 🔥 HSN LOGIC (STATIC + CUSTOM)
//     // ─────────────────────────────
//     const hsnCode = (req.body.hsnCode || item.hsnCode || "").trim();
//     item.hsnCode = hsnCode;

//     let hsnEntry = lookupHsn(hsnCode);

//     if (!hsnEntry && hsnCode) {
//       const custom = await CustomHsn.findOne({ code: hsnCode });
//       if (custom) {
//         hsnEntry = {
//           code: custom.code,
//           description: custom.description,
//           gst: custom.gst,
//           category: custom.category,
//         };
//       }
//     }

//     // ─────────────────────────────
//     // GST
//     // ─────────────────────────────
//     let gst;

//     if (req.body.gstPercent !== undefined && req.body.gstPercent !== "") {
//       gst = Number(req.body.gstPercent);
//     } else {
//       gst = hsnEntry?.gst ?? item.gstPercent ?? 0;
//     }

//     item.gstPercent = gst;

//     // ─────────────────────────────
//     // TAX + SALE PRICE
//     // ─────────────────────────────
//     item.taxType = req.body.taxType || item.taxType || "cgst_sgst";

//     item.salePrice = calcSalePrice(
//       Number(item.basePrice),
//       Number(item.profitLoss || 0),
//       gst
//     );

//     item.brokerDisplay = item.salePrice - item.lockedPrice;

//     // ─────────────────────────────
//     // SAVE
//     // ─────────────────────────────
//     await item.save();

//     res.json({
//       success: true,
//       data: buildProduct(item),
//     });

//   } catch (err) {
//     console.error("❌ Update error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
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
//       if (p.hsnCode    !== undefined) item.hsnCode    = p.hsnCode;
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
//             const base = Number(r.basePrice || 0), pl = Number(r.profitLoss || 0);
//             const hsnCode = r.hsnCode || "", hsnEntry = lookupHsn(hsnCode);
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
//       const hsnInfo = lookupHsn(p.hsnCode);
//       csvStream.write({
//         id: p._id, name: p.name, brand: p.brand || "",
//         category: p.category?.name || "", subcategory: p.subcategory?.name || "",
//         subSubcategory: p.subSubcategory?.name || "",
//         image: p.image || "",
//         galleryImages: (p.galleryImages || []).join("|"),
//         weight: JSON.stringify(p.weight),
//         basePrice: p.basePrice, profitLoss: p.profitLoss,
//         gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
//         hsnDescription: hsnInfo?.description || "", taxType: p.taxType || "cgst_sgst",
//         salePrice: p.salePrice, lockedPrice: p.lockedPrice,
//         yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
//       });
//     });
//     csvStream.end();
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// };

// exports.exportSelected = async (req, res) => {
//   try {
//     const ids = req.body.ids || [];
//     const data = await Price.find({ _id: { $in: ids } }).populate("category", "name");
//     res.setHeader("Content-Disposition", "attachment; filename=selected_prices.csv");
//     res.setHeader("Content-Type", "text/csv");
//     const csvStream = csv.format({ headers: true });
//     csvStream.pipe(res);
//     data.forEach((p) => {
//       const hsnInfo = lookupHsn(p.hsnCode);
//       csvStream.write({
//         id: p._id, name: p.name, brand: p.brand || "",
//         category: p.category?.name || "", subcategory: p.subcategory?.name || "",
//         subSubcategory: p.subSubcategory?.name || "",
//         image: p.image || "",
//         galleryImages: (p.galleryImages || []).join("|"),
//         weight: JSON.stringify(p.weight),
//         basePrice: p.basePrice, profitLoss: p.profitLoss,
//         gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
//         hsnDescription: hsnInfo?.description || "", taxType: p.taxType || "cgst_sgst",
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
//     price.hsnCode    = hsnCode;
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
// HSN lookup — only from DB now
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
  const newFiles = files?.galleryImages || [];
  const slotsLeft = Math.max(0, maxTotal - existingGallery.length);
  if (newFiles.length === 0 || slotsLeft === 0) return existingGallery;
  const newUrls = await Promise.all(
    newFiles.slice(0, slotsLeft).map((f) => uploadToCloudinary(f.buffer, "price_images/gallery"))
  );
  return [...existingGallery, ...newUrls].slice(0, maxTotal);
}

// ─────────────────────────────────────────────
// Daily lock helpers
// ─────────────────────────────────────────────
function todayStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

async function runDailyLock() {
  const today = todayStr();
  const items = await Price.find();
  for (const p of items) {
    if (p.lastLockDate === today) continue;
    const created = new Date(p.createdAt);
    const now     = new Date();
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
  } catch { return null; }
}

function parseSubSub(raw) {
  if (!raw || raw === "null" || raw === "") return null;
  try {
    const s = JSON.parse(raw);
    if (!s || !s.id) return null;
    return { id: s.id, name: s.name || "", image: s.image || "" };
  } catch { return null; }
}

function calcSalePrice(base, pl, gst) {
  const withoutGst = base + pl;
  return withoutGst + (withoutGst * gst) / 100;
}

function buildProduct(p) {
  return {
    _id:            p._id,
    name:           p.name,
    brand:          p.brand          || "",
    weight:         p.weight         || { value: 1, unit: "kg" },
    basePrice:      p.basePrice,
    profitLoss:     p.profitLoss,
    gstPercent:     p.gstPercent     || 0,
    hsnCode:        p.hsnCode        || "",
    taxType:        p.taxType        || "cgst_sgst",
    salePrice:      p.salePrice,
    lockedPrice:    p.lockedPrice,
    yesterdayLock:  p.yesterdayLock,
    brokerDisplay:  p.brokerDisplay,
    lastLockDate:   p.lastLockDate,
    description:    p.description,
    image:          p.image          || "",
    galleryImages:  p.galleryImages  || [],
    status:         p.status,
    createdAt:      p.createdAt,
    subSubcategory: p.subSubcategory,
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
   HSN ROUTES — DB only (no static list)
══════════════════════════════════════════════════════════════ */

// GET /api/prices/hsn-codes
// Returns all HSN codes from DB (custom only, no static)
exports.getHsnCodes = async (req, res) => {
  try {
    const { search, category } = req.query;

    let results = await CustomHsn.find().lean();

    // Map to standard shape
    results = results.map((h) => ({
      code:        h.code,
      description: h.description,
      gst:         h.gst,
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

// GET /api/prices/hsn-codes/:code
exports.getHsnByCode = async (req, res) => {
  try {
    const hsn = await lookupHsn(req.params.code);
    if (!hsn) return res.status(404).json({ success: false, message: `HSN code ${req.params.code} not found` });
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
        result[catId] = { id: p.category._id, name: p.category.name, image: p.category.image, subcategories: {} };
      }
      if (!result[catId].subcategories[subKey]) {
        result[catId].subcategories[subKey] = {
          id: p.subcategory?.id || null, name: p.subcategory?.name || "Others",
          image: p.subcategory?.image || "", subSubcategories: {},
        };
      }
      if (!result[catId].subcategories[subKey].subSubcategories[subSubKey]) {
        result[catId].subcategories[subKey].subSubcategories[subSubKey] = {
          id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
          image: p.subSubcategory?.image || "", products: [],
        };
      }
      result[catId].subcategories[subKey].subSubcategories[subSubKey].products.push(buildProduct(p));
    });

    const data = Object.values(result).map((cat) => ({
      id: cat.id, name: cat.name, image: cat.image,
      subcategories: Object.values(cat.subcategories).map((sub) => ({
        id: sub.id, name: sub.name, image: sub.image,
        subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
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
    const prices = await Price.find({ status: "active", category: { $ne: null }, subcategory: { $ne: null } }).populate("category", "name image");
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

      if (!result[catId]) result[catId] = { id: category._id, name: category.name, image: category.image, subcategories: {} };
      if (!result[catId].subcategories[subId]) {
        result[catId].subcategories[subId] = { id: subcategory.id, name: subcategory.name, image: subcategory.image, subSubcategories: {} };
      }
      if (!result[catId].subcategories[subId].subSubcategories[subSubKey]) {
        result[catId].subcategories[subId].subSubcategories[subSubKey] = {
          id: p.subSubcategory?.id || null, name: p.subSubcategory?.name || "General",
          image: p.subSubcategory?.image || "", products: [],
        };
      }
      result[catId].subcategories[subId].subSubcategories[subSubKey].products.push(buildProduct(p));
    });

    const data = Object.values(result).map((cat) => ({
      id: cat.id, name: cat.name, image: cat.image,
      subcategories: Object.values(cat.subcategories).map((sub) => ({
        id: sub.id, name: sub.name, image: sub.image,
        subSubcategories: Object.values(sub.subSubcategories).filter((ss) => ss.id !== null),
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
    console.log("📦 CREATE BODY:", req.body);

    const uploadedPrimary  = await uploadPrimaryImage(req.files);
    const primaryImageUrl  = uploadedPrimary || req.body.existingPrimaryUrl || "";
    const galleryImageUrls = await uploadGalleryImages(req.files, [], 5);

    const base    = Number(req.body.basePrice || 0);
    const pl      = Number(req.body.profitLoss || 0);
    const hsnCode = (req.body.hsnCode || "").trim().toUpperCase();

    // DB lookup
    const hsnEntry = await lookupHsn(hsnCode);

    const gst =
      req.body.gstPercent !== undefined && req.body.gstPercent !== ""
        ? Number(req.body.gstPercent)
        : (hsnEntry?.gst ?? 0);

    let weight = { value: 1, unit: "kg" };
    if (req.body.weight) {
      try { weight = JSON.parse(req.body.weight); } catch {}
    }
    if (weight.unit === "g") weight.unit = "gm";
    if (!["kg", "gm", "ltr", "ml", "pcs"].includes(weight.unit)) weight.unit = "kg";

    const subcategory    = parseSub(req.body.subcategory);
    const subSubcategory = parseSubSub(req.body.subSubcategory);
    const sale           = calcSalePrice(base, pl, gst);

    const created = await Price.create({
      name:           req.body.name,
      brand:          req.body.brand       || "",
      category:       req.body.category,
      subcategory,
      subSubcategory,
      weight,
      basePrice:      base,
      profitLoss:     pl,
      salePrice:      sale,
      gstPercent:     gst,
      hsnCode,
      taxType:        req.body.taxType     || "cgst_sgst",
      lockedPrice:    0,
      yesterdayLock:  0,
      brokerDisplay:  sale,
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
    console.log("📦 UPDATE BODY:", req.body);

    const item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Product not found" });

    // Primary Image
    const hasPrimaryFile = req.files?.primaryImage?.length > 0;
    const keepPrimary    = req.body.keepPrimaryImage !== "false";

    if (hasPrimaryFile) {
      item.image = await uploadPrimaryImage(req.files);
    } else if (!keepPrimary) {
      item.image = "";
    }

    // Gallery
    let existingGallery = [];
    if (req.body.existingGallery) {
      try { existingGallery = JSON.parse(req.body.existingGallery); } catch {}
    }
    item.galleryImages = await uploadGalleryImages(req.files, existingGallery, 5);

    // Basic fields
    if (req.body.name        !== undefined) item.name        = req.body.name;
    if (req.body.brand       !== undefined) item.brand       = req.body.brand;
    if (req.body.category    !== undefined) item.category    = req.body.category;
    if (req.body.status      !== undefined) item.status      = req.body.status;
    if (req.body.description !== undefined) item.description = req.body.description;

    if (req.body.subcategory    !== undefined) item.subcategory    = parseSub(req.body.subcategory);
    if (req.body.subSubcategory !== undefined) item.subSubcategory = parseSubSub(req.body.subSubcategory);

    if (req.body.weight !== undefined) {
      try {
        item.weight = typeof req.body.weight === "string"
          ? JSON.parse(req.body.weight)
          : req.body.weight;
      } catch {}
    }

    if (req.body.basePrice  !== undefined) item.basePrice  = Number(req.body.basePrice);
    if (req.body.profitLoss !== undefined) item.profitLoss = Number(req.body.profitLoss);

    // HSN — DB lookup
    const hsnCode  = (req.body.hsnCode || item.hsnCode || "").trim().toUpperCase();
    item.hsnCode   = hsnCode;
    const hsnEntry = await lookupHsn(hsnCode);

    // GST
    let gst;
    if (req.body.gstPercent !== undefined && req.body.gstPercent !== "") {
      gst = Number(req.body.gstPercent);
    } else {
      gst = hsnEntry?.gst ?? item.gstPercent ?? 0;
    }
    item.gstPercent = gst;

    item.taxType       = req.body.taxType || item.taxType || "cgst_sgst";
    item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), gst);
    item.brokerDisplay = item.salePrice - item.lockedPrice;

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
      name:           item.name + " (Copy)",
      brand:          item.brand          || "",
      category:       item.category,
      subcategory:    item.subcategory,
      subSubcategory: item.subSubcategory || null,
      weight:         item.weight,
      basePrice:      item.basePrice,
      profitLoss:     item.profitLoss,
      salePrice:      item.salePrice,
      gstPercent:     item.gstPercent     || 0,
      hsnCode:        item.hsnCode        || "",
      taxType:        item.taxType        || "cgst_sgst",
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

exports.updateDiff = async (req, res) => {
  try {
    const item = await Price.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false });
    const diff      = Number(req.body.diff);
    item.profitLoss = diff;
    item.salePrice  = calcSalePrice(Number(item.basePrice), diff, Number(item.gstPercent || 0));
    item.brokerDisplay = item.salePrice - item.lockedPrice;
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await Price.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePrice = async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSelected = async (req, res) => {
  try {
    await Price.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.bulkUpdatePrices = async (req, res) => {
  try {
    const updated = [];
    for (const p of req.body.products) {
      const item = await Price.findById(p.id);
      if (!item) continue;
      if (p.basePrice  !== undefined) item.basePrice  = Number(p.basePrice);
      if (p.profitLoss !== undefined) item.profitLoss = Number(p.profitLoss);
      if (p.gstPercent !== undefined) item.gstPercent = Number(p.gstPercent);
      if (p.hsnCode    !== undefined) item.hsnCode    = (p.hsnCode || "").toUpperCase();
      if (p.taxType    !== undefined) item.taxType    = p.taxType;
      if (p.brand      !== undefined) item.brand      = p.brand;
      if (p.status)                   item.status     = p.status;
      item.salePrice     = calcSalePrice(Number(item.basePrice), Number(item.profitLoss || 0), Number(item.gstPercent || 0));
      item.brokerDisplay = item.salePrice - item.lockedPrice;
      await item.save();
      updated.push(item);
    }
    res.json({ success: true, updated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.importPrices = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "CSV file required" });
    const rows = [];
    csv.parseString(req.file.buffer.toString("utf-8"), { headers: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        let successCount = 0;
        for (const r of rows) {
          try {
            const base    = Number(r.basePrice || 0);
            const pl      = Number(r.profitLoss || 0);
            const hsnCode = (r.hsnCode || "").trim().toUpperCase();
            const hsnEntry = await lookupHsn(hsnCode);
            const gst = r.gstPercent ? Number(r.gstPercent) : (hsnEntry?.gst ?? 0);

            let weight = { value: 1, unit: "kg" };
            if (r.weight) { try { weight = JSON.parse(r.weight); } catch {} }
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
                const sub = cat.subcategories?.find((s) => s.name.toLowerCase() === r.subcategory.trim().toLowerCase());
                if (sub) subcategory = { id: sub._id.toString(), name: sub.name, image: sub.image || "" };
              }
            }
            if (r.subSubcategory && subcategory) {
              const cat = await Category.findOne({ name: r.category.trim() });
              if (cat) {
                const sub = cat.subcategories?.find((s) => s._id.toString() === subcategory.id);
                if (sub) {
                  const ss = (sub.subSubcategories || []).find((x) => x.name.toLowerCase() === r.subSubcategory.trim().toLowerCase());
                  if (ss) subSubcategory = { id: ss._id.toString(), name: ss.name, image: ss.image || "" };
                }
              }
            }

            const imageUrl = r.image && r.image.startsWith("http") ? r.image.trim() : "";
            const sale = calcSalePrice(base, pl, gst);

            await Price.create({
              name: r.name, brand: r.brand || "", category: categoryId,
              subcategory, subSubcategory, weight,
              basePrice: base, profitLoss: pl, salePrice: sale,
              gstPercent: gst, hsnCode, taxType: r.taxType || "cgst_sgst",
              lockedPrice: 0, yesterdayLock: 0, brokerDisplay: sale, lastLockDate: "",
              description: r.description || "", status: r.status || "inactive",
              image: imageUrl, galleryImages: [],
            });
            successCount++;
          } catch (e) { console.log("❌ Row skipped:", r.name, e.message); }
        }
        res.json({ success: true, imported: successCount });
      });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
        id: p._id, name: p.name, brand: p.brand || "",
        category: p.category?.name || "", subcategory: p.subcategory?.name || "",
        subSubcategory: p.subSubcategory?.name || "",
        image: p.image || "",
        galleryImages: (p.galleryImages || []).join("|"),
        weight: JSON.stringify(p.weight),
        basePrice: p.basePrice, profitLoss: p.profitLoss,
        gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
        taxType: p.taxType || "cgst_sgst",
        salePrice: p.salePrice, lockedPrice: p.lockedPrice,
        yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
      });
    });
    csvStream.end();
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
        id: p._id, name: p.name, brand: p.brand || "",
        category: p.category?.name || "", subcategory: p.subcategory?.name || "",
        subSubcategory: p.subSubcategory?.name || "",
        image: p.image || "",
        galleryImages: (p.galleryImages || []).join("|"),
        weight: JSON.stringify(p.weight),
        basePrice: p.basePrice, profitLoss: p.profitLoss,
        gstPercent: p.gstPercent || 0, hsnCode: p.hsnCode || "",
        taxType: p.taxType || "cgst_sgst",
        salePrice: p.salePrice, lockedPrice: p.lockedPrice,
        yesterdayLock: p.yesterdayLock, brokerDisplay: p.brokerDisplay, status: p.status,
      });
    });
    csvStream.end();
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.setGST = async (req, res) => {
  try {
    const { productId, gstPercent, hsnCode, taxType } = req.body;
    const price = await Price.findById(productId);
    if (!price) return res.status(404).json({ success: false });
    price.gstPercent = Number(gstPercent);
    price.hsnCode    = (hsnCode || "").toUpperCase();
    price.taxType    = taxType;
    await price.save();
    res.json({ success: true, data: price });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getGSTList = async (req, res) => {
  try {
    const data = await Price.find().select("name gstPercent hsnCode taxType");
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addDiscount = async (req, res) => {
  try {
    const { product, minQty, maxQty, discountPercent } = req.body;
    const price = await Price.findById(product);
    if (!price) return res.status(404).json({ success: false });
    price.discounts.push({ minQty: Number(minQty), maxQty: Number(maxQty), discountPercent: Number(discountPercent) });
    await price.save();
    res.json({ success: true, data: price });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getDiscountList = async (req, res) => {
  try {
    const prices = await Price.find().select("name discounts");
    const list = [];
    prices.forEach((p) =>
      p.discounts.forEach((d) =>
        list.push({ _id: d._id, product: { name: p.name }, minQty: d.minQty, maxQty: d.maxQty, discountPercent: d.discountPercent })
      )
    );
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};