// const Order  = require("../models/Order");
// const Price  = require("../models/priceModel");
// const User   = require("../models/User");
// const Rider  = require("../models/Rider");

// const resolveItems = async (rawItems) => {
//   if (!Array.isArray(rawItems) || rawItems.length === 0) {
//     throw { status: 400, message: "Items array required aur empty nahi hona chahiye" };
//   }

//   const resolved = await Promise.all(
//     rawItems.map(async (it, idx) => {
//       if (!it.productId) {
//         throw { status: 400, message: `Item ${idx + 1}: productId missing hai` };
//       }

//       const qty = Number(it.quantity);
//       if (!Number.isInteger(qty) || qty < 1) {
//         throw { status: 400, message: `Item ${idx + 1}: quantity valid nahi hai (min 1)` };
//       }

//       const product = await Price.findById(it.productId);
//       if (!product) {
//         throw { status: 404, message: `Product nahi mila: ${it.productId}` };
//       }
//       if (product.status !== "active") {
//         throw { status: 400, message: `Product active nahi hai: ${product.name}` };
//       }

//       return {
//         product:   product._id,
//         name:      product.name,
//         image:     product.image || "",
//         unitPrice: product.salePrice,
//         quantity:  qty,
//         price:     +(product.salePrice * qty).toFixed(2),
//       };
//     })
//   );

//   const totalPrice = +resolved.reduce((sum, i) => sum + i.price, 0).toFixed(2);

//   return { resolved, totalPrice };
// };

// /* ═══════════════════════════════════════════════════════
//    CREATE ORDER  —  POST /api/orders
//    Body: { items: [{ productId, quantity }], address }
// ═══════════════════════════════════════════════════════ */
// exports.createOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { items, address } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { resolved, totalPrice } = await resolveItems(items);

//     const order = await Order.create({
//       user:       user._id,
//       userName:   user.name || user.email,
//       items:      resolved,
//       totalPrice,
//       address,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       data: {
//         orderId:    order._id,
//         items:      order.items,
//         totalPrice: order.totalPrice,
//         status:     order.status,
//         createdAt:  order.createdAt,
//       },
//     });
//   } catch (err) {
//     if (err.status) {
//       return res.status(err.status).json({ success: false, message: err.message });
//     }
//     console.error("Create Order Error:", err);
//     return res.status(500).json({ success: false, message: "Order place karna fail ho gaya" });
//   }
// };

// /* ═══════════════════════════════════════════════════════
//    GET MY ORDERS  —  GET /api/orders/my
// ═══════════════════════════════════════════════════════ */
// exports.getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id })
//       .populate("items.product", "name image salePrice")
//       .populate("assignedRider", "name phone vehicleType status")
//       .sort({ createdAt: -1 });

//     return res.json({ success: true, count: orders.length, data: orders });
//   } catch (err) {
//     console.error("Get My Orders Error:", err);
//     return res.status(500).json({ success: false, message: "Orders fetch karna fail ho gaya" });
//   }
// };

// /* ═══════════════════════════════════════════════════════
//    GET ALL ORDERS  —  GET /api/orders  (Admin)
// ═══════════════════════════════════════════════════════ */
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email")
//       .populate("items.product", "name image salePrice")
//       .populate("assignedRider", "name phone vehicleType status")
//       .sort({ createdAt: -1 });

//     return res.json({ success: true, count: orders.length, data: orders });
//   } catch (err) {
//     console.error("Get All Orders Error:", err);
//     return res.status(500).json({ success: false, message: "Orders fetch karna fail ho gaya" });
//   }
// };

// /* ═══════════════════════════════════════════════════════
//    UPDATE ORDER STATUS  —  PUT /api/orders/:id/status  (Admin)
//    Body: { status }
// ═══════════════════════════════════════════════════════ */
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const allowed = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

//     if (!allowed.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status value" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     return res.json({ success: true, message: "Status updated", data: order });
//   } catch (err) {
//     console.error("Update Status Error:", err);
//     return res.status(500).json({ success: false, message: "Status update fail ho gaya" });
//   }
// };

// /* ═══════════════════════════════════════════════════════
//    ASSIGN RIDER  —  PUT /api/orders/:id/assign-rider  (Admin)
//    Body: { riderId }  — null bhejo unassign ke liye
// ═══════════════════════════════════════════════════════ */
// exports.assignRider = async (req, res) => {
//   try {
//     const { riderId } = req.body;

//     if (riderId) {
//       const rider = await Rider.findById(riderId);
//       if (!rider) {
//         return res.status(404).json({ success: false, message: "Rider not found" });
//       }
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { assignedRider: riderId || null },
//       { new: true }
//     ).populate("assignedRider", "name phone vehicleType status");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     return res.json({
//       success: true,
//       message: riderId ? "Rider assigned" : "Rider unassigned",
//       data: order,
//     });
//   } catch (err) {
//     console.error("Assign Rider Error:", err);
//     return res.status(500).json({ success: false, message: "Rider assign fail ho gaya" });
//   }
// };

// /* ═══════════════════════════════════════════════════════
//    UPDATE ORDER ITEMS  —  PUT /api/orders/:id/items  (Admin)
//    Body: { items: [{ productId, quantity }] }
//    Admin existing items replace/edit/remove kar sakta hai
// ═══════════════════════════════════════════════════════ */
// exports.updateOrderItems = async (req, res) => {
//   try {
//     const { items } = req.body;

//     const { resolved, totalPrice } = await resolveItems(items);

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         items:      resolved,
//         totalPrice,
//       },
//       { new: true, runValidators: true }
//     )
//       .populate("user", "name email")
//       .populate("items.product", "name image salePrice")
//       .populate("assignedRider", "name phone vehicleType status");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     return res.json({
//       success: true,
//       message: "Order items updated successfully",
//       data: order,
//     });
//   } catch (err) {
//     if (err.status) {
//       return res.status(err.status).json({ success: false, message: err.message });
//     }
//     console.error("Update Order Items Error:", err);
//     return res.status(500).json({ success: false, message: "Order update fail ho gaya" });
//   }
// };

const Order  = require("../models/Order");
const Price  = require("../models/priceModel");
const User   = require("../models/User");
const Rider  = require("../models/Rider");

const resolveItems = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw { status: 400, message: "Items array required aur empty nahi hona chahiye" };
  }

  const resolved = await Promise.all(
    rawItems.map(async (it, idx) => {
      if (!it.productId) {
        throw { status: 400, message: `Item ${idx + 1}: productId missing hai` };
      }

      const qty = Number(it.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        throw { status: 400, message: `Item ${idx + 1}: quantity valid nahi hai (min 1)` };
      }

      const product = await Price.findById(it.productId);
      if (!product) {
        throw { status: 404, message: `Product nahi mila: ${it.productId}` };
      }
      if (product.status !== "active") {
        throw { status: 400, message: `Product active nahi hai: ${product.name}` };
      }

      return {
        product:   product._id,
        name:      product.name,
        image:     product.image || "",
        unitPrice: product.salePrice,
        quantity:  qty,
        price:     +(product.salePrice * qty).toFixed(2),
      };
    })
  );

  const totalPrice = +resolved.reduce((sum, i) => sum + i.price, 0).toFixed(2);

  return { resolved, totalPrice };
};

/* ═══════════════════════════════════════════════════════
   CREATE ORDER  —  POST /api/orders
   Body: { items: [{ productId, quantity }], address }
═══════════════════════════════════════════════════════ */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { resolved, totalPrice } = await resolveItems(items);

    const order = await Order.create({
      user:       user._id,
      userName:   user.name || user.email,
      items:      resolved,
      totalPrice,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId:    order._id,
        items:      order.items,
        totalPrice: order.totalPrice,
        status:     order.status,
        createdAt:  order.createdAt,
      },
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    console.error("Create Order Error:", err);
    return res.status(500).json({ success: false, message: "Order place karna fail ho gaya" });
  }
};

/* ═══════════════════════════════════════════════════════
   GET MY ORDERS  —  GET /api/orders/my
═══════════════════════════════════════════════════════ */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user", "name email")
      // ── FIX: sab zaruri fields populate karo estimate ke liye ──
      .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
      .populate("assignedRider", "name phone vehicleType status")
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error("Get My Orders Error:", err);
    return res.status(500).json({ success: false, message: "Orders fetch karna fail ho gaya" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      // ── FIX: sab zaruri fields populate karo estimate ke liye ──
      .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
      .populate("assignedRider", "name phone vehicleType status")
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    return res.status(500).json({ success: false, message: "Orders fetch karna fail ho gaya" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, message: "Status updated", data: order });
  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({ success: false, message: "Status update fail ho gaya" });
  }
};


exports.assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;

    if (riderId) {
      const rider = await Rider.findById(riderId);
      if (!rider) {
        return res.status(404).json({ success: false, message: "Rider not found" });
      }
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedRider: riderId || null },
      { new: true }
    ).populate("assignedRider", "name phone vehicleType status");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      message: riderId ? "Rider assigned" : "Rider unassigned",
      data: order,
    });
  } catch (err) {
    console.error("Assign Rider Error:", err);
    return res.status(500).json({ success: false, message: "Rider assign fail ho gaya" });
  }
};


exports.updateOrderItems = async (req, res) => {
  try {
    const { items } = req.body;

    const { resolved, totalPrice } = await resolveItems(items);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        items:      resolved,
        totalPrice,
      },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      // ── FIX: items update ke baad bhi sab fields aayein ──
      .populate("items.product", "name image salePrice mrp hsn gstRate unit weight brand")
      .populate("assignedRider", "name phone vehicleType status");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      message: "Order items updated successfully",
      data: order,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    console.error("Update Order Items Error:", err);
    return res.status(500).json({ success: false, message: "Order update fail ho gaya" });
  }
};