// controllers/unitDefController.js
const UnitDef = require("../models/unitDefModel");

const DEFAULT_UNIT_DEFS = [
  { key: "pcs",    label: "Pcs",    multiplier: 1,   isDefault: true,  order: 0 },
  { key: "dozen",  label: "Dozen",  multiplier: 12,  isDefault: false, order: 1 },
  { key: "carton", label: "Carton", multiplier: 100, isDefault: false, order: 2 },
];

async function seedDefaults() {
  const count = await UnitDef.countDocuments();
  if (count === 0) {
    await UnitDef.insertMany(DEFAULT_UNIT_DEFS);
  }
}

/* ══════════════════════════════
   GET ALL
══════════════════════════════ */
exports.getUnitDefs = async (req, res) => {
  try {
    await seedDefaults();
    const units = await UnitDef.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════
   CREATE SINGLE
══════════════════════════════ */
exports.createUnitDef = async (req, res) => {
  try {
    const { key, label, multiplier, order } = req.body;

    if (!key || !label || multiplier == null)
      return res.status(400).json({ success: false, message: "key, label aur multiplier required hain." });

    if (Number(multiplier) < 1)
      return res.status(400).json({ success: false, message: "Multiplier 1 se kam nahi ho sakta." });

    const cleanKey = key.trim().toLowerCase();
    const existing = await UnitDef.findOne({ key: cleanKey });
    if (existing)
      return res.status(400).json({ success: false, message: `Key "${cleanKey}" pehle se exist karta hai.` });

    const unit = await UnitDef.create({
      key:        cleanKey,
      label:      label.trim(),
      multiplier: Number(multiplier),
      isDefault:  false,
      order:      order != null ? Number(order) : 99,
    });

    res.status(201).json({ success: true, data: unit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════
   UPDATE SINGLE
══════════════════════════════ */
exports.updateUnitDef = async (req, res) => {
  try {
    const unit = await UnitDef.findById(req.params.id);
    if (!unit)
      return res.status(404).json({ success: false, message: "Unit nahi mili." });

    const { label, multiplier, order } = req.body;

    if (label != null)      unit.label = label.trim();
    if (order != null)      unit.order = Number(order);
    if (multiplier != null) {
      if (Number(multiplier) < 1)
        return res.status(400).json({ success: false, message: "Multiplier 1 se kam nahi ho sakta." });
      unit.multiplier = Number(multiplier);
    }

    await unit.save();
    res.json({ success: true, data: unit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════
   DELETE SINGLE
══════════════════════════════ */
exports.deleteUnitDef = async (req, res) => {
  try {
    const unit = await UnitDef.findById(req.params.id);
    if (!unit)
      return res.status(404).json({ success: false, message: "Unit nahi mili." });

    if (unit.key === "pcs")
      return res.status(400).json({ success: false, message: "'pcs' default unit delete nahi ho sakta." });

    await UnitDef.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Unit delete ho gayi." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════
   BULK SAVE
   Replaces all non-default units,
   then upserts every incoming unit.
   Body: { units: [{ key, label, multiplier, order }] }
══════════════════════════════ */
exports.bulkSaveUnitDefs = async (req, res) => {
  try {
    const incoming = req.body.units;
    if (!Array.isArray(incoming))
      return res.status(400).json({ success: false, message: "units array required hai." });

    // Basic validation
    for (const u of incoming) {
      if (!u.key || !u.label || u.multiplier == null)
        return res.status(400).json({ success: false, message: "Har unit mein key, label aur multiplier hona chahiye." });
      if (Number(u.multiplier) < 1)
        return res.status(400).json({ success: false, message: `"${u.label}" ka multiplier 1 se kam nahi ho sakta.` });
    }

    // Duplicate key check
    const keys = incoming.map((u) => u.key.trim().toLowerCase());
    if (new Set(keys).size !== keys.length)
      return res.status(400).json({ success: false, message: "Duplicate unit keys hain." });

    // Delete non-default units, keep defaults in DB
    await UnitDef.deleteMany({ isDefault: false });

    // Figure out which keys are default
    const defaultUnits = await UnitDef.find({ isDefault: true });
    const defaultKeys  = new Set(defaultUnits.map((u) => u.key));

    // Upsert every incoming unit
    if (incoming.length > 0) {
      const ops = incoming.map((u, idx) => {
        const cleanKey  = u.key.trim().toLowerCase();
        const isDefault = defaultKeys.has(cleanKey);
        return {
          updateOne: {
            filter: { key: cleanKey },
            update: {
              $set: {
                label:      u.label.trim(),
                multiplier: Number(u.multiplier),
                isDefault,
                order:      u.order != null ? Number(u.order) : idx,
              },
            },
            upsert: true,
          },
        };
      });
      await UnitDef.bulkWrite(ops);
    }

    const all = await UnitDef.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════
   RESET TO DEFAULTS
══════════════════════════════ */
exports.resetUnitDefs = async (req, res) => {
  try {
    await UnitDef.deleteMany({});
    await UnitDef.insertMany(DEFAULT_UNIT_DEFS);
    const all = await UnitDef.find().sort({ order: 1 });
    res.json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};