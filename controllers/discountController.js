const DiscountRule = require("../models/DiscountRule");
const Price        = require("../models/priceModel");

function validateRule({ minQty, maxQty, profit, unitPrice, basePrice }) {
  if (minQty === undefined || minQty === null || minQty === "")
    return "Min Qty is required";
  if (!Number.isInteger(Number(minQty)) || Number(minQty) < 1)
    return "Min Qty must be an integer ≥ 1";
  if (
    maxQty !== null &&
    maxQty !== undefined &&
    maxQty !== "" &&
    Number(maxQty) < Number(minQty)
  )
    return "Max Qty must be ≥ Min Qty";
  if (unitPrice === undefined || unitPrice === null || unitPrice === "")
    return "Unit Price is required";
  if (Number(unitPrice) < 0) return "Unit Price cannot be negative";
  if (basePrice === undefined || basePrice === null)
    return "Base Price is required";
  return null; // no error
}


exports.addDiscount = async (req, res) => {
  try {
    const { product, minQty, maxQty = null, profit = 0, unitPrice } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }


    const productDoc = await Price.findById(product).select("basePrice name");
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const basePrice = Number(productDoc.basePrice || 0);

 
    let finalUnitPrice;
    let finalProfit;

    if (unitPrice !== undefined && unitPrice !== null && unitPrice !== "") {
      finalUnitPrice = Number(Number(unitPrice).toFixed(2));
      finalProfit    = Number((finalUnitPrice - basePrice).toFixed(2));
    } else {
      finalProfit    = Number(profit || 0);
      finalUnitPrice = Number((basePrice + finalProfit).toFixed(2));
    }

   
    const validError = validateRule({
      minQty,
      maxQty: maxQty === "" ? null : maxQty,
      profit: finalProfit,
      unitPrice: finalUnitPrice,
      basePrice,
    });
    if (validError) {
      return res.status(400).json({ success: false, message: validError });
    }

  
    const exists = await DiscountRule.findOne({
      product,
      minQty: Number(minQty),
      maxQty: maxQty === "" || maxQty === null ? null : Number(maxQty),
    });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "A price rule for this quantity range already exists",
      });
    }

    const rule = await DiscountRule.create({
      product,
      minQty:    Number(minQty),
      maxQty:    maxQty === "" || maxQty === null ? null : Number(maxQty),
      basePrice,
      profit:    finalProfit,
      unitPrice: finalUnitPrice,
    });

   
    await rule.populate("product", "name basePrice");

    return res.status(201).json({
      success: true,
      message: "Price range added successfully",
      data: {
        ...rule.toObject(),
        profitPercent: rule.profitPercent,
      },
    });
  } catch (err) {
    console.error("Add Discount Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add price range",
    });
  }
};

exports.getAllDiscounts = async (req, res) => {
  try {
    const { product: productId } = req.query;

    const query = {};
    if (productId) query.product = productId;

    const rules = await DiscountRule.find(query)
      .populate("product", "name basePrice")
      .sort({ minQty: 1 });

    return res.json({
      success: true,
      count: rules.length,
      data: rules.map((r) => ({
        ...r.toObject(),
        profitPercent: r.profitPercent,
      })),
    });
  } catch (err) {
    console.error("Get Discount Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch price ranges",
    });
  }
};


exports.getByProduct = async (req, res) => {
  try {
    const rules = await DiscountRule.find({ product: req.params.productId })
      .populate("product", "name basePrice")
      .sort({ minQty: 1 });

    return res.json({
      success: true,
      count: rules.length,
      data: rules.map((r) => ({
        ...r.toObject(),
        profitPercent: r.profitPercent,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateDiscount = async (req, res) => {
  try {
    const rule = await DiscountRule.findById(req.params.id).populate(
      "product",
      "basePrice name"
    );
    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Price range not found",
      });
    }

    const { minQty, maxQty, profit, unitPrice } = req.body;

   
    const basePrice = Number(rule.product?.basePrice || rule.basePrice || 0);


    let newUnitPrice = rule.unitPrice;
    let newProfit    = rule.profit;

    if (unitPrice !== undefined && unitPrice !== "") {
      newUnitPrice = Number(Number(unitPrice).toFixed(2));
      newProfit    = Number((newUnitPrice - basePrice).toFixed(2));
    } else if (profit !== undefined && profit !== "") {
      newProfit    = Number(profit);
      newUnitPrice = Number((basePrice + newProfit).toFixed(2));
    }

    const newMinQty = minQty !== undefined ? Number(minQty) : rule.minQty;
    const newMaxQty =
      maxQty === null || maxQty === "" || maxQty === undefined
        ? null
        : Number(maxQty);

    // Validate
    const validError = validateRule({
      minQty:    newMinQty,
      maxQty:    newMaxQty,
      profit:    newProfit,
      unitPrice: newUnitPrice,
      basePrice,
    });
    if (validError) {
      return res.status(400).json({ success: false, message: validError });
    }

    rule.minQty    = newMinQty;
    rule.maxQty    = newMaxQty;
    rule.basePrice = basePrice;
    rule.profit    = newProfit;
    rule.unitPrice = newUnitPrice;

    await rule.save();

    return res.json({
      success: true,
      message: "Price range updated",
      data: {
        ...rule.toObject(),
        profitPercent: rule.profitPercent,
      },
    });
  } catch (err) {
    console.error("Update Discount Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update price range",
    });
  }
};


exports.deleteDiscount = async (req, res) => {
  try {
    const rule = await DiscountRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Price range not found",
      });
    }

    return res.json({
      success: true,
      message: "Price range deleted successfully",
    });
  } catch (err) {
    console.error("Delete Discount Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete price range",
    });
  }
};

exports.deleteByProduct = async (req, res) => {
  try {
    const result = await DiscountRule.deleteMany({
      product: req.params.productId,
    });
    return res.json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} price ranges deleted`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.recalculateForProduct = async (productId, newBasePrice) => {
  try {
    const rules = await DiscountRule.find({ product: productId });
    for (const rule of rules) {
      rule.basePrice = Number(newBasePrice);
      rule.unitPrice = Number((rule.basePrice + rule.profit).toFixed(2));
      await rule.save();
    }
  } catch (err) {
    console.error("Recalculate ranges error:", err);
  }
};