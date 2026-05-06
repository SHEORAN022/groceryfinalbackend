// // const Inventory       = require("../models/Inventory");
// // const Ledger = require("../models/inventoryledger");

// // const toNum = (v, fallback = 0) => {
// //   const n = Number(v);
// //   return isNaN(n) ? fallback : n;
// // };

// // exports.createInventory = async (req, res) => {
// //   try {
// //     const { product, stock, minStock, expiryDate } = req.body;
// //     if (!product) return res.status(400).json({ success: false, message: "Product required" });

// //     const exists = await Inventory.findOne({ product });
// //     if (exists)
// //       return res.status(409).json({ success: false, message: "Product already exists in inventory. Use update instead." });

// //     const stockNum = toNum(stock);
// //     const inv = await Inventory.create({
// //       product,
// //       stock:      stockNum,
// //       minStock:   toNum(minStock),
// //       expiryDate: expiryDate || undefined,
// //     });

// //     if (stockNum > 0) {
// //       await inventoryLedger.create({ product, type: "INWARD", qty: stockNum, note: "Opening stock" });
// //     }

// //     const populated = await Inventory.findById(inv._id).populate("product", "name image");
// //     res.status(201).json({ success: true, data: populated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    READ ALL  —  GET /api/inventory
// //    Query: ?search=&status=OK|LOW|OUT_OF_STOCK
// // ════════════════════════════════════════ */
// // exports.getInventory = async (req, res) => {
// //   try {
// //     const { search, status } = req.query;

// //     let data = await Inventory.find()
// //       .populate("product", "name image")
// //       .sort({ createdAt: -1 });

// //     if (search) {
// //       const q = search.toLowerCase();
// //       data = data.filter(i => i.product?.name?.toLowerCase().includes(q));
// //     }

// //     if (status) {
// //       data = data.filter(i => {
// //         if (status === "OUT_OF_STOCK") return i.stock === 0;
// //         if (status === "LOW")          return i.stock > 0 && i.stock <= i.minStock;
// //         if (status === "OK")           return i.stock > i.minStock;
// //         return true;
// //       });
// //     }

// //     res.json({ success: true, count: data.length, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    READ ONE  —  GET /api/inventory/:id
// // ════════════════════════════════════════ */
// // exports.getInventoryById = async (req, res) => {
// //   try {
// //     const inv = await Inventory.findById(req.params.id).populate("product", "name image");
// //     if (!inv) return res.status(404).json({ success: false, message: "Not found" });
// //     res.json({ success: true, data: inv });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    UPDATE  —  PUT /api/inventory/:id
// //    Body: { stock, minStock, expiryDate }
// //    Auto-creates a ledger entry if stock changes.
// // ════════════════════════════════════════ */
// // exports.updateInventory = async (req, res) => {
// //   try {
// //     const inv = await Inventory.findById(req.params.id);
// //     if (!inv) return res.status(404).json({ success: false, message: "Not found" });

// //     const { stock, minStock, expiryDate } = req.body;
// //     const newStock = stock !== undefined ? toNum(stock) : inv.stock;
// //     const diff     = newStock - inv.stock;

// //     inv.stock      = newStock;
// //     inv.minStock   = minStock   !== undefined ? toNum(minStock) : inv.minStock;
// //     inv.expiryDate = expiryDate !== undefined ? (expiryDate || undefined) : inv.expiryDate;
// //     await inv.save();

// //     if (diff !== 0) {
// //       await inventoryLedger.create({
// //         product: inv.product,
// //         qty:     Math.abs(diff),
// //         type:    diff > 0 ? "INWARD" : "OUTWARD",
// //         note:    "Manual stock adjustment",
// //       });
// //     }

// //     const populated = await Inventory.findById(inv._id).populate("product", "name image");
// //     res.json({ success: true, data: populated });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    DELETE  —  DELETE /api/inventory/:id
// //    Also removes all ledger entries for this product.
// // ════════════════════════════════════════ */
// // exports.deleteInventory = async (req, res) => {
// //   try {
// //     const inv = await Inventory.findById(req.params.id);
// //     if (!inv) return res.status(404).json({ success: false, message: "Not found" });

// //     await inventoryLedger.deleteMany({ product: inv.product });
// //     await inv.deleteOne();

// //     res.json({ success: true, message: "Inventory and ledger entries deleted" });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    BATCH UPSERT  —  POST /api/inventory/batch
// //    Body: { items: [{ product, stock, minStock, expiryDate, note }] }
// // ════════════════════════════════════════ */
// // exports.batchSetInventory = async (req, res) => {
// //   try {
// //     const items = req.body.items;
// //     if (!Array.isArray(items) || items.length === 0)
// //       return res.status(400).json({ success: false, message: "items[] required" });

// //     const results = [];

// //     for (const item of items) {
// //       const { product, stock, minStock, expiryDate, note } = item;
// //       if (!product) continue;

// //       const stockNum = toNum(stock);
// //       let inv = await Inventory.findOne({ product });

// //       if (inv) {
// //         const diff = stockNum - inv.stock;
// //         inv.stock      = stockNum;
// //         inv.minStock   = toNum(minStock, inv.minStock);
// //         inv.expiryDate = expiryDate || inv.expiryDate;
// //         await inv.save();

// //         if (diff !== 0) {
// //           await inventoryLedger.create({
// //             product,
// //             qty:  Math.abs(diff),
// //             type: diff > 0 ? "INWARD" : "OUTWARD",
// //             note: note || "Batch adjustment",
// //           });
// //         }
// //       } else {
// //         inv = await Inventory.create({ product, stock: stockNum, minStock: toNum(minStock), expiryDate });
// //         if (stockNum > 0) {
// //           await inventoryLedger.create({ product, type: "INWARD", qty: stockNum, note: note || "Batch opening stock" });
// //         }
// //       }

// //       results.push(inv);
// //     }

// //     res.json({ success: true, count: results.length, data: results });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    ADD LEDGER ENTRY  —  POST /api/inventory/ledger
// //    Body: { product, type, qty, note }
// // ════════════════════════════════════════ */
// // exports.addLedgerEntry = async (req, res) => {
// //   try {
// //     const { product, type, qty, note } = req.body;
// //     if (!product || !type || !qty)
// //       return res.status(400).json({ success: false, message: "product, type, qty required" });

// //     const qtyNum   = toNum(qty);
// //     const typeUpper = type.toUpperCase();

// //     if (qtyNum <= 0)
// //       return res.status(400).json({ success: false, message: "qty must be > 0" });
// //     if (!["INWARD", "OUTWARD"].includes(typeUpper))
// //       return res.status(400).json({ success: false, message: "type must be INWARD or OUTWARD" });

// //     const inv = await Inventory.findOne({ product });
// //     if (!inv)
// //       return res.status(404).json({ success: false, message: "Product not found in inventory. Pehle add karo." });

// //     if (typeUpper === "OUTWARD" && inv.stock < qtyNum)
// //       return res.status(400).json({ success: false, message: `Insufficient stock. Available: ${inv.stock}` });

// //     inv.stock = inv.stock + (typeUpper === "INWARD" ? qtyNum : -qtyNum);
// //     await inv.save();

// //     const entry     = await inventoryLedger.create({ product, type: typeUpper, qty: qtyNum, note });
// //     const populated = await inventoryLedger.findById(entry._id).populate("product", "name");

// //     res.json({ success: true, data: { entry: populated, updatedStock: inv.stock } });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    GET LEDGER  —  GET /api/inventory/ledger
// //    Query: ?product=&type=INWARD|OUTWARD&limit=200&page=1
// // ════════════════════════════════════════ */
// // exports.getLedger = async (req, res) => {
// //   try {
// //     const filter = {};
// //     if (req.query.product) filter.product = req.query.product;
// //     if (req.query.type)    filter.type    = req.query.type.toUpperCase();

// //     const limit = Math.min(toNum(req.query.limit, 200), 1000);
// //     const page  = Math.max(toNum(req.query.page,  1),   1);
// //     const skip  = (page - 1) * limit;
// //     const total = await inventoryLedger.countDocuments(filter);

// //     const data = await inventoryLedger.find(filter)
// //       .populate("product", "name")
// //       .sort({ date: -1 })
// //       .skip(skip)
// //       .limit(limit);

// //     res.json({ success: true, total, page, limit, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    DELETE LEDGER ENTRY  —  DELETE /api/inventory/ledger/:id
// //    WARNING: Does NOT reverse stock change. Admin use only.
// // ════════════════════════════════════════ */
// // exports.deleteLedgerEntry = async (req, res) => {
// //   try {
// //     const entry = await inventoryLedger.findByIdAndDelete(req.params.id);
// //     if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });
// //     res.json({ success: true, message: "Ledger entry deleted" });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // /* ════════════════════════════════════════
// //    REPORTS
// // ════════════════════════════════════════ */
// // exports.stockReport = async (req, res) => {
// //   try {
// //     const allInv = await Inventory.find().populate("product", "name image");

// //     const ledgerAgg = await inventoryLedger.aggregate([
// //       { $match: { product: { $in: allInv.map(i => i.product._id) } } },
// //       { $group: { _id: { product: "$product", type: "$type" }, total: { $sum: "$qty" } } },
// //     ]);

// //     const agg = {};
// //     ledgerAgg.forEach(({ _id, total }) => {
// //       const pid = String(_id.product);
// //       if (!agg[pid]) agg[pid] = { INWARD: 0, OUTWARD: 0 };
// //       agg[pid][_id.type] = total;
// //     });

// //     const report = allInv.map(inv => {
// //       const pid = String(inv.product._id);
// //       return {
// //         product:      inv.product,
// //         totalInward:  agg[pid]?.INWARD  || 0,
// //         totalOutward: agg[pid]?.OUTWARD || 0,
// //         currentStock: inv.stock,
// //         minStock:     inv.minStock,
// //         expiryDate:   inv.expiryDate,
// //         status:
// //           inv.stock === 0             ? "OUT_OF_STOCK"
// //           : inv.stock <= inv.minStock ? "LOW"
// //           : "OK",
// //       };
// //     });

// //     report.sort((a, b) => {
// //       const ord = { OUT_OF_STOCK: 0, LOW: 1, OK: 2 };
// //       return (ord[a.status] ?? 3) - (ord[b.status] ?? 3);
// //     });

// //     res.json({ success: true, count: report.length, data: report });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // exports.lowStock = async (req, res) => {
// //   try {
// //     const data = await Inventory.find({ $expr: { $lte: ["$stock", "$minStock"] } })
// //       .populate("product", "name image");
// //     res.json({ success: true, count: data.length, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // exports.deadStock = async (req, res) => {
// //   try {
// //     const days  = toNum(req.query.days, 30);
// //     const since = new Date(Date.now() - days * 86400000);
// //     const activeIds = await inventoryLedger.distinct("product", { type: "OUTWARD", date: { $gte: since } });
// //     const data = await Inventory.find({ stock: { $gt: 0 }, product: { $nin: activeIds } })
// //       .populate("product", "name image");
// //     res.json({ success: true, count: data.length, days, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // exports.expiringStock = async (req, res) => {
// //   try {
// //     const days = toNum(req.query.days, 30);
// //     const soon = new Date(Date.now() + days * 86400000);
// //     const data = await Inventory.find({
// //       stock: { $gt: 0 },
// //       expiryDate: { $lte: soon, $gte: new Date() },
// //     }).populate("product", "name image").sort({ expiryDate: 1 });
// //     res.json({ success: true, count: data.length, days, data });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };


// const Inventory = require("../models/Inventory");
// const Ledger    = require("../models/inventoryledger");  // ✅ correct import

// const toNum = (v, fallback = 0) => {
//   const n = Number(v);
//   return isNaN(n) ? fallback : n;
// };

// /* ════════════════════════════════════════
//    CREATE  —  POST /api/inventory
//    Body: { product, stock, minStock, expiryDate }
//    Also creates opening-stock ledger entry if stock > 0.
// ════════════════════════════════════════ */
// exports.createInventory = async (req, res) => {
//   try {
//     const { product, stock, minStock, expiryDate } = req.body;
//     if (!product)
//       return res.status(400).json({ success: false, message: "Product required" });

//     const exists = await Inventory.findOne({ product });
//     if (exists)
//       return res.status(409).json({
//         success: false,
//         message: "Product already exists in inventory. Use update instead.",
//       });

//     const stockNum = toNum(stock);
//     const inv = await Inventory.create({
//       product,
//       stock:      stockNum,
//       minStock:   toNum(minStock),
//       expiryDate: expiryDate || undefined,
//     });

//     if (stockNum > 0) {
//       await Ledger.create({
//         product,
//         type: "INWARD",
//         qty:  stockNum,
//         note: "Opening stock",
//       });
//     }

//     const populated = await Inventory.findById(inv._id).populate("product", "name image");
//     res.status(201).json({ success: true, data: populated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    READ ALL  —  GET /api/inventory
//    Query: ?search=&status=OK|LOW|OUT_OF_STOCK
// ════════════════════════════════════════ */
// exports.getInventory = async (req, res) => {
//   try {
//     const { search, status } = req.query;

//     let data = await Inventory.find()
//       .populate("product", "name image")
//       .sort({ createdAt: -1 });

//     if (search) {
//       const q = search.toLowerCase();
//       data = data.filter(i => i.product?.name?.toLowerCase().includes(q));
//     }

//     if (status) {
//       data = data.filter(i => {
//         if (status === "OUT_OF_STOCK") return i.stock === 0;
//         if (status === "LOW")          return i.stock > 0 && i.stock <= i.minStock;
//         if (status === "OK")           return i.stock > i.minStock;
//         return true;
//       });
//     }

//     res.json({ success: true, count: data.length, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    READ ONE  —  GET /api/inventory/:id
// ════════════════════════════════════════ */
// exports.getInventoryById = async (req, res) => {
//   try {
//     const inv = await Inventory.findById(req.params.id).populate("product", "name image");
//     if (!inv) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, data: inv });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    UPDATE  —  PUT /api/inventory/:id
//    Body: { stock, minStock, expiryDate }
//    Auto-creates a ledger entry if stock changes.
// ════════════════════════════════════════ */
// exports.updateInventory = async (req, res) => {
//   try {
//     const inv = await Inventory.findById(req.params.id);
//     if (!inv) return res.status(404).json({ success: false, message: "Not found" });

//     const { stock, minStock, expiryDate } = req.body;
//     const newStock = stock !== undefined ? toNum(stock) : inv.stock;
//     const diff     = newStock - inv.stock;

//     inv.stock      = newStock;
//     inv.minStock   = minStock    !== undefined ? toNum(minStock) : inv.minStock;
//     inv.expiryDate = expiryDate  !== undefined ? (expiryDate || undefined) : inv.expiryDate;
//     await inv.save();

//     if (diff !== 0) {
//       await Ledger.create({
//         product: inv.product,
//         qty:     Math.abs(diff),
//         type:    diff > 0 ? "INWARD" : "OUTWARD",
//         note:    "Manual stock adjustment",
//       });
//     }

//     const populated = await Inventory.findById(inv._id).populate("product", "name image");
//     res.json({ success: true, data: populated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    DELETE  —  DELETE /api/inventory/:id
//    Also removes all ledger entries for this product.
// ════════════════════════════════════════ */
// exports.deleteInventory = async (req, res) => {
//   try {
//     const inv = await Inventory.findById(req.params.id);
//     if (!inv) return res.status(404).json({ success: false, message: "Not found" });

//     await Ledger.deleteMany({ product: inv.product });
//     await inv.deleteOne();

//     res.json({ success: true, message: "Inventory and ledger entries deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    BATCH UPSERT  —  POST /api/inventory/batch
//    Body: { items: [{ product, stock, minStock, expiryDate, note }] }
//    Inventory add + ledger entry ek saath hoti hai yahan.
// ════════════════════════════════════════ */
// exports.batchSetInventory = async (req, res) => {
//   try {
//     const items = req.body.items;
//     if (!Array.isArray(items) || items.length === 0)
//       return res.status(400).json({ success: false, message: "items[] required" });

//     const results = [];

//     for (const item of items) {
//       const { product, stock, minStock, expiryDate, note } = item;
//       if (!product) continue;

//       const stockNum = toNum(stock);
//       let inv = await Inventory.findOne({ product });

//       if (inv) {
//         // ── existing product: update stock + log diff ──
//         const diff = stockNum - inv.stock;
//         inv.stock      = stockNum;
//         inv.minStock   = toNum(minStock, inv.minStock);
//         inv.expiryDate = expiryDate || inv.expiryDate;
//         await inv.save();

//         if (diff !== 0) {
//           await Ledger.create({
//             product,
//             qty:  Math.abs(diff),
//             type: diff > 0 ? "INWARD" : "OUTWARD",
//             note: note || "Batch adjustment",
//           });
//         }
//       } else {
//         // ── new product: create inventory + opening stock ledger ──
//         inv = await Inventory.create({
//           product,
//           stock:      stockNum,
//           minStock:   toNum(minStock),
//           expiryDate: expiryDate || undefined,
//         });

//         if (stockNum > 0) {
//           await Ledger.create({
//             product,
//             type: "INWARD",
//             qty:  stockNum,
//             note: note || "Batch opening stock",
//           });
//         }
//       }

//       results.push(inv);
//     }

//     res.json({ success: true, count: results.length, data: results });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    ADD LEDGER ENTRY  —  POST /api/inventory/ledger
//    Body: { product, type, qty, note }
// ════════════════════════════════════════ */
// exports.addLedgerEntry = async (req, res) => {
//   try {
//     const { product, type, qty, note } = req.body;
//     if (!product || !type || !qty)
//       return res.status(400).json({ success: false, message: "product, type, qty required" });

//     const qtyNum    = toNum(qty);
//     const typeUpper = type.toUpperCase();

//     if (qtyNum <= 0)
//       return res.status(400).json({ success: false, message: "qty must be > 0" });
//     if (!["INWARD", "OUTWARD"].includes(typeUpper))
//       return res.status(400).json({ success: false, message: "type must be INWARD or OUTWARD" });

//     const inv = await Inventory.findOne({ product });
//     if (!inv)
//       return res.status(404).json({ success: false, message: "Product not found in inventory. Pehle add karo." });

//     if (typeUpper === "OUTWARD" && inv.stock < qtyNum)
//       return res.status(400).json({ success: false, message: `Insufficient stock. Available: ${inv.stock}` });

//     inv.stock = inv.stock + (typeUpper === "INWARD" ? qtyNum : -qtyNum);
//     await inv.save();

//     const entry     = await Ledger.create({ product, type: typeUpper, qty: qtyNum, note });
//     const populated = await Ledger.findById(entry._id).populate("product", "name");

//     res.json({ success: true, data: { entry: populated, updatedStock: inv.stock } });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    GET LEDGER  —  GET /api/inventory/ledger
//    Query: ?product=&type=INWARD|OUTWARD&limit=200&page=1
// ════════════════════════════════════════ */
// exports.getLedger = async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.product) filter.product = req.query.product;
//     if (req.query.type)    filter.type    = req.query.type.toUpperCase();

//     const limit = Math.min(toNum(req.query.limit, 200), 1000);
//     const page  = Math.max(toNum(req.query.page,  1),   1);
//     const skip  = (page - 1) * limit;
//     const total = await Ledger.countDocuments(filter);

//     const data = await Ledger.find(filter)
//       .populate("product", "name")
//       .sort({ date: -1 })
//       .skip(skip)
//       .limit(limit);

//     res.json({ success: true, total, page, limit, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    DELETE LEDGER ENTRY  —  DELETE /api/inventory/ledger/:id
//    WARNING: Does NOT reverse stock change. Admin use only.
// ════════════════════════════════════════ */
// exports.deleteLedgerEntry = async (req, res) => {
//   try {
//     const entry = await Ledger.findByIdAndDelete(req.params.id);
//     if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });
//     res.json({ success: true, message: "Ledger entry deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ════════════════════════════════════════
//    REPORTS
// ════════════════════════════════════════ */
// exports.stockReport = async (req, res) => {
//   try {
//     const allInv = await Inventory.find().populate("product", "name image");

//     const ledgerAgg = await Ledger.aggregate([
//       { $match: { product: { $in: allInv.map(i => i.product._id) } } },
//       { $group: { _id: { product: "$product", type: "$type" }, total: { $sum: "$qty" } } },
//     ]);

//     const agg = {};
//     ledgerAgg.forEach(({ _id, total }) => {
//       const pid = String(_id.product);
//       if (!agg[pid]) agg[pid] = { INWARD: 0, OUTWARD: 0 };
//       agg[pid][_id.type] = total;
//     });

//     const report = allInv.map(inv => {
//       const pid = String(inv.product._id);
//       return {
//         product:      inv.product,
//         totalInward:  agg[pid]?.INWARD  || 0,
//         totalOutward: agg[pid]?.OUTWARD || 0,
//         currentStock: inv.stock,
//         minStock:     inv.minStock,
//         expiryDate:   inv.expiryDate,
//         status:
//           inv.stock === 0             ? "OUT_OF_STOCK"
//           : inv.stock <= inv.minStock ? "LOW"
//           : "OK",
//       };
//     });

//     report.sort((a, b) => {
//       const ord = { OUT_OF_STOCK: 0, LOW: 1, OK: 2 };
//       return (ord[a.status] ?? 3) - (ord[b.status] ?? 3);
//     });

//     res.json({ success: true, count: report.length, data: report });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.lowStock = async (req, res) => {
//   try {
//     const data = await Inventory.find({ $expr: { $lte: ["$stock", "$minStock"] } })
//       .populate("product", "name image");
//     res.json({ success: true, count: data.length, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.deadStock = async (req, res) => {
//   try {
//     const days      = toNum(req.query.days, 30);
//     const since     = new Date(Date.now() - days * 86400000);
//     const activeIds = await Ledger.distinct("product", { type: "OUTWARD", date: { $gte: since } });
//     const data      = await Inventory.find({ stock: { $gt: 0 }, product: { $nin: activeIds } })
//       .populate("product", "name image");
//     res.json({ success: true, count: data.length, days, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.expiringStock = async (req, res) => {
//   try {
//     const days = toNum(req.query.days, 30);
//     const soon = new Date(Date.now() + days * 86400000);
//     const data = await Inventory.find({
//       stock:      { $gt: 0 },
//       expiryDate: { $lte: soon, $gte: new Date() },
//     })
//       .populate("product", "name image")
//       .sort({ expiryDate: 1 });
//     res.json({ success: true, count: data.length, days, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


const Inventory = require("../models/Inventory");
const Ledger    = require("../models/inventoryledger");

const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
};

/* ════════════════════════════════════════
   CREATE  —  POST /api/inventory
   Body: { product, stock, minStock, expiryDate, batches[] }
   batches: [{ batchNo, mfgDate, expiryDate, qty }]
════════════════════════════════════════ */
exports.createInventory = async (req, res) => {
  try {
    const { product, stock, minStock, expiryDate, batches } = req.body;
    if (!product)
      return res.status(400).json({ success: false, message: "Product required" });

    const exists = await Inventory.findOne({ product });
    if (exists)
      return res.status(409).json({
        success:  false,
        message:  "Product already exists in inventory. Use update instead.",
      });

    // ── Batches process karo ──────────────────────────────────────────────────
    let processedBatches = [];
    let stockNum;

    if (Array.isArray(batches) && batches.length > 0) {
      processedBatches = batches
        .filter((b) => b.qty && Number(b.qty) > 0)
        .map((b) => ({
          batchNo:    (b.batchNo || "").trim(),
          mfgDate:    b.mfgDate    || null,
          expiryDate: b.expiryDate || null,
          qty:        toNum(b.qty),
        }));
      // stock = batches ka sum (pre-save hook bhi karta hai, yahan bhi set)
      stockNum = processedBatches.reduce((s, b) => s + b.qty, 0);
    } else {
      // No batches — legacy single stock mode
      stockNum = toNum(stock);
    }

    const inv = await Inventory.create({
      product,
      stock:      stockNum,
      minStock:   toNum(minStock),
      expiryDate: expiryDate || undefined,
      batches:    processedBatches,
    });

    // Ledger entry
    if (stockNum > 0) {
      await Ledger.create({
        product,
        type: "INWARD",
        qty:  stockNum,
        note: "Opening stock",
      });
    }

    const populated = await Inventory.findById(inv._id).populate("product", "name image");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   READ ALL  —  GET /api/inventory
════════════════════════════════════════ */
exports.getInventory = async (req, res) => {
  try {
    const { search, status } = req.query;

    let data = await Inventory.find()
      .populate("product", "name image")
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((i) => i.product?.name?.toLowerCase().includes(q));
    }

    if (status) {
      data = data.filter((i) => {
        if (status === "OUT_OF_STOCK") return i.stock === 0;
        if (status === "LOW")          return i.stock > 0 && i.stock <= i.minStock;
        if (status === "OK")           return i.stock > i.minStock;
        return true;
      });
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   READ ONE  —  GET /api/inventory/:id
════════════════════════════════════════ */
exports.getInventoryById = async (req, res) => {
  try {
    const inv = await Inventory.findById(req.params.id).populate("product", "name image");
    if (!inv) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: inv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   UPDATE  —  PUT /api/inventory/:id
   Body: { stock, minStock, expiryDate, batches[] }
   Agar batches bhejo — batches replace ho jaate hain
   Agar sirf stock bhejo — legacy mode (no batches)
════════════════════════════════════════ */
exports.updateInventory = async (req, res) => {
  try {
    const inv = await Inventory.findById(req.params.id);
    if (!inv) return res.status(404).json({ success: false, message: "Not found" });

    const { stock, minStock, expiryDate, batches } = req.body;
    const oldStock = inv.stock;

    if (Array.isArray(batches) && batches.length > 0) {
      // ── Batch mode: batches replace + stock recalculate ──────────────────
      inv.batches = batches
        .filter((b) => b.qty && Number(b.qty) > 0)
        .map((b) => ({
          batchNo:    (b.batchNo || "").trim(),
          mfgDate:    b.mfgDate    || null,
          expiryDate: b.expiryDate || null,
          qty:        toNum(b.qty),
        }));
      // pre-save hook stock aur expiryDate set kar dega
    } else {
      // ── Legacy mode: direct stock set ────────────────────────────────────
      if (stock !== undefined) inv.stock = toNum(stock);
      if (expiryDate !== undefined) inv.expiryDate = expiryDate || null;
    }

    if (minStock !== undefined) inv.minStock = toNum(minStock);
    await inv.save();

    // Ledger diff entry
    const diff = inv.stock - oldStock;
    if (diff !== 0) {
      await Ledger.create({
        product: inv.product,
        qty:     Math.abs(diff),
        type:    diff > 0 ? "INWARD" : "OUTWARD",
        note:    "Manual stock adjustment",
      });
    }

    const populated = await Inventory.findById(inv._id).populate("product", "name image");
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   DELETE  —  DELETE /api/inventory/:id
════════════════════════════════════════ */
exports.deleteInventory = async (req, res) => {
  try {
    const inv = await Inventory.findById(req.params.id);
    if (!inv) return res.status(404).json({ success: false, message: "Not found" });

    await Ledger.deleteMany({ product: inv.product });
    await inv.deleteOne();

    res.json({ success: true, message: "Inventory and ledger entries deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   BATCH UPSERT  —  POST /api/inventory/batch
   Body: { items: [{ product, stock, minStock, expiryDate, note, batches[] }] }
════════════════════════════════════════ */
exports.batchSetInventory = async (req, res) => {
  try {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: "items[] required" });

    const results = [];

    for (const item of items) {
      const { product, stock, minStock, expiryDate, note, batches } = item;
      if (!product) continue;

      // ── Batch process ──────────────────────────────────────────────────────
      let processedBatches = [];
      let stockNum;

      if (Array.isArray(batches) && batches.length > 0) {
        processedBatches = batches
          .filter((b) => b.qty && Number(b.qty) > 0)
          .map((b) => ({
            batchNo:    (b.batchNo || "").trim(),
            mfgDate:    b.mfgDate    || null,
            expiryDate: b.expiryDate || null,
            qty:        toNum(b.qty),
          }));
        stockNum = processedBatches.reduce((s, b) => s + b.qty, 0);
      } else {
        stockNum = toNum(stock);
      }

      let inv = await Inventory.findOne({ product });

      if (inv) {
        // ── Existing product: update ──────────────────────────────────────
        const oldStock = inv.stock;

        if (processedBatches.length > 0) {
          inv.batches = processedBatches;
        } else {
          inv.stock = stockNum;
          if (expiryDate) inv.expiryDate = expiryDate;
        }

        inv.minStock = toNum(minStock, inv.minStock);
        await inv.save();

        const diff = inv.stock - oldStock;
        if (diff !== 0) {
          await Ledger.create({
            product,
            qty:  Math.abs(diff),
            type: diff > 0 ? "INWARD" : "OUTWARD",
            note: note || "Batch adjustment",
          });
        }
      } else {
        // ── New product: create ───────────────────────────────────────────
        inv = await Inventory.create({
          product,
          stock:      stockNum,
          minStock:   toNum(minStock),
          expiryDate: expiryDate || undefined,
          batches:    processedBatches,
        });

        if (stockNum > 0) {
          await Ledger.create({
            product,
            type: "INWARD",
            qty:  stockNum,
            note: note || "Batch opening stock",
          });
        }
      }

      results.push(inv);
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   ADD LEDGER ENTRY  —  POST /api/inventory/ledger
════════════════════════════════════════ */
exports.addLedgerEntry = async (req, res) => {
  try {
    const { product, type, qty, note } = req.body;
    if (!product || !type || !qty)
      return res.status(400).json({ success: false, message: "product, type, qty required" });

    const qtyNum    = toNum(qty);
    const typeUpper = type.toUpperCase();

    if (qtyNum <= 0)
      return res.status(400).json({ success: false, message: "qty must be > 0" });
    if (!["INWARD", "OUTWARD"].includes(typeUpper))
      return res.status(400).json({ success: false, message: "type must be INWARD or OUTWARD" });

    const inv = await Inventory.findOne({ product });
    if (!inv)
      return res.status(404).json({ success: false, message: "Product not found in inventory" });

    if (typeUpper === "OUTWARD" && inv.stock < qtyNum)
      return res.status(400).json({ success: false, message: `Insufficient stock. Available: ${inv.stock}` });

    inv.stock = inv.stock + (typeUpper === "INWARD" ? qtyNum : -qtyNum);
    await inv.save();

    const entry     = await Ledger.create({ product, type: typeUpper, qty: qtyNum, note });
    const populated = await Ledger.findById(entry._id).populate("product", "name");

    res.json({ success: true, data: { entry: populated, updatedStock: inv.stock } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   GET LEDGER  —  GET /api/inventory/ledger
════════════════════════════════════════ */
exports.getLedger = async (req, res) => {
  try {
    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.type)    filter.type    = req.query.type.toUpperCase();

    const limit = Math.min(toNum(req.query.limit, 200), 1000);
    const page  = Math.max(toNum(req.query.page,  1),   1);
    const skip  = (page - 1) * limit;
    const total = await Ledger.countDocuments(filter);

    const data = await Ledger.find(filter)
      .populate("product", "name")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ success: true, total, page, limit, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   DELETE LEDGER ENTRY
════════════════════════════════════════ */
exports.deleteLedgerEntry = async (req, res) => {
  try {
    const entry = await Ledger.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });
    res.json({ success: true, message: "Ledger entry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ════════════════════════════════════════
   REPORTS
════════════════════════════════════════ */
exports.stockReport = async (req, res) => {
  try {
    const allInv = await Inventory.find().populate("product", "name image");

    const ledgerAgg = await Ledger.aggregate([
      { $match: { product: { $in: allInv.map((i) => i.product._id) } } },
      { $group: { _id: { product: "$product", type: "$type" }, total: { $sum: "$qty" } } },
    ]);

    const agg = {};
    ledgerAgg.forEach(({ _id, total }) => {
      const pid = String(_id.product);
      if (!agg[pid]) agg[pid] = { INWARD: 0, OUTWARD: 0 };
      agg[pid][_id.type] = total;
    });

    const report = allInv.map((inv) => {
      const pid = String(inv.product._id);
      return {
        product:      inv.product,
        totalInward:  agg[pid]?.INWARD  || 0,
        totalOutward: agg[pid]?.OUTWARD || 0,
        currentStock: inv.stock,
        minStock:     inv.minStock,
        expiryDate:   inv.expiryDate,
        batches:      inv.batches || [],
        status:
          inv.stock === 0             ? "OUT_OF_STOCK"
          : inv.stock <= inv.minStock ? "LOW"
          : "OK",
      };
    });

    report.sort((a, b) => {
      const ord = { OUT_OF_STOCK: 0, LOW: 1, OK: 2 };
      return (ord[a.status] ?? 3) - (ord[b.status] ?? 3);
    });

    res.json({ success: true, count: report.length, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.lowStock = async (req, res) => {
  try {
    const data = await Inventory.find({ $expr: { $lte: ["$stock", "$minStock"] } })
      .populate("product", "name image");
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deadStock = async (req, res) => {
  try {
    const days      = toNum(req.query.days, 30);
    const since     = new Date(Date.now() - days * 86400000);
    const activeIds = await Ledger.distinct("product", { type: "OUTWARD", date: { $gte: since } });
    const data      = await Inventory.find({ stock: { $gt: 0 }, product: { $nin: activeIds } })
      .populate("product", "name image");
    res.json({ success: true, count: data.length, days, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.expiringStock = async (req, res) => {
  try {
    const days = toNum(req.query.days, 30);
    const soon = new Date(Date.now() + days * 86400000);
    const data = await Inventory.find({
      stock:      { $gt: 0 },
      expiryDate: { $lte: soon, $gte: new Date() },
    })
      .populate("product", "name image")
      .sort({ expiryDate: 1 });
    res.json({ success: true, count: data.length, days, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};