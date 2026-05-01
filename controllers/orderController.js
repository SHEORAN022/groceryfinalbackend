// // // const Order     = require("../models/Order");
// // // const Price     = require("../models/priceModel");
// // // const User      = require("../models/User");
// // // const Rider     = require("../models/Rider");
// // // const Inventory = require("../models/Inventory");
// // // const Ledger    = require("../models/InventoryLedger");


// // // /* ══ Inventory Helpers ══════════════════════════════════ */

// // // const deductStock = async (items, orderId, note = "Order placed") => {
// // //   for (const item of items) {
// // //     const inv = await Inventory.findOne({ product: item.product });
// // //     if (!inv) continue;
// // //     inv.stock = Math.max(0, inv.stock - item.quantity);
// // //     await inv.save();
// // //     await Ledger.create({
// // //       product: item.product,
// // //       type:    "OUTWARD",
// // //       qty:     item.quantity,
// // //       note:    `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`,
// // //     });
// // //   }
// // // };

// // // const restoreStock = async (items, orderId, note = "Order cancelled") => {
// // //   for (const item of items) {
// // //     const inv = await Inventory.findOne({ product: item.product });
// // //     if (!inv) continue;
// // //     inv.stock = inv.stock + item.quantity;
// // //     await inv.save();
// // //     await Ledger.create({
// // //       product: item.product,
// // //       type:    "INWARD",
// // //       qty:     item.quantity,
// // //       note:    `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`,
// // //     });
// // //   }
// // // };

// // // const resolveItems = async (rawItems) => {
// // //   if (!Array.isArray(rawItems) || rawItems.length === 0)
// // //     throw { status: 400, message: "Items array required aur empty nahi hona chahiye" };

// // //   const resolved = await Promise.all(
// // //     rawItems.map(async (it, idx) => {
// // //       if (!it.productId)
// // //         throw { status: 400, message: `Item ${idx + 1}: productId missing hai` };

// // //       const qty = Number(it.quantity);
// // //       if (!Number.isInteger(qty) || qty < 1)
// // //         throw { status: 400, message: `Item ${idx + 1}: quantity valid nahi hai (min 1)` };

// // //       const product = await Price.findById(it.productId);
// // //       if (!product) throw { status: 404, message: `Product nahi mila: ${it.productId}` };
// // //       if (product.status !== "active")
// // //         throw { status: 400, message: `Product active nahi hai: ${product.name}` };

// // //       return {
// // //         product:   product._id,
// // //         name:      product.name,
// // //         image:     product.image || "",
// // //         unitPrice: product.salePrice,
// // //         quantity:  qty,
// // //         price:     +(product.salePrice * qty).toFixed(2),
// // //       };
// // //     })
// // //   );

// // //   const totalPrice = +resolved.reduce((sum, i) => sum + i.price, 0).toFixed(2);
// // //   return { resolved, totalPrice };
// // // };


// // // /* ══ Order Controllers ══════════════════════════════════ */

// // // exports.createOrder = async (req, res) => {
// // //   try {
// // //     const { items, address } = req.body;
// // //     const user = await User.findById(req.user.id);
// // //     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// // //     const { resolved, totalPrice } = await resolveItems(items);

// // //     const order = await Order.create({
// // //       user:       user._id,
// // //       userName:   user.name || user.email,
// // //       items:      resolved,
// // //       totalPrice,
// // //       address,
// // //       paidAmount:    0,
// // //       paymentStatus: "unpaid",
// // //     });

// // //     await deductStock(resolved, order._id, "Order placed");

// // //     return res.status(201).json({
// // //       success: true,
// // //       message: "Order placed successfully",
// // //       data: {
// // //         orderId:       order._id,
// // //         items:         order.items,
// // //         totalPrice:    order.totalPrice,
// // //         paidAmount:    order.paidAmount,
// // //         pendingAmount: order.pendingAmount,
// // //         paymentStatus: order.paymentStatus,
// // //         status:        order.status,
// // //         createdAt:     order.createdAt,
// // //       },
// // //     });
// // //   } catch (err) {
// // //     if (err.status) return res.status(err.status).json({ success: false, message: err.message });
// // //     console.error("Create Order Error:", err);
// // //     return res.status(500).json({ success: false, message: "Order place karna fail ho gaya" });
// // //   }
// // // };


// // // exports.updateOrderStatus = async (req, res) => {
// // //   try {
// // //     const { status } = req.body;
// // //     const allowed = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
// // //     if (!allowed.includes(status))
// // //       return res.status(400).json({ success: false, message: "Invalid status value" });

// // //     const order = await Order.findById(req.params.id);
// // //     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

// // //     const prevStatus = order.status;

// // //     if (status === "cancelled" && prevStatus !== "cancelled")
// // //       await restoreStock(order.items, order._id, "Order cancelled");

// // //     if (prevStatus === "cancelled" && status !== "cancelled")
// // //       await deductStock(order.items, order._id, "Order re-activated");

// // //     order.status = status;
// // //     await order.save();

// // //     return res.json({ success: true, message: "Status updated", data: order });
// // //   } catch (err) {
// // //     console.error("Update Status Error:", err);
// // //     return res.status(500).json({ success: false, message: "Status update fail ho gaya" });
// // //   }
// // // };


// // // exports.updateOrderItems = async (req, res) => {
// // //   try {
// // //     const order = await Order.findById(req.params.id)
// // //       .populate("user", "name email")
// // //       .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
// // //       .populate("assignedRider", "name phone vehicleType status");

// // //     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

// // //     const oldItems = order.items;
// // //     const { resolved, totalPrice } = await resolveItems(req.body.items);

// // //     if (order.status !== "cancelled") {
// // //       await restoreStock(oldItems, order._id, "Order items updated (restore old)");
// // //       await deductStock(resolved, order._id, "Order items updated (deduct new)");
// // //     }

// // //     order.items      = resolved;
// // //     order.totalPrice = totalPrice;

// // //     // Agar paidAmount naya totalPrice se zyada ho gaya toh cap karo
// // //     if (order.paidAmount > totalPrice) order.paidAmount = totalPrice;

// // //     await order.save();

// // //     const updated = await Order.findById(order._id)
// // //       .populate("user", "name email")
// // //       .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
// // //       .populate("assignedRider", "name phone vehicleType status");

// // //     return res.json({ success: true, message: "Order items updated successfully", data: updated });
// // //   } catch (err) {
// // //     if (err.status) return res.status(err.status).json({ success: false, message: err.message });
// // //     console.error("Update Order Items Error:", err);
// // //     return res.status(500).json({ success: false, message: "Order update fail ho gaya" });
// // //   }
// // // };


// // // /* ══ NEW: Update Payment ════════════════════════════════
// // //    Admin manually enter karta hai kitna payment mila.
// // //    Body: { paidAmount: Number, paymentNote: String (optional) }
// // // ═══════════════════════════════════════════════════════ */
// // // exports.updatePayment = async (req, res) => {
// // //   try {
// // //     const { paidAmount, paymentNote } = req.body;

// // //     // Validation
// // //     if (paidAmount === undefined || paidAmount === null)
// // //       return res.status(400).json({ success: false, message: "paidAmount required hai" });

// // //     const paid = Number(paidAmount);
// // //     if (isNaN(paid) || paid < 0)
// // //       return res.status(400).json({ success: false, message: "paidAmount valid number hona chahiye (min 0)" });

// // //     const order = await Order.findById(req.params.id);
// // //     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

// // //     // paidAmount totalPrice se zyada nahi ho sakta
// // //     order.paidAmount  = Math.min(paid, order.totalPrice);
// // //     if (paymentNote !== undefined) order.paymentNote = paymentNote;

// // //     await order.save(); // pre-save middleware auto-set karega paymentStatus

// // //     return res.json({
// // //       success: true,
// // //       message: "Payment updated successfully",
// // //       data: {
// // //         _id:           order._id,
// // //         totalPrice:    order.totalPrice,
// // //         paidAmount:    order.paidAmount,
// // //         pendingAmount: order.pendingAmount, // virtual
// // //         paymentStatus: order.paymentStatus,
// // //         paymentNote:   order.paymentNote,
// // //       },
// // //     });
// // //   } catch (err) {
// // //     console.error("Update Payment Error:", err);
// // //     return res.status(500).json({ success: false, message: "Payment update fail ho gaya" });
// // //   }
// // // };


// // // exports.getMyOrders = async (req, res) => {
// // //   try {
// // //     const orders = await Order.find({ user: req.user.id })
// // //       .populate("user", "name email")
// // //       .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
// // //       .populate("assignedRider", "name phone vehicleType status")
// // //       .sort({ createdAt: -1 });
// // //     return res.json({ success: true, count: orders.length, data: orders });
// // //   } catch (err) {
// // //     console.error("Get My Orders Error:", err);
// // //     return res.status(500).json({ success: false, message: "Orders fetch karna fail ho gaya" });
// // //   }
// // // };


// // // exports.getAllOrders = async (req, res) => {
// // //   try {
// // //     const orders = await Order.find()
// // //       .populate("user", "name email")
// // //       .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
// // //       .populate("assignedRider", "name phone vehicleType status")
// // //       .sort({ createdAt: -1 });
// // //     return res.json({ success: true, count: orders.length, data: orders });
// // //   } catch (err) {
// // //     console.error("Get All Orders Error:", err);
// // //     return res.status(500).json({ success: false, message: "Orders fetch karna fail ho gaya" });
// // //   }
// // // };


// // // exports.assignRider = async (req, res) => {
// // //   try {
// // //     const { riderId } = req.body;
// // //     if (riderId) {
// // //       const rider = await Rider.findById(riderId);
// // //       if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
// // //     }
// // //     const order = await Order.findByIdAndUpdate(
// // //       req.params.id,
// // //       { assignedRider: riderId || null },
// // //       { new: true }
// // //     ).populate("assignedRider", "name phone vehicleType status");

// // //     if (!order) return res.status(404).json({ success: false, message: "Order not found" });
// // //     return res.json({ success: true, message: riderId ? "Rider assigned" : "Rider unassigned", data: order });
// // //   } catch (err) {
// // //     console.error("Assign Rider Error:", err);
// // //     return res.status(500).json({ success: false, message: "Rider assign fail ho gaya" });
// // //   }
// // // };

// // const Order = require("../models/Order");
// // const Price = require("../models/priceModel");
// // const VendorProduct = require("../models/VendorProduct");
// // const User = require("../models/User");
// // const Rider = require("../models/Rider");
// // const Inventory = require("../models/Inventory");
// // const Ledger = require("../models/InventoryLedger");

// // const deductStock = async (items, orderId, note = "Order placed") => {
// //   for (const item of items) {
// //     const inv = await Inventory.findOne({ product: item.product });
// //     if (!inv) continue;
// //     inv.stock = Math.max(0, inv.stock - item.quantity);
// //     await inv.save();
// //     await Ledger.create({
// //       product: item.product,
// //       type: "OUTWARD",
// //       qty: item.quantity,
// //       note: `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`
// //     });
// //   }
// // };

// // const restoreStock = async (items, orderId, note = "Order cancelled") => {
// //   for (const item of items) {
// //     const inv = await Inventory.findOne({ product: item.product });
// //     if (!inv) continue;
// //     inv.stock = inv.stock + item.quantity;
// //     await inv.save();
// //     await Ledger.create({
// //       product: item.product,
// //       type: "INWARD",
// //       qty: item.quantity,
// //       note: `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`
// //     });
// //   }
// // };

// // const resolveItems = async (rawItems) => {
// //   if (!Array.isArray(rawItems) || rawItems.length === 0)
// //     throw { status: 400, message: "Items array required aur empty nahi hona chahiye" };

// //   const resolved = await Promise.all(
// //     rawItems.map(async (it, idx) => {
// //       if (!it.productId)
// //         throw { status: 400, message: `Item ${idx + 1}: productId missing hai` };

// //       const qty = Number(it.quantity);
// //       if (!Number.isInteger(qty) || qty < 1)
// //         throw { status: 400, message: `Item ${idx + 1}: quantity valid nahi hai (min 1)` };

// //       let product;
// //       let ownerType;
// //       let vendorId = null;
// //       let productModel;

// //       if (it.type === "admin") {
// //         product = await Price.findById(it.productId);
// //         ownerType = "admin";
// //         productModel = "Price";
// //       } else if (it.type === "vendor") {
// //         product = await VendorProduct.findById(it.productId);
// //         ownerType = "vendor";
// //         productModel = "VendorProduct";
// //         vendorId = product?.vendor;
// //       } else {
// //         throw { status: 400, message: `Item ${idx + 1}: type invalid hai` };
// //       }

// //       if (!product)
// //         throw { status: 404, message: `Product nahi mila: ${it.productId}` };

// //       if (product.status !== "active")
// //         throw { status: 400, message: `Product active nahi hai: ${product.name}` };

// //       const unitPrice = product.salePrice || product.price;

// //       return {
// //         product: product._id,
// //         name: product.name,
// //         image: product.image || "",
// //         unitPrice,
// //         quantity: qty,
// //         price: +(unitPrice * qty).toFixed(2),
// //         ownerType,
// //         vendorId,
// //         productModel
// //       };
// //     })
// //   );

// //   const totalPrice = +resolved.reduce((sum, i) => sum + i.price, 0).toFixed(2);
// //   return { resolved, totalPrice };
// // };

// // exports.createOrder = async (req, res) => {
// //   try {
// //     const { items, address } = req.body;
// //     const user = await User.findById(req.user.id);

// //     if (!user)
// //       return res.status(404).json({ success: false, message: "User not found" });

// //     const { resolved, totalPrice } = await resolveItems(items);

// //     const order = await Order.create({
// //       user: user._id,
// //       userName: user.name || user.email,
// //       items: resolved,
// //       totalPrice,
// //       address,
// //       paidAmount: 0,
// //       paymentStatus: "unpaid"
// //     });

// //     await deductStock(resolved, order._id);

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order placed successfully",
// //       data: order
// //     });

// //   } catch (err) {
// //     if (err.status)
// //       return res.status(err.status).json({ success: false, message: err.message });

// //     return res.status(500).json({
// //       success: false,
// //       message: "Order place karna fail ho gaya"
// //     });
// //   }
// // };

// // exports.updateOrderStatus = async (req, res) => {
// //   try {
// //     const { status } = req.body;

// //     const allowed = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
// //     if (!allowed.includes(status))
// //       return res.status(400).json({ success: false, message: "Invalid status value" });

// //     const order = await Order.findById(req.params.id);
// //     if (!order)
// //       return res.status(404).json({ success: false, message: "Order not found" });

// //     const prevStatus = order.status;

// //     if (status === "cancelled" && prevStatus !== "cancelled")
// //       await restoreStock(order.items, order._id);

// //     if (prevStatus === "cancelled" && status !== "cancelled")
// //       await deductStock(order.items, order._id);

// //     order.status = status;
// //     await order.save();

// //     return res.json({ success: true, data: order });

// //   } catch (err) {
// //     return res.status(500).json({ success: false, message: "Status update fail ho gaya" });
// //   }
// // };

// // exports.getMyOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
// //     return res.json({ success: true, data: orders });
// //   } catch {
// //     return res.status(500).json({ success: false, message: "Fetch fail" });
// //   }
// // };

// // exports.getAllOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find().sort({ createdAt: -1 });
// //     return res.json({ success: true, data: orders });
// //   } catch {
// //     return res.status(500).json({ success: false, message: "Fetch fail" });
// //   }
// // };

// // exports.assignRider = async (req, res) => {
// //   try {
// //     const { riderId } = req.body;

// //     if (riderId) {
// //       const rider = await Rider.findById(riderId);
// //       if (!rider)
// //         return res.status(404).json({ success: false, message: "Rider not found" });
// //     }

// //     const order = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       { assignedRider: riderId || null },
// //       { new: true }
// //     );

// //     return res.json({ success: true, data: order });

// //   } catch {
// //     return res.status(500).json({ success: false, message: "Assign fail" });
// //   }
// // };

// // exports.updateOrderItems = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id);

// //     if (!order)
// //       return res.status(404).json({ success: false, message: "Order not found" });

// //     const oldItems = order.items;
// //     const { resolved, totalPrice } = await resolveItems(req.body.items);

// //     if (order.status !== "cancelled") {
// //       await restoreStock(oldItems, order._id);
// //       await deductStock(resolved, order._id);
// //     }

// //     order.items = resolved;
// //     order.totalPrice = totalPrice;

// //     if (order.paidAmount > totalPrice)
// //       order.paidAmount = totalPrice;

// //     await order.save();

// //     return res.json({
// //       success: true,
// //       message: "Order updated",
// //       data: order
// //     });

// //   } catch (err) {
// //     if (err.status)
// //       return res.status(err.status).json({ success: false, message: err.message });

// //     return res.status(500).json({
// //       success: false,
// //       message: "Order update fail"
// //     });
// //   }
// // };

// // exports.updatePayment = async (req, res) => {
// //   try {
// //     const { paidAmount, paymentNote } = req.body;

// //     if (paidAmount === undefined)
// //       return res.status(400).json({ success: false, message: "paidAmount required" });

// //     const order = await Order.findById(req.params.id);

// //     if (!order)
// //       return res.status(404).json({ success: false, message: "Order not found" });

// //     order.paidAmount = Math.min(Number(paidAmount), order.totalPrice);

// //     if (paymentNote !== undefined)
// //       order.paymentNote = paymentNote;

// //     await order.save();

// //     return res.json({
// //       success: true,
// //       data: order
// //     });

// //   } catch {
// //     return res.status(500).json({
// //       success: false,
// //       message: "Payment update fail"
// //     });
// //   }
// // };


// const Order = require("../models/Order");
// const Price = require("../models/priceModel");
// const VendorProduct = require("../models/VendorProduct");
// const User = require("../models/User");
// const Rider = require("../models/Rider");
// const Inventory = require("../models/Inventory");
// const Ledger = require("../models/InventoryLedger");

// const deductStock = async (items, orderId, note = "Order placed") => {
//   for (const item of items) {
//     const inv = await Inventory.findOne({ product: item.product });
//     if (!inv) continue;
//     inv.stock = Math.max(0, inv.stock - item.quantity);
//     await inv.save();
//     await Ledger.create({
//       product: item.product,
//       type: "OUTWARD",
//       qty: item.quantity,
//       note: `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`
//     });
//   }
// };

// const restoreStock = async (items, orderId, note = "Order cancelled") => {
//   for (const item of items) {
//     const inv = await Inventory.findOne({ product: item.product });
//     if (!inv) continue;
//     inv.stock = inv.stock + item.quantity;
//     await inv.save();
//     await Ledger.create({
//       product: item.product,
//       type: "INWARD",
//       qty: item.quantity,
//       note: `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`
//     });
//   }
// };

// const resolveItems = async (rawItems) => {
//   if (!Array.isArray(rawItems) || rawItems.length === 0)
//     throw { status: 400, message: "Items array required aur empty nahi hona chahiye" };

//   const resolved = await Promise.all(
//     rawItems.map(async (it, idx) => {
//       if (!it.productId)
//         throw { status: 400, message: `Item ${idx + 1}: productId missing hai` };

//       const qty = Number(it.quantity);
//       if (!Number.isInteger(qty) || qty < 1)
//         throw { status: 400, message: `Item ${idx + 1}: quantity valid nahi hai (min 1)` };

//       let product;
//       let ownerType;
//       let vendorId = null;
//       let productModel;

//       if (it.type === "admin") {
//         product = await Price.findById(it.productId);
//         ownerType = "admin";
//         productModel = "Price";
//       } else if (it.type === "vendor") {
//         product = await VendorProduct.findById(it.productId);
//         ownerType = "vendor";
//         productModel = "VendorProduct";
//         vendorId = product?.vendor;
//       } else {
//         throw { status: 400, message: `Item ${idx + 1}: type invalid hai (admin ya vendor hona chahiye)` };
//       }

//       if (!product)
//         throw { status: 404, message: `Product nahi mila: ${it.productId}` };

//       if (product.status !== "active")
//         throw { status: 400, message: `Product active nahi hai: ${product.name}` };

//       const unitPrice = product.salePrice || product.price;

//       return {
//         product: product._id,
//         name: product.name,
//         image: product.image || "",
//         unitPrice,
//         quantity: qty,
//         price: +(unitPrice * qty).toFixed(2),
//         ownerType,
//         vendorId,
//         productModel
//       };
//     })
//   );

//   const totalPrice = +resolved.reduce((sum, i) => sum + i.price, 0).toFixed(2);
//   return { resolved, totalPrice };
// };

// // ─── CREATE ORDER ────────────────────────────────────────────────────────────
// exports.createOrder = async (req, res) => {
//   try {
//     const { items, address } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     const { resolved, totalPrice } = await resolveItems(items);

//     const order = await Order.create({
//       user: user._id,
//       userName: user.name || user.email,
//       items: resolved,
//       totalPrice,
//       address,
//       paidAmount: 0,
//       paymentStatus: "unpaid"
//     });

//     await deductStock(resolved, order._id);

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       data: order
//     });

//   } catch (err) {
//     if (err.status)
//       return res.status(err.status).json({ success: false, message: err.message });

//     return res.status(500).json({
//       success: false,
//       message: "Order place karna fail ho gaya"
//     });
//   }
// };

// // ─── UPDATE ORDER STATUS ─────────────────────────────────────────────────────
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const allowed = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
//     if (!allowed.includes(status))
//       return res.status(400).json({ success: false, message: "Invalid status value" });

//     const order = await Order.findById(req.params.id);
//     if (!order)
//       return res.status(404).json({ success: false, message: "Order not found" });

//     const prevStatus = order.status;

//     if (status === "cancelled" && prevStatus !== "cancelled")
//       await restoreStock(order.items, order._id);

//     if (prevStatus === "cancelled" && status !== "cancelled")
//       await deductStock(order.items, order._id);

//     order.status = status;
//     await order.save();

//     return res.json({ success: true, data: order });

//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Status update fail ho gaya" });
//   }
// };

// // ─── GET MY ORDERS ───────────────────────────────────────────────────────────
// exports.getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .populate("assignedRider", "name phone status vehicleType")
//       .populate("items.product");

//     return res.json({ success: true, data: orders });
//   } catch {
//     return res.status(500).json({ success: false, message: "Fetch fail" });
//   }
// };

// // ─── GET ALL ORDERS ──────────────────────────────────────────────────────────
// // FIXED: assignedRider aur items.product populate karo taaki frontend mein
// //        rider ka naam/phone aur product details sahi milein
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .populate("assignedRider", "name phone status vehicleType")   // ← FIXED
//       .populate("items.product");                                    // ← FIXED

//     return res.json({ success: true, data: orders });
//   } catch {
//     return res.status(500).json({ success: false, message: "Fetch fail" });
//   }
// };

// // ─── ASSIGN RIDER ────────────────────────────────────────────────────────────
// exports.assignRider = async (req, res) => {
//   try {
//     const { riderId } = req.body;

//     if (riderId) {
//       const rider = await Rider.findById(riderId);
//       if (!rider)
//         return res.status(404).json({ success: false, message: "Rider not found" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { assignedRider: riderId || null },
//       { new: true }
//     ).populate("assignedRider", "name phone status vehicleType");   // ← populate rider in response

//     return res.json({ success: true, data: order });

//   } catch {
//     return res.status(500).json({ success: false, message: "Assign fail" });
//   }
// };

// // ─── UPDATE ORDER ITEMS ──────────────────────────────────────────────────────
// // FIXED: populate karo taaki updated items ke saath product details milein
// exports.updateOrderItems = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("items.product"); // ← FIXED

//     if (!order)
//       return res.status(404).json({ success: false, message: "Order not found" });

//     const oldItems = order.items;
//     const { resolved, totalPrice } = await resolveItems(req.body.items);

//     if (order.status !== "cancelled") {
//       await restoreStock(oldItems, order._id);
//       await deductStock(resolved, order._id);
//     }

//     order.items = resolved;
//     order.totalPrice = totalPrice;

//     if (order.paidAmount > totalPrice)
//       order.paidAmount = totalPrice;

//     await order.save();

//     // Save ke baad dobara populate karo taaki response mein product details milein
//     const updatedOrder = await Order.findById(order._id)
//       .populate("assignedRider", "name phone status vehicleType")
//       .populate("items.product");

//     return res.json({
//       success: true,
//       message: "Order updated",
//       data: updatedOrder
//     });

//   } catch (err) {
//     if (err.status)
//       return res.status(err.status).json({ success: false, message: err.message });

//     return res.status(500).json({
//       success: false,
//       message: "Order update fail"
//     });
//   }
// };

// // ─── UPDATE PAYMENT ──────────────────────────────────────────────────────────
// exports.updatePayment = async (req, res) => {
//   try {
//     const { paidAmount, paymentNote } = req.body;

//     if (paidAmount === undefined)
//       return res.status(400).json({ success: false, message: "paidAmount required" });

//     const order = await Order.findById(req.params.id);

//     if (!order)
//       return res.status(404).json({ success: false, message: "Order not found" });

//     order.paidAmount = Math.min(Number(paidAmount), order.totalPrice);

//     if (paymentNote !== undefined)
//       order.paymentNote = paymentNote;

//     await order.save();

//     return res.json({
//       success: true,
//       data: order
//     });

//   } catch {
//     return res.status(500).json({
//       success: false,
//       message: "Payment update fail"
//     });
//   }
// };

const Order         = require("../models/Order");
const Price         = require("../models/priceModel");
const VendorProduct = require("../models/vendorProduct");
const User          = require("../models/User");
const Rider         = require("../models/Rider");
const Inventory     = require("../models/Inventory");
const Ledger        = require("../models/inventoryledger");
const Coupon        = require("../models/couponModel");

// ─── STOCK HELPERS ────────────────────────────────────────────────────────────

const deductStock = async (items, orderId, note = "Order placed") => {
  for (const item of items) {
    const inv = await Inventory.findOne({ product: item.product });
    if (!inv) continue;
    inv.stock = Math.max(0, inv.stock - item.quantity);
    await inv.save();
    await Ledger.create({
      product: item.product,
      type:    "OUTWARD",
      qty:     item.quantity,
      note:    `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`,
    });
  }
};

const restoreStock = async (items, orderId, note = "Order cancelled") => {
  for (const item of items) {
    const inv = await Inventory.findOne({ product: item.product });
    if (!inv) continue;
    inv.stock = inv.stock + item.quantity;
    await inv.save();
    await Ledger.create({
      product: item.product,
      type:    "INWARD",
      qty:     item.quantity,
      note:    `${note} — Order #${String(orderId).slice(-6).toUpperCase()}`,
    });
  }
};

// ─── RESOLVE ITEMS ────────────────────────────────────────────────────────────

const resolveItems = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0)
    throw { status: 400, message: "Items array required aur empty nahi hona chahiye" };

  const resolved = await Promise.all(
    rawItems.map(async (it, idx) => {
      if (!it.productId)
        throw { status: 400, message: `Item ${idx + 1}: productId missing hai` };

      const qty = Number(it.quantity);
      if (!Number.isInteger(qty) || qty < 1)
        throw { status: 400, message: `Item ${idx + 1}: quantity valid nahi hai (min 1)` };

      let product, ownerType, vendorId = null, productModel;

      if (it.type === "admin") {
        product      = await Price.findById(it.productId);
        ownerType    = "admin";
        productModel = "Price";
      } else if (it.type === "vendor") {
        product      = await VendorProduct.findById(it.productId);
        ownerType    = "vendor";
        productModel = "VendorProduct";
        vendorId     = product?.vendor || null;
      } else {
        throw { status: 400, message: `Item ${idx + 1}: type invalid hai (admin ya vendor hona chahiye)` };
      }

      if (!product)
        throw { status: 404, message: `Product nahi mila: ${it.productId}` };

      if (product.status !== "active")
        throw { status: 400, message: `Product active nahi hai: ${product.name}` };

      const unitPrice = product.salePrice || product.price;

      return {
        product:      product._id,
        name:         product.name,
        image:        product.image || "",
        unitPrice,
        quantity:     qty,
        price:        +(unitPrice * qty).toFixed(2),
        ownerType,
        vendorId,
        productModel,
        mrp:          product.mrp     || unitPrice,
        hsn:          product.hsn     || "",
        gstRate:      product.gstRate || 0,
        unit:         product.unit    || "pcs",
        packing:      product.weight ? `${product.weight.value}${product.weight.unit}` : "",
      };
    })
  );

  const totalPrice = +resolved.reduce((sum, i) => sum + i.price, 0).toFixed(2);
  return { resolved, totalPrice };
};

// ─── COUPON APPLY HELPER ─────────────────────────────────────────────────────
// Returns { couponCode, couponDiscount, finalPrice }
// Agar coupon nahi diya ya invalid hai => error throw karta hai
// Agar coupon diya hi nahi (couponCode undefined/null) => null return karta hai

const applyCouponIfProvided = async (couponCode, totalPrice) => {
  // Coupon diya hi nahi — skip, normal flow
  if (!couponCode || String(couponCode).trim() === "") return null;

  const code   = String(couponCode).trim().toUpperCase();
  const coupon = await Coupon.findOne({ couponCode: code, status: "active" });

  if (!coupon)
    throw { status: 404, message: `Coupon "${code}" valid nahi hai ya exist nahi karta` };

  if (new Date() > new Date(coupon.expiryDate))
    throw { status: 400, message: `Coupon "${code}" expire ho chuka hai` };

  if (totalPrice < (coupon.minOrderValue || 0))
    throw {
      status:  400,
      message: `Coupon apply karne ke liye minimum order ₹${coupon.minOrderValue} hona chahiye`,
    };

  // Discount calculate karo
  let discount =
    coupon.discountType === "percentage"
      ? (totalPrice * coupon.discountValue) / 100
      : coupon.discountValue;

  // maxDiscount cap (sirf percentage type pe)
  if (coupon.discountType === "percentage" && coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = +discount.toFixed(2);

  const finalPrice = +(totalPrice - discount).toFixed(2);

  return {
    couponCode:     coupon.couponCode,
    couponDiscount: discount,
    finalPrice,
  };
};

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────

exports.createOrder = async (req, res) => {
  try {
    const { items, address, couponCode } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 1. Items resolve karo
    const { resolved, totalPrice } = await resolveItems(items);

    // 2. Coupon apply karo (agar diya ho)
    // couponResult = null  →  no coupon
    // couponResult = { couponCode, couponDiscount, finalPrice }  →  coupon applied
    const couponResult = await applyCouponIfProvided(couponCode, totalPrice);

    // 3. Order create karo
    const orderData = {
      user:     user._id,
      userName: user.name || user.email,
      items:    resolved,

      originalItems:      resolved,
      originalTotalPrice: totalPrice,

      totalPrice,
      address,
      paidAmount:    0,
      paymentStatus: "unpaid",
    };

    // Coupon fields sirf tab add karo jab coupon apply hua ho
    if (couponResult) {
      orderData.couponCode     = couponResult.couponCode;
      orderData.couponDiscount = couponResult.couponDiscount;
      orderData.finalPrice     = couponResult.finalPrice;
    }

    const order = await Order.create(orderData);

    await deductStock(resolved, order._id);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data:    order,
      // Summary frontend ke liye
      summary: {
        totalPrice,
        couponApplied:  !!couponResult,
        couponCode:     couponResult?.couponCode     || null,
        couponDiscount: couponResult?.couponDiscount || 0,
        finalPrice:     couponResult?.finalPrice     ?? totalPrice,
      },
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ success: false, message: err.message });

    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Order place karna fail ho gaya" });
  }
};

// ─── UPDATE ORDER STATUS ──────────────────────────────────────────────────────

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status value" });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    const prevStatus = order.status;

    if (status === "cancelled" && prevStatus !== "cancelled")
      await restoreStock(order.items, order._id);

    if (prevStatus === "cancelled" && status !== "cancelled")
      await deductStock(order.items, order._id);

    order.status = status;
    await order.save();

    const updated = await Order.findById(order._id)
      .populate("user",          "name email")
      .populate("assignedRider", "name phone status vehicleType")
      .populate("items.product");

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ success: false, message: "Status update fail ho gaya" });
  }
};

// ─── GET MY ORDERS ────────────────────────────────────────────────────────────

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("assignedRider", "name phone status vehicleType")
      .populate("items.product");

    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ success: false, message: "Fetch fail" });
  }
};

// ─── GET ALL ORDERS ───────────────────────────────────────────────────────────

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user",          "name email")
      .populate("assignedRider", "name phone status vehicleType")
      .populate("items.product");

    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error("getAllOrders error:", err);
    return res.status(500).json({ success: false, message: "Fetch fail" });
  }
};

// ─── ASSIGN RIDER ─────────────────────────────────────────────────────────────

exports.assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;

    if (riderId) {
      const rider = await Rider.findById(riderId);
      if (!rider)
        return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedRider: riderId || null },
      { new: true }
    ).populate("assignedRider", "name phone status vehicleType");

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, data: order });
  } catch (err) {
    console.error("assignRider error:", err);
    return res.status(500).json({ success: false, message: "Assign fail ho gaya" });
  }
};

// ─── UPDATE ORDER ITEMS ───────────────────────────────────────────────────────

exports.updateOrderItems = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    const oldItems                 = order.items;
    const { resolved, totalPrice } = await resolveItems(req.body.items);

    if (order.status !== "cancelled") {
      await restoreStock(oldItems, order._id, "Order items updated (old)");
      await deductStock(resolved,  order._id, "Order items updated (new)");
    }

    order.items      = resolved;
    order.totalPrice = totalPrice;

    // Agar pehle coupon apply tha toh finalPrice bhi recalculate karo
    if (order.couponCode) {
      const couponResult = await applyCouponIfProvided(order.couponCode, totalPrice);
      if (couponResult) {
        order.couponDiscount = couponResult.couponDiscount;
        order.finalPrice     = couponResult.finalPrice;
      } else {
        // Coupon ab valid nahi raha — reset karo
        order.couponCode     = null;
        order.couponDiscount = 0;
        order.finalPrice     = null;
      }
    }

    if (order.paidAmount > (order.finalPrice ?? order.totalPrice))
      order.paidAmount = order.finalPrice ?? order.totalPrice;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user",          "name email")
      .populate("assignedRider", "name phone status vehicleType")
      .populate("items.product");

    return res.json({ success: true, message: "Order updated successfully", data: updatedOrder });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ success: false, message: err.message });

    console.error("updateOrderItems error:", err);
    return res.status(500).json({ success: false, message: "Order update fail ho gaya" });
  }
};

// ─── UPDATE PAYMENT ───────────────────────────────────────────────────────────

exports.updatePayment = async (req, res) => {
  try {
    const { paidAmount, paymentNote } = req.body;

    if (paidAmount === undefined || paidAmount === null)
      return res.status(400).json({ success: false, message: "paidAmount required hai" });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    // finalPrice hai toh usse cap karo, warna totalPrice se
    const effectiveTotal = order.finalPrice ?? order.totalPrice;
    const safeAmount     = Math.min(Math.max(0, Number(paidAmount) || 0), effectiveTotal);

    order.paidAmount = safeAmount;
    if (paymentNote !== undefined) order.paymentNote = paymentNote;

    // paymentStatus pre-save hook se auto-set hoga
    await order.save();

    return res.json({ success: true, message: "Payment updated successfully", data: order });
  } catch (err) {
    console.error("updatePayment error:", err);
    return res.status(500).json({ success: false, message: "Payment update fail ho gaya" });
  }
};