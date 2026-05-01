// const VendorOrder = require("../models/VendorOrder");

// /* ======================================================
//    CREATE ORDER (TEST / USER SIDE)
// ====================================================== */
// exports.createOrder = async (req, res) => {
//   try {
//     const { vendor, user, items, paymentMode } = req.body;

//     if (!vendor || !user || !items || !items.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const totalAmount = items.reduce(
//       (sum, i) => sum + i.price * i.quantity,
//       0
//     );

//     const order = await VendorOrder.create({
//       vendor,
//       user,
//       items,
//       totalAmount,
//       paymentMode: paymentMode || "cod",
//     });

//     res.json({ success: true, data: order });
//   } catch (err) {
//     console.error("❌ createOrder error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//    GET VENDOR ORDERS
// ====================================================== */
// exports.getVendorOrders = async (req, res) => {
//   try {
//     const orders = await VendorOrder.find({
//       vendor: req.vendor.id,
//     })
//       .populate("user", "name phone")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: orders });
//   } catch (err) {
//     console.error("❌ getVendorOrders error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ======================================================
//    UPDATE ORDER STATUS (VENDOR)
// ====================================================== */
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await VendorOrder.findOne({
//       _id: req.params.id,
//       vendor: req.vendor.id,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     order.status = status;
//     await order.save();

//     res.json({ success: true, data: order });
//   } catch (err) {
//     console.error("❌ updateOrderStatus error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
const Order = require("../models/Order");

exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const orders = await Order.find({
      "items.vendorId": vendorId
    })
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    const data = orders.map(order => {
      const items = order.items.filter(
        item => item.vendorId && String(item.vendorId) === String(vendorId)
      );

      return {
        _id: order._id,
        user: order.user,
        userName: order.userName,
        status: order.status,
        paymentMode: order.paymentMode,
        totalPrice: items.reduce((sum, i) => sum + i.price, 0),
        items,
        createdAt: order.createdAt
      };
    });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vendorId = req.vendor.id;

    const allowed = ["accepted", "shipped", "delivered", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      "items.vendorId": vendorId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const isMixed = order.items.some(
      item => item.vendorId && String(item.vendorId) !== String(vendorId)
    );

    if (isMixed) {
      return res.status(400).json({
        success: false,
        message: "Cannot update mixed vendor order"
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};