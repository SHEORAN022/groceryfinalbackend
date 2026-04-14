// // const CustomHsn = require("../models/Customhsnmodel");

// // // ➜ Add Custom HSN
// // exports.createHsn = async (req, res) => {
// //   try {
// //     const { code, description, gst, category } = req.body;

// //     console.log("HSN BODY:", req.body);

// //     if (!code || !description || gst === undefined || gst === null || !category) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "All fields required (code, description, gst, category)",
// //       });
// //     }

// //     const cleanCode = code.toString().trim().toUpperCase();

// //     if (!/^\d{4,8}$/.test(cleanCode)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "HSN code must be 4–8 digits",
// //       });
// //     }

// //     const gstNum = Number(gst);
// //     if (![0, 5, 12, 18, 28].includes(gstNum)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "GST must be one of: 0, 5, 12, 18, 28",
// //       });
// //     }

// //     const exists = await CustomHsn.findOne({ code: cleanCode });
// //     if (exists) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `HSN code ${cleanCode} already exists`,
// //       });
// //     }

// //     const hsn = await CustomHsn.create({
// //       code:        cleanCode,
// //       description: description.trim(),
// //       gst:         gstNum,
// //       category:    category.trim(),
// //       isCustom:    true,
// //     });

// //     res.json({ success: true, data: hsn });
// //   } catch (err) {
// //     console.error("❌ createHsn error:", err.message);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // // ➜ Get Custom HSN list
// // exports.getCustomHsn = async (req, res) => {
// //   try {
// //     const data = await CustomHsn.find().sort({ createdAt: -1 });
// //     res.json({ success: true, data });
// //   } catch (err) {
// //     console.error("❌ getCustomHsn error:", err.message);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// const CustomHsn = require("../models/Customhsnmodel");

// // ➜ Add Custom HSN
// exports.createHsn = async (req, res) => {
//   try {
//     const { code, description, gst, category } = req.body;

//     console.log("HSN BODY:", req.body);

//     if (!code || !description || gst === undefined || gst === null || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required (code, description, gst, category)",
//       });
//     }

//     const cleanCode = code.toString().trim().toUpperCase();

//     if (!/^\d{4,8}$/.test(cleanCode)) {
//       return res.status(400).json({
//         success: false,
//         message: "HSN code must be 4–8 digits",
//       });
//     }

//     const gstNum = Number(gst);
//     if (![0, 5, 12, 18, 28].includes(gstNum)) {
//       return res.status(400).json({
//         success: false,
//         message: "GST must be one of: 0, 5, 12, 18, 28",
//       });
//     }

//     const exists = await CustomHsn.findOne({ code: cleanCode });
//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: `HSN code ${cleanCode} already exists`,
//       });
//     }

//     const hsn = await CustomHsn.create({
//       code:        cleanCode,
//       description: description.trim(),
//       gst:         gstNum,
//       category:    category.trim(),
//       isCustom:    true,
//     });

//     res.json({ success: true, data: hsn });
//   } catch (err) {
//     console.error("❌ createHsn error:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ➜ Get all Custom HSN list
// exports.getCustomHsn = async (req, res) => {
//   try {
//     const data = await CustomHsn.find().sort({ createdAt: -1 });
//     res.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ getCustomHsn error:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ➜ Delete Custom HSN by ID
// exports.deleteHsn = async (req, res) => {
//   try {
//     const deleted = await CustomHsn.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "HSN not found" });
//     }
//     res.json({ success: true, message: "HSN deleted" });
//   } catch (err) {
//     console.error("❌ deleteHsn error:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



const CustomHsn = require("../models/Customhsnmodel");

// ➜ Add Custom HSN
exports.createHsn = async (req, res) => {
  try {
    const { code, description, gst, category } = req.body;

    console.log("HSN BODY:", req.body);

    if (!code || !description || gst === undefined || gst === null || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields required (code, description, gst, category)",
      });
    }

    const cleanCode = code.toString().trim().toUpperCase();

    if (!/^\d{4,8}$/.test(cleanCode)) {
      return res.status(400).json({
        success: false,
        message: "HSN code must be 4–8 digits",
      });
    }

    const gstNum = Number(gst);
    if (![0, 5, 12, 18, 28].includes(gstNum)) {
      return res.status(400).json({
        success: false,
        message: "GST must be one of: 0, 5, 12, 18, 28",
      });
    }

    const exists = await CustomHsn.findOne({ code: cleanCode });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `HSN code ${cleanCode} already exists`,
      });
    }

    const hsn = await CustomHsn.create({
      code:        cleanCode,
      description: description.trim(),
      gst:         gstNum,
      category:    category.trim(),
      isCustom:    true,
    });

    res.json({ success: true, data: hsn });
  } catch (err) {
    console.error("❌ createHsn error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ➜ Get all Custom HSN list
exports.getCustomHsn = async (req, res) => {
  try {
    const data = await CustomHsn.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ getCustomHsn error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ➜ Delete Custom HSN by ID
exports.deleteHsn = async (req, res) => {
  try {
    const deleted = await CustomHsn.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "HSN not found" });
    }
    res.json({ success: true, message: "HSN deleted" });
  } catch (err) {
    console.error("❌ deleteHsn error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};