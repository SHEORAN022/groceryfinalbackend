const VendorInventory = require("../models/VendorInventory");
const VendorProduct = require("../models/vendorProduct");

/* ======================================================
   CREATE / UPDATE INVENTORY
====================================================== */
exports.upsertInventory = async (req, res) => {
  try {
    const { productId, totalStock, minStock } = req.body;

    if (!productId || totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product and stock required",
      });
    }

    const product = await VendorProduct.findOne({
      _id: productId,
      vendor: req.vendor.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let inventory = await VendorInventory.findOne({
      vendor: req.vendor.id,
      product: productId,
    });

    if (inventory) {
      inventory.totalStock = totalStock;
      inventory.availableStock = totalStock;
      if (minStock !== undefined) inventory.minStock = minStock;
    } else {
      inventory = await VendorInventory.create({
        vendor: req.vendor.id,
        product: productId,
        totalStock,
        availableStock: totalStock,
        minStock: minStock || 5,
      });
    }

    inventory.outOfStock = inventory.availableStock <= 0;
    await inventory.save();

    res.json({
      success: true,
      message: "Inventory updated",
      data: inventory,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   GET INVENTORY LIST
====================================================== */
exports.getInventory = async (req, res) => {
  try {
    const inventory = await VendorInventory.find({
      vendor: req.vendor.id,
    })
      .populate("product", "name image basePrice salePrice")
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: inventory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
